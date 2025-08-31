import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import { FourSquare } from "react-loading-indicators";
import { ArrowLeft, Plus, MoreVertical, Send, Users, Search, X } from 'lucide-react';
import { apiRequest } from '../../../Api'; // Adjust path as needed
import { useAuth } from "../../../Context/AuthContext";

const SERVER_URL = import.meta.env.VITE_BASE_URL;

// Utility functions (keep unchanged as before)
const formatTime = (timestamp) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  const now = new Date();
  const messageDate = new Date(date);

  if (now.toDateString() === messageDate.toDateString()) {
    return messageDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (yesterday.toDateString() === messageDate.toDateString()) {
    return 'Yesterday';
  }

  return messageDate.toLocaleDateString('en-GB');
};

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?";
  return name
    .trim()
    .split(" ")
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");
};

const Avatar = React.memo(({ name, size = 'w-10 h-10', online = false }) => (
  <div className={`${size} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold relative flex-shrink-0`}>
    {getInitials(name)}
    {online && (
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
    )}
  </div>
));

const MessageStatus = React.memo(({ status, isGroup = false }) => {
  if (isGroup) return null;
  return (
    <span className="text-xs ml-1">
      {status === 'sent' && <span className="text-gray-400">✓</span>}
      {status === 'delivered' && <span className="text-gray-400">✓✓</span>}
      {status === 'read' && <span className="text-blue-400">✓✓</span>}
    </span>
  );
});

