import { useState, useEffect } from 'react'
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
  Plus,
  Edit,
  Trash2,
  X,
} from 'lucide-react'
import { useSupabaseAuth } from '@/providers/SupabaseAuthProvider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '@/services/products'
import { getAllOrders, updateOrderStatus } from '@/services/orders'
import { getTotalViews, getPageViewsStats, getViewsByPage, getViewsForPeriod, getOrdersForPeriod, getRevenueForPeriod } from '@/services/analytics'
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
export default function AdminDashboard() {
  const { user, isAdmin, signOut } = useSupabaseAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analytics' | 'messages'>('overview')
  const [dateRange, setDateRange] = useState('7d')
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, from: 'Ahmed Hassan', text: 'When will my order arrive?', time: '2026-05-22 14:30', reply: null },
    { id: 2, from: 'Sara Mohamed', text: 'Do you have this in XL?', time: '2026-05-22 12:15', reply: 'Yes, we have all sizes available!' },
    { id: 3, from: 'Omar Khalil', text: 'Can I customize my own design?', time: '2026-05-21 18:45', reply: null },
  ])

  const queryClient = useQueryClient()

  // Fetch real data from Supabase
  const { data: products, isLoading: productsLoading } = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
  const { data: orders, isLoading: ordersLoading } = useQuery({ queryKey: ['orders'], queryFn: getAllOrders })
  const { data: totalViews } = useQuery({ queryKey: ['analytics', 'totalViews'], queryFn: getTotalViews })
  const { data: viewsStats } = useQuery({ queryKey: ['analytics', 'stats', 7], queryFn: () => getPageViewsStats(7) })
  const { data: viewsByPage } = useQuery({ queryKey: ['analytics', 'viewsByPage'], queryFn: getViewsByPage })
  const { data: currentViews } = useQuery({ queryKey: ['analytics', 'views', 7], queryFn: () => getViewsForPeriod(7) })
  const { data: previousViews } = useQuery({ queryKey: ['analytics', 'views', 14], queryFn: () => getViewsForPeriod(14) })
  const { data: currentOrders } = useQuery({ queryKey: ['analytics', 'orders', 7], queryFn: () => getOrdersForPeriod(7) })
  const { data: previousOrders } = useQuery({ queryKey: ['analytics', 'orders', 14], queryFn: () => getOrdersForPeriod(14) })
  const { data: currentRevenue } = useQuery({ queryKey: ['analytics', 'revenue', 7], queryFn: () => getRevenueForPeriod(7) })
  const { data: previousRevenue } = useQuery({ queryKey: ['analytics', 'revenue', 14], queryFn: () => getRevenueForPeriod(14) })
  // Debug logging
  useEffect(() => {
    console.log('AdminDashboard - orders:', orders)
    console.log('AdminDashboard - ordersLoading:', ordersLoading)
  }, [orders, ordersLoading])
  
  // Product mutations
  const createProductMutation = useMutation({ mutationFn: createProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) })
  const updateProductMutation = useMutation({ mutationFn: ({ id, data }: { id: string, data: any }) => updateProduct(id, data), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) })
  const deleteProductMutation = useMutation({ mutationFn: deleteProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) })
  // Order mutation
  const updateOrderStatusMutation = useMutation({ mutationFn: ({ id, status }: { id: string, status: string }) => updateOrderStatus(id, status as any), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }) })

const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    await updateOrderStatusMutation.mutateAsync({ id: orderId, status: newStatus })
    toast.success('Order status updated!')
  } catch (error: any) {
    toast.error(error.message || 'Failed to update order status')
  }
}
  
  // Product form state
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    discount: 0,
    category: 'men' as 'men' | 'women' | 'unisex',
    type: 'tshirt' as 'tshirt' | 'hoodie',
    image: '',
    images: [] as string[],
    colors: ['#000000'],
    sizes: ['S', 'M', 'L'],
    stock: 100,
    isNew: false,
    isSpecial: false,
    designType: '',
  })

  // Calculate totals from real data
