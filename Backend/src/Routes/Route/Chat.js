// routes/manager/task.js
import express from "express";
import { auth } from '../../middleware/auth.js'
import { checkRoleAndDepartment } from '../../middleware/roleCheck.js'
import User from "../../Models/User.js";
import Message from "../../Models/Message.js"
import Group from "../../Models/Group.js"


const router = express.Router();

// Auth checker
router.use(auth);
router.use(
  checkRoleAndDepartment(
    ["ceo", "superadmin", "admin", "manager", "employee", "intern"],  
    ['hr', 'iot', 'software', 'financial', 'business'] 
  )
);


// Get all users (except current user)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ email: { $ne: req.user.email } })
      .select(' email profileImage isOnline lastSeen isTabVisible username')
      .sort({ name: 1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user's groups
router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.email })
      .sort({ updatedAt: -1 });
    res.json(groups);
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Create group
router.post('/groups', async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name || !members || members.length === 0) {
      return res.status(400).json({ error: 'Group name and members are required' });
    }

    // Add creator to members if not already included
    const allMembers = [...new Set([req.user.email, ...members])];

    const group = new Group({
      name,
      description: description || '',
      members: allMembers,
      admin: req.user.email
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Get messages for direct chat
router.get('/messages/direct/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const messages = await Message.find({
      type: 'direct',
      $or: [
        { from: req.user.email, to: userEmail },
        { from: userEmail, to: req.user.email }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get direct messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get messages for group chat
router.get('/messages/group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Verify user is member of group
    const group = await Group.findById(groupId);
    if (!group || !group.members.includes(req.user.email)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await Message.find({
      type: 'group',
      to: groupId
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get group messages error:', error);
    res.status(500).json({ error: 'Failed to fetch group messages' });
  }
});

// Mark messages as read
router.post('/messages/read', async (req, res) => {
  try {
    const { chatId, type } = req.body;

    if (type === 'direct') {
      await Message.updateMany(
        {
          from: chatId,
          to: req.user.email,
          type: 'direct',
          status: { $in: ['sent', 'delivered'] }
        },
        { status: 'read' }
      );
    } else if (type === 'group') {
      await Message.updateMany(
        {
          to: chatId,
          type: 'group',
          from: { $ne: req.user.email }
        },
        {
          $addToSet: {
            readBy: {
              user: req.user.email,
              readAt: new Date()
            }
          }
        }
      );
    }

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

export default router;