export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  stock: number
  category: Category
  images: string[]
  tags: string[]
  featured: boolean
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children?: Category[]
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: Address
  role: 'customer' | 'admin' | 'manager'
  avatar?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Address {
  id?: string
  street: string
  city: string
  state?: string
  zipCode: string
  country: string
  isDefault?: boolean
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  user: User
  items: OrderItem[]
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  shippingAddress: Address
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  total: number
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded'

export type PaymentMethod = 
  | 'cash' 
  | 'bkash' 
  | 'nagad' 
  | 'card' 
  | 'bank_transfer'

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded'

export interface CartItem {
  productId: string
  product: Product
  quantity: number
  price: number
  total: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}