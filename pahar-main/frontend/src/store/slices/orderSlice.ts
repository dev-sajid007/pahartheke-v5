import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Order, PaginatedResponse } from '@/types'

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    setOrders: (state, action: PayloadAction<PaginatedResponse<Order>>) => {
      state.orders = action.payload.data
      state.pagination = {
        page: action.payload.pagination.page,
        limit: action.payload.pagination.limit,
        total: action.payload.pagination.total,
        pages: action.payload.pagination.pages,
      }
    },

    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload)
      state.currentOrder = action.payload
    },

    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: string }>
    ) => {
      const order = state.orders.find(
        (order) => order.id === action.payload.orderId
      )
      if (order) {
        order.status = action.payload.status as any
      }

      if (state.currentOrder?.id === action.payload.orderId) {
        state.currentOrder.status = action.payload.status as any
      }
    },

    clearOrderState: (state) => {
      state.currentOrder = null
      state.error = null
    },
  },
})

export const {
  setLoading,
  setError,
  setOrders,
  addOrder,
  setCurrentOrder,
  updateOrderStatus,
  clearOrderState,
} = orderSlice.actions

export default orderSlice.reducer