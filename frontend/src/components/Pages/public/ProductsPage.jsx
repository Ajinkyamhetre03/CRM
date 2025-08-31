import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, Grid3X3, List, SlidersHorizontal, Search, ChevronDown, ChevronLeft,
  ChevronRight, Star, StarHalf, Cpu, Layers, Battery, Wifi, Bluetooth,
  Usb, Gauge, Box, ShoppingCart, Heart, Check, X, RefreshCcw, Menu,
  TrendingUp, Award, Zap, Shield, Package, Truck, CreditCard, ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';

// --------------------------- Mock Data ---------------------------
const ALL_PRODUCTS = [
  {
    id: 'p-raspberry-pi-4-4gb',
    name: 'Raspberry Pi 4 Model B (4GB RAM)',
    brand: 'Raspberry Pi',
    category: 'Single Board Computers',
    price: 6999,
    mrp: 7999,
    rating: 4.8,
    reviews: 312,
    stock: 14,
    features: ['WiFi', 'Bluetooth', '4K HDMI', 'USB 3.0', 'Quad-core'],
    image: 'https://www.raspberrypi.org/app/uploads/2019/09/TOPDOWN-1.jpg',
    tags: ['bestseller', 'offer'],
    description: 'Complete development platform with powerful ARM Cortex-A72 processor'
  },
  {
    id: 'p-raspberry-pi-5-8gb',
    name: 'Raspberry Pi 5 (8GB RAM)',
    brand: 'Raspberry Pi',
    category: 'Single Board Computers',
    price: 10999,
    mrp: 12499,
    rating: 4.9,
    reviews: 152,
    stock: 8,
    features: ['WiFi', 'Bluetooth', 'PCIe', '4K HDMI', 'USB 3.0'],
    image: 'https://images.thingbits.net/eyJidWNrZXQiOiJ0aGluZ2JpdHMtbmV0Iiwia2V5Ijoiem5wNmNrcXA0ZDZ0cGZjdHduN3g5M2M1enFweiIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTMwMCwiaGVpZ2h0Ijo5NzUsImZpdCI6ImNvdmVyIn19fQ==',
    tags: ['new'],
    description: 'Latest generation with enhanced performance and PCIe connectivity'
  },
  {
    id: 'p-jetson-nano',
    name: 'NVIDIA Jetson Nano Developer Kit',
    brand: 'NVIDIA',
    category: 'AI Edge',
    price: 15999,
    mrp: 17999,
    rating: 4.7,
    reviews: 84,
    stock: 5,
    features: ['GPU', 'AI', '4GB RAM', 'CSI Camera'],
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    tags: ['pro'],
    description: 'AI development platform with 128-core NVIDIA Maxwell GPU'
  },
  {
    id: 'p-arduino-uno',
    name: 'Arduino Uno R3 (Original)',
    brand: 'Arduino',
    category: 'Microcontrollers',
    price: 1799,
    mrp: 1999,
    rating: 4.6,
    reviews: 540,
    stock: 40,
    features: ['USB', 'ATmega328P', '5V'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcWVNVmK2GVLq2-ifQ1FDoN3j_4csGnBV9uw&s',
    tags: ['bestseller'],
    description: 'The classic microcontroller board perfect for beginners and pros'
  },
  {
    id: 'p-esp32-wroom',
    name: 'ESP32 Dev Kit (WiFi+BLE)',
    brand: 'Espressif',
    category: 'Microcontrollers',
    price: 599,
    mrp: 799,
    rating: 4.7,
    reviews: 410,
    stock: 65,
    features: ['WiFi', 'Bluetooth', 'Dual-core', 'IoT'],
    image: 'https://img.thingsboard.io/devices-library/upesy-esp32-low-power-dev-kit.jpg',
    tags: ['value'],
    description: 'Powerful IoT development board with integrated WiFi and Bluetooth'
  },
  {
    id: 'p-dht22',
    name: 'DHT22 Temperature & Humidity Sensor',
    brand: 'Generic',
    category: 'Sensors',
    price: 299,
    mrp: 399,
    rating: 4.3,
    reviews: 220,
    stock: 100,
    features: ['Temperature', 'Humidity', 'Digital'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAFgEAaRMTwhBz0mMhf6pq2LFOm_85NWNIpA&s',
    tags: ['popular'],
    description: 'High-precision digital temperature and humidity sensor'
  },
  {
    id: 'p-mpu6050',
    name: 'MPU6050 Gyro + Accelerometer Module',
    brand: 'InvenSense',
    category: 'Sensors',
    price: 199,
    mrp: 299,
    rating: 4.5,
    reviews: 180,
    stock: 120,
    features: ['Gyro', 'Accelerometer', 'I2C'],
    image: 'https://shillehtek.com/cdn/shop/files/3.remini-enhanced.jpg?v=1697846994&width=1946',
    tags: ['value'],
    description: '6-axis motion tracking sensor with built-in temperature sensor'
  },
  {
    id: 'p-nrf24l01',
    name: 'NRF24L01+ 2.4GHz Wireless Module',
    brand: 'Nordic',
    category: 'Connectivity',
    price: 149,
    mrp: 249,
    rating: 4.2,
    reviews: 134,
    stock: 80,
    features: ['2.4GHz', 'SPI', 'Wireless'],
    image: 'https://images.unsplash.com/photo-1581089781785-603411fa81e5?auto=format&fit=crop&w=600&q=80',
    tags: [],
    description: 'Low-power wireless transceiver for IoT applications'
  },
  {
    id: 'p-sim800l',
    name: 'SIM800L GSM Module',
    brand: 'SIMCom',
    category: 'Connectivity',
    price: 549,
    mrp: 699,
    rating: 4.1,
    reviews: 96,
    stock: 55,
    features: ['GSM', 'GPRS', 'UART'],
    image: 'https://quartzcomponents.com/cdn/shop/products/SIM800LGPRSGSMModule-Quad-Band_1200x1200.jpg?v=1630414008',
    tags: [],
    description: 'Compact GSM/GPRS module for cellular connectivity'
  },
  {
    id: 'p-5v-3a-psu',
    name: '5V 3A Power Supply (USB-C)',
    brand: 'Generic',
    category: 'Power',
    price: 499,
    mrp: 599,
    rating: 4.4,
    reviews: 140,
    stock: 75,
    features: ['USB-C', '5V', '3A'],
    image: 'https://m.media-amazon.com/images/I/61jFU2FdcoL.jpg',
    tags: ['recommended'],
    description: 'High-quality switching power supply with USB-C connector'
  },
  {
    id: 'p-soldering-kit',
    name: 'Basic Soldering Kit (25W Iron + Stand)',
    brand: 'Soldron',
    category: 'Tools',
    price: 799,
    mrp: 999,
    rating: 4.3,
    reviews: 60,
    stock: 30,
    features: ['25W', 'Starter Kit'],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80',
    tags: [],
    description: 'Complete soldering kit perfect for electronics projects'
  }
];

const ALL_CATEGORIES = ['Single Board Computers', 'Microcontrollers', 'Sensors', 'Connectivity', 'Power', 'Tools'];
const ALL_BRANDS = ['Raspberry Pi', 'Arduino', 'Espressif', 'NVIDIA', 'Nordic', 'SIMCom', 'Generic', 'Soldron', 'InvenSense'];
const ALL_FEATURES = ['WiFi', 'Bluetooth', 'USB', 'USB 3.0', '4K HDMI', 'GPU', 'AI', 'UART', 'SPI', 'I2C', 'Dual-core', 'Quad-core', 'PCIe'];

// Helpers
const formatCurrency = (amount) => amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const RatingStars = ({ rating, size = 'sm' }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <div className="flex items-center">
      {[...Array(full)].map((_, i) => <Star key={`f-${i}`} className={`${sizeClass} text-amber-400 fill-amber-400`} />)}
      {half && <StarHalf className={`${sizeClass} text-amber-400 fill-amber-400`} />}
      {[...Array(5 - full - (half ? 1 : 0))].map((_, i) => <Star key={`e-${i}`} className={`${sizeClass} text-gray-300`} />)}
    </div>
  );
};

const CheckboxList = ({ title, options, selected, onToggle, limit = 999 }) => (
  <div className="border-b border-gray-100 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
    <h4 className="font-semibold mb-4 text-gray-900">{title}</h4>
    <div className="max-h-48 overflow-auto space-y-3 pr-2">
      {options.slice(0, limit).map(opt => {
        const checked = selected.includes(opt);
        return (
          <label key={opt} className="flex items-center cursor-pointer group">
            <div className="relative">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                checked={checked} 
                onChange={() => onToggle(opt)} 
              />
              {checked && <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5 pointer-events-none" />}
            </div>
            <span className={`ml-3 text-sm transition-colors ${checked ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  </div>
);

const ProductCard = ({ product, compact, onAddToCart, inWishlist, onToggleWishlist }) => {
  const discount = Math.max(0, Math.round(((product.mrp - product.price) / product.mrp) * 100));
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      layout 
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${compact ? "flex" : ""} group`}
    >
      <div className={`${compact ? "w-36 h-36 flex-shrink-0" : "h-48"} relative overflow-hidden bg-gray-50`}>
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy" 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discount}% OFF
            </div>
          )}
          {product.tags?.includes('new') && (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </div>
          )}
          {product.tags?.includes('bestseller') && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Award className="w-3 h-3" /> BEST
            </div>
          )}
          {product.tags?.includes('pro') && (
            <div className="bg-gradient-to-r from-purple-500 to-violet-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              PRO
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md"
        >
          <Heart className={`w-4 h-4 transition-colors ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`} />
        </button>

        {/* Stock Indicator */}
        {product.stock < 10 && (
          <div className="absolute bottom-2 left-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
            Only {product.stock} left
          </div>
        )}
      </div>

      <div className={`p-5 ${compact ? "flex-grow" : ""}`}>
        {/* Brand */}
        <div className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">
          {product.brand}
        </div>
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
        
        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <RatingStars rating={product.rating} />
          <span className="text-sm font-medium text-gray-900">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
        </div>
        
        {/* Price */}
        <div className="flex items-end gap-2 mb-3">
          <div className="font-bold text-xl text-gray-900">{formatCurrency(product.price)}</div>
          {product.mrp > product.price && (
            <div className="line-through text-gray-400 text-sm">{formatCurrency(product.mrp)}</div>
          )}
        </div>
        
        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.features.slice(0, 3).map(f => (
            <span key={f} className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1 font-medium">
              {f}
            </span>
          ))}
          {product.features.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{product.features.length - 3} more
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => onAddToCart(product)}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-center py-4 border-b border-gray-100 last:border-b-0"
  >
    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
    <div className="ml-3 flex-grow min-w-0">
      <h4 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight">{item.name}</h4>
      <div className="text-sm text-gray-600 mt-1">{formatCurrency(item.price)} each</div>
    </div>
    <div className="flex flex-col items-end gap-2 ml-3">
      <div className="flex items-center gap-1">
        <button 
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} 
          disabled={item.quantity <= 1} 
          className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <button 
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} 
          disabled={item.quantity >= item.stock} 
          className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
      <div className="text-sm font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</div>
      <button 
        onClick={() => onRemove(item.id)} 
        className="text-red-500 hover:text-red-700 transition-colors" 
        title="Remove"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

const SkeletonCard = ({ compact }) => (
  <div className={`bg-white rounded-xl border animate-pulse ${compact ? "flex" : ""}`}>
    <div className={`${compact ? "w-36 h-36 flex-shrink-0" : "h-48"} bg-gray-200 rounded-t-xl ${compact ? 'rounded-l-xl rounded-t-none' : ''}`}></div>
    <div className="p-5 flex-grow">
      <div className="h-3 bg-gray-200 rounded mb-2 w-16"></div>
      <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded mb-3 w-24"></div>
      <div className="flex gap-1 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-12"></div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-14"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [viewCompact, setViewCompact] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 20000]);

  // Cart state
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Filtering & Sorting logic
  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s)
      );
    }
    if (selectedCategories.length) list = list.filter(p => selectedCategories.includes(p.category));
    if (selectedBrands.length) list = list.filter(p => selectedBrands.includes(p.brand));
    if (selectedFeatures.length) list = list.filter(p => selectedFeatures.every(f => p.features.includes(f)));
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => (b.tags?.includes("new") ? 1 : 0) - (a.tags?.includes("new") ? 1 : 0));
        break;
      default:
        list.sort((a, b) => b.reviews * b.rating - a.reviews * a.rating);
        break;
    }
    return list;
  }, [search, selectedCategories, selectedBrands, selectedFeatures, priceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(startIdx, startIdx + perPage);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategories, selectedBrands, selectedFeatures, priceRange, perPage]);

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedFeatures([]);
    setPriceRange([0, 20000]);
    setSearch("");
    setSortBy("popularity");
  };

  // Cart functions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
         // toast.success(`${product.name} quantity increased in cart!`);
          toast.success(`Added to cart!`);
          return prev.map(i => i.id === product.id ? {...i, quantity: i.quantity + 1} : i);
        } else {
          toast.error("Max stock reached for this product");
          return prev;
        }
      }
      toast.success(`${product.name} added to cart!`);
      return [...prev, {...product, quantity: 1}];
    });
    setShowCart(true);
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart(prev => 
      prev.map(i => i.id === productId ? {...i, quantity: Math.min(quantity, i.stock)} : i)
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.id !== productId));
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const cartTotal = useMemo(() =>
    cart.reduce((sum, item) => sum + item.quantity * item.price, 0)
  , [cart]);

  const cartCount = useMemo(() =>
    cart.reduce((sum, item) => sum + item.quantity, 0)
  , [cart]);

  const handlePlaceOrder = () => {
    if (!cart.length) {
      alert("Cart is empty!");
      return;
    }
    alert(`Order placed successfully! Total: ${formatCurrency(cartTotal)}`);
    setCart([]);
    setShowCart(false);
  };

  const toggleItem = (list, setList, value) =>
    setList(current => current.includes(value) ? current.filter(v => v !== value) : [...current, value]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
                  <button 
                    onClick={resetFilters} 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors" 
                    title="Reset filters"
                  >
                    <RefreshCcw className="w-4 h-4"/> 
                    Reset
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <CheckboxList 
                  title="Categories" 
                  options={ALL_CATEGORIES} 
                  selected={selectedCategories} 
                  onToggle={v => toggleItem(selectedCategories, setSelectedCategories, v)} 
                />
                <CheckboxList 
                  title="Brands" 
                  options={ALL_BRANDS} 
                  selected={selectedBrands} 
                  onToggle={v => toggleItem(selectedBrands, setSelectedBrands, v)} 
                />
                <CheckboxList 
                  title="Features" 
                  options={ALL_FEATURES} 
                  selected={selectedFeatures} 
                  onToggle={v => toggleItem(selectedFeatures, setSelectedFeatures, v)} 
                />
               
                <div className="border-b border-gray-100 pb-6">
                  <h4 className="font-semibold mb-4 text-gray-900">Price Range</h4>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      className="border border-gray-300 px-3 py-2 w-24 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      value={priceRange[0]} 
                      min={0} 
                      onChange={e => setPriceRange([+e.target.value || 0, priceRange[1]])}
                      placeholder="Min"
                    />
                    <span className="text-gray-400">to</span>
                    <input 
                      type="number" 
                      className="border border-gray-300 px-3 py-2 w-24 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      value={priceRange[1]} 
                      min={priceRange[0]} 
                      onChange={e => setPriceRange([priceRange[0], +e.target.value || priceRange[1]])}
                      placeholder="Max"
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  
                  <select 
                    className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                  
                  <select 
                    className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    value={perPage} 
                    onChange={e => setPerPage(+e.target.value)}
                  >
                    {[12, 24, 36, 48].map(n => <option key={n} value={n}>{n} per page</option>)}
                  </select>
                  
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    Showing {startIdx + 1}-{Math.min(startIdx + perPage, filtered.length)} of {filtered.length} products
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewCompact(false)} 
                    className={`p-2 rounded-lg border transition-colors ${!viewCompact ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-50"}`} 
                    title="Grid view"
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setViewCompact(true)} 
                    className={`p-2 rounded-lg border transition-colors ${viewCompact ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-50"}`} 
                    title="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${viewCompact}-${currentPage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`grid gap-6 ${viewCompact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}
              >
                {loading ? (
                  Array.from({ length: perPage }).map((_, idx) => (
                    <SkeletonCard key={idx} compact={viewCompact} />
                  ))
                ) : pageItems.length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                    <button 
                      onClick={resetFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  pageItems.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      compact={viewCompact} 
                      onAddToCart={addToCart}
                      inWishlist={wishlist.includes(product.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))
                )}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {!loading && pageItems.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                    title="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pNum = idx + 1;
                    const isActive = pNum === currentPage;
                    return (
                      <button 
                        key={pNum} 
                        onClick={() => setPage(pNum)} 
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? "bg-blue-600 text-white" 
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                    title="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <CheckboxList 
                  title="Categories" 
                  options={ALL_CATEGORIES} 
                  selected={selectedCategories} 
                  onToggle={v => toggleItem(selectedCategories, setSelectedCategories, v)} 
                />
                <CheckboxList 
                  title="Brands" 
                  options={ALL_BRANDS} 
                  selected={selectedBrands} 
                  onToggle={v => toggleItem(selectedBrands, setSelectedBrands, v)} 
                />
                <CheckboxList 
                  title="Features" 
                  options={ALL_FEATURES} 
                  selected={selectedFeatures} 
                  onToggle={v => toggleItem(selectedFeatures, setSelectedFeatures, v)} 
                />
                
                <div>
                  <h4 className="font-semibold mb-4">Price Range</h4>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      className="border border-gray-300 px-3 py-2 w-20 rounded-lg" 
                      value={priceRange[0]} 
                      min={0} 
                      onChange={e => setPriceRange([+e.target.value || 0, priceRange[1]])} 
                    />
                    <span>to</span>
                    <input 
                      type="number" 
                      className="border border-gray-300 px-3 py-2 w-20 rounded-lg" 
                      value={priceRange[1]} 
                      min={priceRange[0]} 
                      onChange={e => setPriceRange([priceRange[0], +e.target.value || priceRange[1]])} 
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={resetFilters} 
                    className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={() => setShowMobileFilters(false)} 
                    className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Cart Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-xl">Shopping Cart</h3>
                    <p className="text-blue-100 text-sm">{cartCount} items</p>
                  </div>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h4>
                    <p className="text-gray-500 mb-6">Add some products to get started</p>
                    <button 
                      onClick={() => setShowCart(false)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      Continue Shopping
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-6">
                    <AnimatePresence>
                      {cart.map(item => (
                        <CartItem 
                          key={item.id} 
                          item={item} 
                          onUpdateQuantity={updateCartQuantity} 
                          onRemove={removeFromCart} 
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">{formatCurrency(cartTotal)}</span>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setCart([])}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                      >
                        Clear Cart
                      </button>
                      <button 
                        onClick={handlePlaceOrder}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-sm hover:shadow-md"
                      >
                        Place Order
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-center">
                      Secure checkout with 256-bit SSL encryption
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};  
