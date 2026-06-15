import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Package,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  BarChart3,
  Activity,
  Mail,
  Send,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { demoProducts } from '@/data/products'
import { toast } from 'sonner'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'

const COLORS = ['#6B46C1', '#3B82F6', '#FF2A2A', '#FBBF24', '#10B981']

// Demo analytics data
const salesData = [
  { name: 'Mon', sales: 4200, orders: 12 },
  { name: 'Tue', sales: 5800, orders: 18 },
  { name: 'Wed', sales: 3900, orders: 10 },
  { name: 'Thu', sales: 7200, orders: 22 },
  { name: 'Fri', sales: 9100, orders: 28 },
  { name: 'Sat', sales: 11500, orders: 35 },
  { name: 'Sun', sales: 8400, orders: 24 },
]

const viewsData = [
  { name: 'Mon', views: 320, productViews: 180 },
  { name: 'Tue', views: 450, productViews: 240 },
  { name: 'Wed', views: 380, productViews: 200 },
  { name: 'Thu', views: 520, productViews: 310 },
  { name: 'Fri', views: 680, productViews: 420 },
  { name: 'Sat', views: 890, productViews: 560 },
  { name: 'Sun', views: 720, productViews: 480 },
]

const categoryData = [
  { name: 'Men', value: 45 },
  { name: 'Women', value: 35 },
  { name: 'Unisex', value: 20 },
]

const topProducts = [
  { name: 'EVO Geometric Lines', views: 1240, sales: 89, revenue: 4449 },
  { name: 'EVO Cyberpunk Hoodie', views: 980, sales: 67, revenue: 6026 },
  { name: 'EVO Red Brush Stroke', views: 850, sales: 54, revenue: 2969 },
  { name: 'EVO Zen Wave Tee', views: 720, sales: 45, revenue: 2024 },
  { name: 'EVO Sacred Geometry', views: 650, sales: 38, revenue: 2279 },
]

const recentOrders = [
  { id: 'EVO-A1B2C3', customer: 'Ahmed Hassan', total: 89.99, status: 'delivered', date: '2026-05-22' },
  { id: 'EVO-D4E5F6', customer: 'Sara Mohamed', total: 144.97, status: 'shipped', date: '2026-05-21' },
  { id: 'EVO-G7H8I9', customer: 'Omar Khalil', total: 54.99, status: 'processing', date: '2026-05-21' },
  { id: 'EVO-J1K2L3', customer: 'Nour Ahmed', total: 199.98, status: 'pending', date: '2026-05-20' },
  { id: 'EVO-M4N5O6', customer: 'Youssef Ali', total: 79.99, status: 'delivered', date: '2026-05-19' },
]