const totalRevenue = orders?.filter(o => o.status === 'delivered').reduce((acc, order) => acc + order.total, 0) || 0
  const totalOrders = orders?.length || 0
  const totalProducts = products?.length || 0

  // Calculate category distribution from products
  const categoryData = [
    { name: 'Men', value: products?.filter(p => p.category === 'men').length || 0 },
    { name: 'Women', value: products?.filter(p => p.category === 'women').length || 0 },
    { name: 'Unisex', value: products?.filter(p => p.category === 'unisex').length || 0 },
  ].filter(c => c.value > 0)

  // Calculate recent orders from real data
  const recentOrders = orders?.slice(0, 5).map(order => ({
    id: order.id.slice(0, 8).toUpperCase(),
    customer: order.address.split(' ').slice(-2).join(' ') || 'Unknown',
    total: order.total,
    status: order.status,
    date: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })) || []

  // Calculate top products from real data
  const topProducts = products?.map(product => ({
    name: product.name,
    views: Math.floor(Math.random() * 1000) + 100, // Placeholder until we track views
    sales: Math.floor(Math.random() * 50) + 10, // Placeholder until we track sales
    revenue: product.price * (Math.floor(Math.random() * 50) + 10)
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5) || []

  // Calculate sales data by day from orders
  const salesData = (() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map(day => {
      const dayOrders = orders?.filter(order => {
        const orderDay = new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'short' })
        return orderDay === day
      }) || []
      return {
        name: day,
        sales: dayOrders.reduce((acc, o) => acc + o.total, 0),
        orders: dayOrders.length
      }
    })
  })()

  // Calculate views data from real analytics
  const viewsData = viewsStats || []
  const actualTotalViews = totalViews || 0

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (!previous || previous === 0) return { value: '+0%', up: true }
    const change = ((current - previous) / previous) * 100
    const isUp = change >= 0
    return {
      value: `${isUp ? '+' : ''}${change.toFixed(1)}%`,
      up: isUp
    }
  }

  const viewsChange = calculateChange(currentViews || 0, previousViews || 0)
  const ordersChange = calculateChange(currentOrders || 0, previousOrders || 0)
  const revenueChange = calculateChange(currentRevenue || 0, previousRevenue || 0)

  const handleSendMessage = (msgId: number) => {
    if (!messageText.trim()) return
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, reply: messageText } : m))
    )
    setMessageText('')
    toast.success('Reply sent!')
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: '',
      description: '',
      price: 0,
      discount: 0,
      category: 'men',
      type: 'tshirt',
      image: '',
      images: [],
      colors: ['#000000'],
      sizes: ['S', 'M', 'L'],
      stock: 100,
      isNew: false,
      isSpecial: false,
      designType: '',
    })
    setShowProductModal(true)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      discount: product.discount || 0,
      category: product.category,
      type: product.type,
      image: product.image,
      images: product.images || [],
      colors: product.colors || ['#000000'],
      sizes: product.sizes || ['S', 'M', 'L'],
      stock: product.stock || 100,
      isNew: product.is_new || false,
      isSpecial: product.is_special || false,
      designType: product.design_type || '',
    })
    setShowProductModal(true)
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductMutation.mutateAsync(id)
        toast.success('Product deleted successfully')
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete product')
      }
    }
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({
          id: editingProduct.id,
          data: productForm,
        })
        toast.success('Product updated successfully')
      } else {
        await createProductMutation.mutateAsync(productForm)
        toast.success('Product created successfully')
      }
      setShowProductModal(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product')
    }
  }

  if (!user || !isAdmin) {
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
    <>
      {/* Product Modal - Rendered at top level */}
      {showProductModal && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 999999, 
            backgroundColor: 'rgba(0, 0, 0, 0.9)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div 
            style={{ 
              width: '100%', 
              maxWidth: '672px', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              backgroundColor: '#111827', 
              border: '2px solid #8B5CF6', 
              borderRadius: '16px', 
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowProductModal(false)}
                style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>Product Name *</label>
                  <input
                    required
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#1F2937', border: '1px solid #4B5563', color: 'white', outline: 'none' }}
                    placeholder="EVO Geometric Lines"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#1F2937', border: '1px solid #4B5563', color: 'white', outline: 'none', resize: 'none', minHeight: '72px' }}
                    placeholder="Product description..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>Price *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#1F2937', border: '1px solid #4B5563', color: 'white', outline: 'none' }}
                    placeholder="49.99"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>Discount (%)</label>
                  <input
                    type="number"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({ ...productForm, discount: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#1F2937', border: '1px solid #4B5563', color: 'white', outline: 'none' }}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>Category *</label>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#1F2937', border: '1px solid #4B5563', color: 'white', outline: 'none' }}
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>Type *</label>
                  <select
                    required
                    value={productForm.type}
                    onChange={(e) => setProductForm({ ...productForm, type: e.target.value as any })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#1F2937', border: '1px solid #4B5563', color: 'white', outline: 'none' }}
                  >
                    <option value="tshirt">T-Shirt</option>
                    <option value="hoodie">Hoodie</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>Main Image URL *</label>
                  <input
                    required
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#1F2937', border: '1px solid #4B5563', color: 'white', outline: 'none' }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>Additional Image URLs (optional)</label>
                  {productForm.images.map((img, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => {
                          const newImages = [...productForm.images]
                          newImages[idx] = e.target.value
                          setProductForm({ ...productForm, images: newImages })
                        }}
                        style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', backgroundColor: '#1F2937', border: '1px solid #4B5563', color: 'white', outline: 'none' }}
                        placeholder="https://example.com/image2.jpg"
                      />
                      {productForm.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = productForm.images.filter((_, i) => i !== idx)
                            setProductForm({ ...productForm, images: newImages })
                          }}
                          style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#EF4444', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, images: [...productForm.images, ''] })}
                    style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#6B46C1', border: 'none', color: 'white', cursor: 'pointer' }}
                  >
                    + Add Another Image
                  </button>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>Colors</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {productForm.colors.map((color, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...productForm.colors]
                            newColors[idx] = e.target.value
                            setProductForm({ ...productForm, colors: newColors })
                          }}
                          style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #4B5563', cursor: 'pointer' }}
                        />
                        {productForm.colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newColors = productForm.colors.filter((_, i) => i !== idx)
                              setProductForm({ ...productForm, colors: newColors })
                            }}
                            style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#EF4444', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, colors: [...productForm.colors, '#000000'] })}
                    style={{ marginTop: '8px', padding: '8px 16px', borderRadius: '8px', backgroundColor: '#6B46C1', border: 'none', color: 'white', cursor: 'pointer' }}
                  >
                    + Add Color
                  </button>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>Sizes</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#D1D5DB', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={productForm.sizes.includes(size)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProductForm({ ...productForm, sizes: [...productForm.sizes, size] })
                            } else {
                              setProductForm({ ...productForm, sizes: productForm.sizes.filter(s => s !== size) })
                            }
                          }}
                          style={{ width: '16px', height: '16px', borderRadius: '4px' }}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>Stock *</label>
                  <input
                    required
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#1F2937', border: '1px solid #4B5563', color: 'white', outline: 'none' }}
                    placeholder="100"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#D1D5DB', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productForm.isNew}
                      onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                      style={{ width: '16px', height: '16px', borderRadius: '4px' }}
                    />
                    New
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#D1D5DB', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productForm.isSpecial}
                      onChange={(e) => setProductForm({ ...productForm, isSpecial: e.target.checked })}
                      style={{ width: '16px', height: '16px', borderRadius: '4px' }}
                    />
                    Special
                  </label>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#D1D5DB', marginBottom: '8px' }}>Design Type</label>
                  <input
                    type="text"
                    value={productForm.designType}
                    onChange={(e) => setProductForm({ ...productForm, designType: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: '#1F2937', border: '1px solid #4B5563', color: 'white', outline: 'none' }}
                    placeholder="geometric, abstract, etc."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', backgroundColor: '#374151', border: '1px solid #4B5563', color: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', backgroundColor: '#8B5CF6', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
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
                    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, change: revenueChange.value, up: revenueChange.up },
                    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, change: ordersChange.value, up: ordersChange.up },
                    { label: 'Website Views', value: actualTotalViews.toLocaleString(), icon: Eye, change: viewsChange.value, up: viewsChange.up },
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
                    {ordersLoading ? (
                      <p className="text-white/40 text-center py-4">Loading orders...</p>
                    ) : orders && orders.length > 0 ? (
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
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 font-medium">{order.id.slice(0, 8)}</td>
                              <td className="py-3 px-4">{order.address}</td>
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
                    ) : (
                      <p className="text-white/40 text-center py-4">No orders yet</p>
                    )}
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
                  <button
                    onClick={handleAddProduct}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#6B46C1] text-white hover:bg-[#6B46C1]/90 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                </div>

                <div className="overflow-x-auto">
                  {productsLoading ? (
                    <p className="text-white/40 text-center py-4">Loading products...</p>
                  ) : products && products.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 font-medium text-white/40">Product</th>
                          <th className="text-left py-3 px-4 font-medium text-white/40">Price</th>
                          <th className="text-left py-3 px-4 font-medium text-white/40">Stock</th>
                          <th className="text-left py-3 px-4 font-medium text-white/40">Category</th>
                          <th className="text-left py-3 px-4 font-medium text-white/40">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-white/40">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
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
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-white/40 text-center py-4">No products yet</p>
                  )}
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Pending', value: orders?.filter(o => o.status === 'pending').length || 0, color: '#FBBF24' },
                    { label: 'Processing', value: orders?.filter(o => o.status === 'processing').length || 0, color: '#6B46C1' },
                    { label: 'Shipped', value: orders?.filter(o => o.status === 'shipped').length || 0, color: '#3B82F6' },
                    { label: 'Delivered', value: orders?.filter(o => o.status === 'delivered').length || 0, color: '#10B981' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-sm text-white/40">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  {ordersLoading ? (
                    <p className="text-white/40 text-center py-4">Loading orders...</p>
                  ) : orders && orders.length > 0 ? (
                    <table className="w-full text-sm">
  <thead>
    <tr className="border-b border-white/10">
      <th className="text-left py-3 px-4 font-medium text-white/40">Order ID</th>
      <th className="text-left py-3 px-4 font-medium text-white/40">Customer</th>
      <th className="text-left py-3 px-4 font-medium text-white/40">Total</th>
      <th className="text-left py-3 px-4 font-medium text-white/40">Payment</th>
      <th className="text-left py-3 px-4 font-medium text-white/40">Status</th>
      <th className="text-left py-3 px-4 font-medium text-white/40">Date</th>
      <th className="text-left py-3 px-4 font-medium text-white/40">Receipt</th>
      <th className="text-left py-3 px-4 font-medium text-white/40">Change Status</th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order) => (
      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
        <td className="py-3 px-4 font-medium">{order.id.slice(0, 8)}</td>
        <td className="py-3 px-4">{order.address}</td>
        <td className="py-3 px-4 font-bold">${order.total.toFixed(2)}</td>
        <td className="py-3 px-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            order.payment_method === 'cod' ? 'bg-[#FBBF24]/10 text-[#FBBF24]' :
            order.payment_method === 'instapay' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
            'bg-[#EF4444]/10 text-[#EF4444]'
          }`}>
            {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method === 'instapay' ? 'Instapay' : 'Vodafone Cash'}
          </span>
        </td>
        <td className="py-3 px-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            order.status === 'delivered' ? 'bg-green-400/10 text-green-400' :
            order.status === 'shipped' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
            order.status === 'processing' ? 'bg-[#FBBF24]/10 text-[#FBBF24]' :
            order.status === 'cancelled' ? 'bg-red-400/10 text-red-400' :
            'bg-[#6B46C1]/10 text-[#6B46C1]'
          }`}>
            {order.status}
          </span>
        </td>
        <td className="py-3 px-4 text-white/40">{new Date(order.created_at).toLocaleDateString()}</td>
        <td className="py-3 px-4">
          {order.receipt_image ? (
            <button
              onClick={() => {
                const img = new Image()
                img.src = order.receipt_image
                const w = window.open('')
                if (w) {
                  w.document.write(img.outerHTML)
                  w.document.title = `Receipt - ${order.id.slice(0, 8)}`
                }
              }}
              className="text-[#6B46C1] hover:text-[#3B82F6] text-xs font-bold underline"
            >
              View Receipt
            </button>
          ) : (
            <span className="text-white/20 text-xs">No receipt</span>
          )}
        </td>
        <td className="py-3 px-4">
          <select
            value={order.status}
            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#6B46C1] cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </td>
      </tr>
    ))}
  </tbody>
</table>
                  ) : (
                    <p className="text-white/40 text-center py-4">No orders yet</p>
                  )}
                </div>
              </div>
            )}

            {/* Analytics */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Page Views by Page */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h3 className="font-bold mb-4">Page Views by Page</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 font-medium text-white/40">Page</th>
                          <th className="text-left py-3 px-4 font-medium text-white/40">Views</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewsByPage && viewsByPage.length > 0 ? (
                          viewsByPage.map((item, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 font-medium">{item.page}</td>
                              <td className="py-3 px-4 font-bold text-[#6B46C1]">{item.views.toLocaleString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} className="py-4 text-center text-white/40">No page views data yet</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Weekly Page Views */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h3 className="font-bold mb-4">Weekly Page Views</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="name" stroke="#555" fontSize={12} />
                      <YAxis stroke="#555" fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #222', borderRadius: '12px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#6B46C1" fill="#6B46C1" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
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
    </>
  )
}
