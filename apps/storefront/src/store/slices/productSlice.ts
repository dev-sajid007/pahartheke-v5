import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product, Category, PaginatedResponse, PaginationParams } from '@/types'

interface ProductState {
  products: Product[]
  categories: Category[]
  featured: Product[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  filters: {
    category?: string
    priceRange: [number, number]
    search: string
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
}

const initialState: ProductState = {
  products: [],
  categories: [],
  featured: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  filters: {
    priceRange: [0, 100000],
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    setProducts: (state, action: PayloadAction<PaginatedResponse<Product>>) => {
      state.products = action.payload.data
      state.pagination = {
        page: action.payload.pagination.page,
        limit: action.payload.pagination.limit,
        total: action.payload.pagination.total,
        pages: action.payload.pagination.pages,
      }
    },

    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload
    },

    setFeatured: (state, action: PayloadAction<Product[]>) => {
      state.featured = action.payload
    },

    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload)
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      )
      if (index !== -1) {
        state.products[index] = action.payload
      }
    },

    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      )
    },

    setFilters: (state, action: PayloadAction<Partial<ProductState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    resetFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const {
  setLoading,
  setError,
  setProducts,
  setCategories,
  setFeatured,
  addProduct,
  updateProduct,
  deleteProduct,
  setFilters,
  resetFilters,
} = productSlice.actions

export default productSlice.reducer