const ChatApp = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  
  // FIXED: Store messages per chat instead of globally
  const [chatMessages, setChatMessages] = useState({}); // chatId -> messages[]
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  
  // FIXED: Store typing users per chat
  const [typingUsers, setTypingUsers] = useState({}); // chatId -> Set of typing users
  
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Mobile responsive states
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);
  const loadingMessagesRef = useRef(false);

  // User filter state
  const [userFilter, setUserFilter] = useState('');

  // HELPER: Get chat ID from message
  const getChatIdFromMessage = useCallback((message) => {
    if (message.type === 'direct') {
      // For direct messages, chat ID is the other user's email
      return message.from === user?.email ? message.to : message.from;
    } else if (message.type === 'group') {
      return message.to; // Group ID
    }
    return null;
  }, [user?.email]);

  // HELPER: Get current chat messages
  const currentMessages = useMemo(() => {
    if (!activeChat) return [];
    return chatMessages[activeChat.id] || [];
  }, [chatMessages, activeChat]);

  // HELPER: Get current typing users for active chat
  const currentTypingUsers = useMemo(() => {
    if (!activeChat) return new Set();
    return typingUsers[activeChat.id] || new Set();
  }, [typingUsers, activeChat]);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when chat is selected on mobile
  const handleChatSelect = useCallback((chat) => {
    setActiveChat(chat);
    if (isMobile) {
      setShowSidebar(false);
    }
    // Reset unread count for active chat on select
    setUnreadCounts(prev => ({ ...prev, [chat.id]: 0 }));
  }, [isMobile]);

  // Memoized filtered users list
  const filteredUsers = useMemo(() => {
    if (!userFilter.trim()) return users;
    const filter = userFilter.toLowerCase();
    return users.filter(u =>
      (u.name && u.name.toLowerCase().includes(filter)) ||
      (u.username && u.username.toLowerCase().includes(filter)) ||
      (u.email && u.email.toLowerCase().includes(filter))
    );
  }, [users, userFilter]);

  // Initialize socket connection once, stable dependencies to avoid re-init
  useEffect(() => {
    if (!token || socketRef.current) return;

    let cleanup = false;

    const initSocket = () => {
      try {
        const socketInstance = io(SERVER_URL, {
          auth: { token },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketRef.current = socketInstance;

        socketInstance.on('connect', () => {
          if (cleanup) return;
          setIsConnected(true);
          setConnectionError('');
          setSocket(socketInstance);
        });

        socketInstance.on('connect_error', () => {
          if (cleanup) return;
          setConnectionError('Failed to connect to server');
          setIsConnected(false);
        });

        socketInstance.on('disconnect', () => {
          if (cleanup) return;
          setIsConnected(false);
        });

        // FIXED: Incoming new message handler with proper chat isolation
        socketInstance.on('newMessage', (message) => {
          if (cleanup) return;

          const chatId = getChatIdFromMessage(message);
          if (!chatId) return;

          // Add message to the correct chat
          setChatMessages(prev => {
            const currentChatMessages = prev[chatId] || [];
            // Prevent duplicates
            if (currentChatMessages.some(m => m._id === message._id)) {
              return prev;
            }
            
            return {
              ...prev,
              [chatId]: [...currentChatMessages, message]
            };
          });

          // Only update unread count if not currently viewing this chat
          const isCurrentlyActiveChat = activeChat?.id === chatId;
          if (!isTabVisible || !isCurrentlyActiveChat) {
            setUnreadCounts(prev => ({
              ...prev,
              [chatId]: (prev[chatId] || 0) + 1,
            }));
          }

          // Bring chat to top
          if (message.type === 'direct') {
            setUsers(prev => {
              const index = prev.findIndex(u => u.email === message.from);
              if (index === -1) return prev;
              const contact = prev[index];
              return [contact, ...prev.filter((_, i) => i !== index)];
            });
          } else if (message.type === 'group') {
            setGroups(prev => {
              const index = prev.findIndex(g => g._id === message.to);
              if (index === -1) return prev;
              const group = prev[index];
              return [group, ...prev.filter((_, i) => i !== index)];
            });
          }
        });

        socketInstance.on('messageStatusUpdate', (data) => {
          if (cleanup) return;
          
          // Update message status across all chats
          setChatMessages(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(chatId => {
              updated[chatId] = updated[chatId].map(msg =>
                msg._id === data.messageId
                  ? { ...msg, status: data.status }
                  : msg
              );
            });
            return updated;
          });
        });

        socketInstance.on('userStatusUpdate', (data) => {
          if (cleanup) return;
          setUsers(prev =>
            prev.map(u =>
              u.email === data.email
                ? {
                  ...u,
                  isOnline: data.isOnline,
                  isTabVisible: data.isTabVisible,
                  lastSeen: data.lastSeen
                }
                : u
            )
          );
        });

        // FIXED: Typing indicator with proper chat isolation
        socketInstance.on('userTyping', (data) => {
          if (cleanup) return;
          
          const { user: typingUser, isTyping, chatId } = data;
          
          setTypingUsers(prev => {
            const updated = { ...prev };
            const currentTypingSet = new Set(updated[chatId] || []);
            
            if (isTyping) {
              currentTypingSet.add(typingUser);
            } else {
              currentTypingSet.delete(typingUser);
            }
            
            updated[chatId] = currentTypingSet;
            return updated;
          });
        });

        socketInstance.on('messagesRead', (data) => {
          if (cleanup) return;
          if (activeChat?.type === 'direct' && activeChat?.id === data.reader) {
            setChatMessages(prev => {
              const updated = { ...prev };
              const chatMessages = updated[activeChat.id] || [];
              updated[activeChat.id] = chatMessages.map(msg =>
                msg.from === user?.email && msg.status !== 'read'
                  ? { ...msg, status: 'read' }
                  : msg
              );
              return updated;
            });
          }
        });

        return socketInstance;
      } catch {
        setConnectionError('Failed to initialize connection');
        setIsConnected(false);
        return null;
      }
    };

    const socketInstance = initSocket();

    return () => {
      cleanup = true;
      if (socketInstance) {
        socketInstance.disconnect();
      }
      socketRef.current = null;
    };
  }, [token, activeChat?.id, activeChat?.type, isTabVisible, user?.email, getChatIdFromMessage]);

  // Tab visibility handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsTabVisible(visible);
      if (socketRef.current && isConnected) {
        socketRef.current.emit('tabVisibility', { isVisible: visible });
      }
    };

    const handleFocus = () => {
      setIsTabVisible(true);
      if (socketRef.current && isConnected) socketRef.current.emit('tabVisibility', { isVisible: true });
    };

    const handleBlur = () => {
      setIsTabVisible(false);
      if (socketRef.current && isConnected) socketRef.current.emit('tabVisibility', { isVisible: false });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isConnected]);

  // Fetch users and groups once after connection established and only once (use dataLoaded flag)
  useEffect(() => {
    if (!token || !isConnected || dataLoaded) return;

    // Fetch users/groups concurrently
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, groupsData] = await Promise.all([
          apiRequest('GET', '/chat/users'),
          apiRequest('GET', '/chat/groups')
        ]);
        setUsers(usersData);
        setGroups(groupsData);
        setConnectionError('');
        setDataLoaded(true);
      } catch {
        setConnectionError('Failed to load chat data');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchData, 100);
    return () => clearTimeout(timeoutId);
  }, [token, isConnected, dataLoaded]);

  // Load messages only when active chat changes (debounced)
  useEffect(() => {
    if (!activeChat || loadingMessagesRef.current || !token || !isConnected) return;

    const loadMessages = async () => {
      if (loadingMessagesRef.current) return;
      try {
        loadingMessagesRef.current = true;
        const endpoint = activeChat.type === 'direct'
          ? `/chat/messages/direct/${activeChat.id}`
          : `/chat/messages/group/${activeChat.id}`;

        const messagesData = await apiRequest('GET', endpoint);
        
        // FIXED: Store messages for this specific chat
        setChatMessages(prev => ({
          ...prev,
          [activeChat.id]: messagesData
        }));

        // Mark messages as read server-side
        await apiRequest('POST', '/chat/messages/read', {
          chatId: activeChat.id,
          type: activeChat.type
        });

        setUnreadCounts(prev => ({ ...prev, [activeChat.id]: 0 }));

        if (socketRef.current) {
          socketRef.current.emit('markAsRead', {
            chatId: activeChat.id,
            type: activeChat.type
          });
        }
      } catch (e) {
        console.error('Failed to load messages:', e);
      } finally {
        loadingMessagesRef.current = false;
      }
    };

    const timeoutId = setTimeout(loadMessages, 50);
    return () => clearTimeout(timeoutId);
  }, [activeChat?.id, activeChat?.type, token, isConnected]);

  // Autoscroll messages on new message
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentMessages.length]);

  // FIXED: Typing handler with proper chat isolation
  const handleTyping = useCallback((typing) => {
    if (!socketRef.current || !activeChat || !isConnected) return;

    if (typing) {
      socketRef.current.emit('typing', {
        to: activeChat.id,
        type: activeChat.type,
        chatId: activeChat.id, // Add chatId for proper isolation
        isTyping: true
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('typing', {
          to: activeChat.id,
          type: activeChat.type,
          chatId: activeChat.id,
          isTyping: false
        });
      }, 3000);
    } else {
      socketRef.current.emit('typing', {
        to: activeChat.id,
        type: activeChat.type,
        chatId: activeChat.id,
        isTyping: false
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [activeChat, isConnected]);

  // Send message optimized
  const sendMessage = useCallback(() => {
    if (!messageInput.trim() || !activeChat || !socketRef.current || !isConnected) return;

    const messageContent = messageInput.trim();
    const eventName = activeChat.type === 'direct' ? 'sendDirectMessage' : 'sendGroupMessage';
    const payload = activeChat.type === 'direct'
      ? { to: activeChat.id, content: messageContent }
      : { groupId: activeChat.id, content: messageContent };

    socketRef.current.emit(eventName, payload);
    setMessageInput('');
    handleTyping(false);
  }, [messageInput, activeChat, isConnected, handleTyping]);

  // GroupModal component (no change except using stable state setters)
  const GroupModal = () => {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [creating, setCreating] = useState(false);

    const createGroup = async () => {
      if (!groupName.trim() || selectedMembers.length === 0) {
        alert('Group name and at least one member are required');
        return;
      }

      setCreating(true);
      try {
        const newGroup = await apiRequest('POST', '/chat/groups', {
          name: groupName,
          description: groupDescription,
          members: selectedMembers,
        });

        setGroups(prev => [newGroup, ...prev]);
        setShowGroupModal(false);
        setGroupName('');
        setGroupDescription('');
        setSelectedMembers([]);

        if (socketRef.current) {
          socketRef.current.emit('joinGroup', { groupId: newGroup._id });
        }
      } catch (error) {
        console.error('Failed to create group:', error);
        alert('Failed to create group. Please try again.');
      } finally {
        setCreating(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create Group</h3>
            <button
              onClick={() => setShowGroupModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Group description (optional)"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="2"
          />

          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 mb-2">Select members:</p>
            <div className="max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded">
              {users.map(u => (
                <label key={u._id} className="flex items-center p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(u.email)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers(prev => [...prev, u.email]);
                      } else {
                        setSelectedMembers(prev => prev.filter(email => email !== u.email));
                      }
                    }}
                    className="mr-3"
                  />
                  <Avatar name={u.name || u.username} size="w-8 h-8" online={u.isOnline} />
                  <span className="text-gray-900 dark:text-white ml-3">{u.name || u.username}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowGroupModal(false)}
              disabled={creating}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={createGroup}
              disabled={creating || !groupName.trim() || selectedMembers.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FourSquare
          color="#acadac"
          size="medium"
          text="Loading..."
          textColor="#acadac"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white relative">
      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isMobile
          ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          }`
          : 'relative'
      } w-80 max-w-[80vw] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>

        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isMobile && (
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <Avatar name={user?.name || user?.username || "me"} online={isConnected} />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{user?.name || user?.username || user?.email}</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isConnected ? (isTabVisible ? 'Online' : 'Away') : 'Connecting...'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowGroupModal(true)}
            disabled={!isConnected}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200 disabled:opacity-50"
            title="Create Group"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Connection Status */}
        {connectionError && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border-b border-red-200 dark:border-red-700">
            <p className="text-red-800 dark:text-red-200 text-sm">{connectionError}</p>
          </div>
        )}

        {/* User Filter Input */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Filter users"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto">
          {/* Direct Messages */}
          <div className="p-3">
            <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              DIRECT MESSAGES
            </h4>
            {filteredUsers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No users available</p>
            ) : (
              filteredUsers.map(u => (
                <div
                  key={u._id}
                  onClick={() => handleChatSelect({
                    id: u.email,
                    name: u.name || u.username,
                    type: 'direct',
                    user: u
                  })}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 mb-1 transition duration-200 ${
                    activeChat?.id === u.email ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <Avatar name={u.name || u.username || u.email} online={u.isOnline} />
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium truncate">{u.name || u.username || u.email}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {u.isOnline ? 'Now' : formatTime(u.lastSeen)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {u.isOnline ? (u.isTabVisible ? 'Online' : 'Away') : `Last seen ${formatTime(u.lastSeen)}`}
                    </p>
                  </div>
                  {unreadCounts[u.email] > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2 flex-shrink-0">
                      {unreadCounts[u.email]}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Group Chats */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3">GROUPS</h4>
            {groups.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No groups available</p>
            ) : (
              groups.map(g => (
                <div
                  key={g._id}
                  onClick={() => handleChatSelect({ id: g._id, name: g.name, type: 'group', group: g })}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 mb-1 transition duration-200 ${
                    activeChat?.id === g._id ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {getInitials(g.name)}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium truncate">{g.name}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(g.updatedAt)}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {g.members.length} members
                    </p>
                  </div>
                  {unreadCounts[g._id] > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2 flex-shrink-0">
                      {unreadCounts[g._id]}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center min-w-0">
                {isMobile && (
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-2 transition duration-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <Avatar
                  name={activeChat.name}
                  online={activeChat.type === 'direct' ? activeChat.user?.isOnline : false}
                />
                <div className="ml-3 min-w-0">
                  <h3 className="font-semibold truncate">{activeChat.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {activeChat.type === 'direct'
                      ? (activeChat.user?.isOnline
                        ? (activeChat.user?.isTabVisible ? 'Online' : 'Away')
                        : `Last seen ${formatTime(activeChat.user?.lastSeen)}`
                      )
                      : `${activeChat.group?.members.length} members`
                    }
                  </p>
                </div>
              </div>

              {/* Chat Actions */}
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200"
                  title="More Options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                currentMessages.map((msg, index) => {
                  const isOwn = msg.from === user?.email;
                  const showSender = activeChat.type === 'group' && !isOwn;

                  return (
                    <div key={msg._id || index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                      }`}>
                        {showSender && (
                          <p className="text-xs font-medium mb-1 text-blue-600 dark:text-blue-300">
                            {users.find(u => u.email === msg.from)?.name ||
                              users.find(u => u.email === msg.from)?.username ||
                              msg.from}
                          </p>
                        )}
                        <p className="break-words">{msg.content}</p>
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <span className="text-xs opacity-70">
                            {formatTime(msg.createdAt || msg.timestamp)}
                          </span>
                          {isOwn && <MessageStatus status={msg.status} isGroup={activeChat.type === 'group'} />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicators */}
              {Array.from(currentTypingUsers).map(typingUser => (
                <div key={typingUser} className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <p className="text-sm italic">
                        {users.find(u => u.email === typingUser)?.name ||
                          users.find(u => u.email === typingUser)?.username ||
                          typingUser} is typing...
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  onFocus={() => handleTyping(true)}
                  onBlur={() => handleTyping(false)}
                  onInput={() => handleTyping(true)}
                  placeholder={isConnected ? "Type a message..." : "Connecting..."}
                  disabled={!isConnected}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim() || !isConnected}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              {!isConnected && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-2">Connection lost. Trying to reconnect...</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center mx-auto"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Chats
                </button>
              )}
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-2">Welcome to Section Chat</h3>
              <p className="text-gray-500 dark:text-gray-500">Select a conversation to start messaging</p>
              {!isConnected && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2">Offline - Check your connection</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Group Modal */}
      {showGroupModal && <GroupModal />}
    </div>
  );
};

export default ChatApp;