export default function AdminDashboard() {
  const { isLoggedIn, isAdmin, setLoggedOut } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analytics' | 'messages'>('overview')
  const [dateRange, setDateRange] = useState('7d')
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, from: 'Ahmed Hassan', text: 'When will my order arrive?', time: '2026-05-22 14:30', reply: null },
    { id: 2, from: 'Sara Mohamed', text: 'Do you have this in XL?', time: '2026-05-22 12:15', reply: 'Yes, we have all sizes available!' },
    { id: 3, from: 'Omar Khalil', text: 'Can I customize my own design?', time: '2026-05-21 18:45', reply: null },
  ])

  // Calculate totals
  const totalRevenue = salesData.reduce((acc, d) => acc + d.sales, 0)
  const totalOrders = salesData.reduce((acc, d) => acc + d.orders, 0)
  const totalViews = viewsData.reduce((acc, d) => acc + d.views, 0)
  const totalProducts = demoProducts.length

  const handleSendMessage = (msgId: number) => {
    if (!messageText.trim()) return
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, reply: messageText } : m))
    )
    setMessageText('')
    toast.success('Reply sent!')
  }

  if (!isLoggedIn || !isAdmin) {
    return (
      <main className="min-h-screen bg-[#050505] pt-28 flex items-center justify-center">
        <div className="text-center">
          <LayoutDashboard className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-white/40 mb-6">Admin access required</p>
          <Link to="/" className="px-6 py-3 rounded-full bg-[#6B46C1] text-white font-medium hover:opacity-90 transition-all">
            Go Home
          </Link>
        </div>
      </main>
    )
  }

  const sidebarItems = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingBag },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'messages' as const, label: 'Messages', icon: Mail },
  ]

  return (
    <main className="min-h-screen bg-[#050505] pt-28 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-28 space-y-2">
              <div className="p-4 mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-[#6B46C1]" />
                  Admin Panel
                </h2>
              </div>
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === item.id
                      ? 'bg-[#6B46C1] text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { setLoggedOut(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-400 hover:bg-red-500/10 transition-all mt-8"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
              <div className="flex items-center gap-2">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 focus:outline-none"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
              </div>
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, change: '+12.5%', up: true },
                    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, change: '+8.2%', up: true },
                    { label: 'Website Views', value: totalViews.toLocaleString(), icon: Eye, change: '+24.1%', up: true },
                    { label: 'Products', value: totalProducts.toString(), icon: Package, change: '+0%', up: true },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <stat.icon className="w-5 h-5 text-[#6B46C1]" />
                        <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                          {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-white/40">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#6B46C1]" />
                      Sales Overview
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={salesData}>
                        <defs>
                          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6B46C1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6B46C1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="name" stroke="#555" fontSize={12} />
                        <YAxis stroke="#555" fontSize={12} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #222', borderRadius: '12px' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="sales" stroke="#6B46C1" fill="url(#salesGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#3B82F6]" />
                      Views & Engagement
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={viewsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="name" stroke="#555" fontSize={12} />
                        <YAxis stroke="#555" fontSize={12} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #222', borderRadius: '12px' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="views" stroke="#6B46C1" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="productViews" stroke="#3B82F6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Recent Orders</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-sm text-[#6B46C1] hover:text-[#3B82F6] transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 font-medium text-white/40">Order ID</th>
                          <th className="text-left py-3 px-4 font-medium text-white/40">Customer</th>
                          <th className="text-left py-3 px-4 font-medium text-white/40">Total</th>
                          <th className="text-left py-3 px-4 font-medium text-white/40">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 font-medium">{order.id}</td>
                            <td className="py-3 px-4">{order.customer}</td>
                            <td className="py-3 px-4 font-bold">${order.total.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                order.status === 'delivered' ? 'bg-green-400/10 text-green-400' :
                                order.status === 'shipped' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                                order.status === 'processing' ? 'bg-[#FBBF24]/10 text-[#FBBF24]' :
                                'bg-[#6B46C1]/10 text-[#6B46C1]'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#6B46C1]"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 font-medium text-white/40">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-white/40">Price</th>
                        <th className="text-left py-3 px-4 font-medium text-white/40">Stock</th>
                        <th className="text-left py-3 px-4 font-medium text-white/40">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-white/40">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoProducts.map((product) => (
                        <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-white/40">{product.type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold">${product.price.toFixed(2)}</span>
                            {product.discount > 0 && (
                              <span className="ml-2 text-xs text-[#FF2A2A]">-{product.discount}%</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`${product.stock < 20 ? 'text-[#FBBF24]' : 'text-white/60'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4 capitalize">{product.category}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.stock > 0 ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                            }`}>
                              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Pending', value: 12, color: '#FBBF24' },
                    { label: 'Processing', value: 8, color: '#6B46C1' },
                    { label: 'Shipped', value: 24, color: '#3B82F6' },
                    { label: 'Delivered', value: 156, color: '#10B981' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-sm text-white/40">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 font-medium text-white/40">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium text-white/40">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-white/40">Total</th>
                        <th className="text-left py-3 px-4 font-medium text-white/40">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-white/40">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-medium">{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4 font-bold">${order.total.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              order.status === 'delivered' ? 'bg-green-400/10 text-green-400' :
                              order.status === 'shipped' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                              order.status === 'processing' ? 'bg-[#FBBF24]/10 text-[#FBBF24]' :
                              'bg-[#6B46C1]/10 text-[#6B46C1]'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white/40">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Top Products Table */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h3 className="font-bold mb-4">Top Performing Products</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 font-medium text-white/40">Product</th>
                          <th className="text-left py-3 px-4 font-medium text-white/40">Views</th>
                          <th className="text-left py-3 px-4 font-medium text-white/40">Sales</th>
                          <th className="text-left py-3 px-4 font-medium text-white/40">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map((product, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 font-medium">{product.name}</td>
                            <td className="py-3 px-4">{product.views.toLocaleString()}</td>
                            <td className="py-3 px-4">{product.sales}</td>
                            <td className="py-3 px-4 font-bold text-[#6B46C1]">${product.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h3 className="font-bold mb-4">Sales by Category</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #222', borderRadius: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-6 mt-4">
                      {categoryData.map((cat, i) => (
                        <div key={cat.name} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          <span className="text-sm text-white/60">{cat.name} ({cat.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h3 className="font-bold mb-4">Weekly Sales</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="name" stroke="#555" fontSize={12} />
                        <YAxis stroke="#555" fontSize={12} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #222', borderRadius: '12px' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="sales" fill="#6B46C1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B46C1] to-[#3B82F6] flex items-center justify-center text-sm font-bold shrink-0">
                          {msg.from.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-bold">{msg.from}</p>
                            <p className="text-xs text-white/40">{msg.time}</p>
                          </div>
                          <p className="text-white/60 mb-4">{msg.text}</p>

                          {msg.reply ? (
                            <div className="p-4 rounded-xl bg-[#6B46C1]/10 border border-[#6B46C1]/20">
                              <p className="text-xs text-[#6B46C1] font-medium mb-1">Your Reply</p>
                              <p className="text-sm">{msg.reply}</p>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Type your reply..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#6B46C1] text-sm"
                              />
                              <button
                                onClick={() => handleSendMessage(msg.id)}
                                className="px-4 py-2.5 rounded-xl bg-[#6B46C1] text-white hover:opacity-90 transition-all"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
