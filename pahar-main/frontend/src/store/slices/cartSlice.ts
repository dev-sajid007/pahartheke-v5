import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem, Cart } from '@/types'

interface CartState extends Cart {
  isOpen: boolean
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  isOpen: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      )

      if (existingItem) {
        existingItem.quantity += action.payload.quantity
        existingItem.total = existingItem.quantity * existingItem.price
      } else {
        state.items.push(action.payload)
      }

      // Recalculate totals
      state.subtotal = state.items.reduce((sum, item) => sum + item.total, 0)
      state.total = state.subtotal - state.discount + state.tax + state.shipping
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload)
      
      // Recalculate totals
      state.subtotal = state.items.reduce((sum, item) => sum + item.total, 0)
      state.total = state.subtotal - state.discount + state.tax + state.shipping
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.productId === action.payload.productId
      )

      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
        item.total = item.quantity * item.price
        
        // Recalculate totals
        state.subtotal = state.items.reduce((sum, item) => sum + item.total, 0)
        state.total = state.subtotal - state.discount + state.tax + state.shipping
      }
    },

    clearCart: (state) => {
      state.items = []
      state.subtotal = 0
      state.discount = 0
      state.tax = 0
      state.shipping = 0
      state.total = 0
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },

    applyDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload
      state.total = state.subtotal - state.discount + state.tax + state.shipping
    },

    setShipping: (state, action: PayloadAction<number>) => {
      state.shipping = action.payload
      state.total = state.subtotal - state.discount + state.tax + state.shipping
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  applyDiscount,
  setShipping,
} = cartSlice.actions

export default cartSlice.reducer