import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  isOpen: false,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      )

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        })
      }
      state.isOpen = true
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },

    increaseQty: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) item.quantity += 1
    },

    decreaseQty: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload)
      if (item && item.quantity > 1) item.quantity -= 1
    },

    clearCart: (state) => {
      state.items = []
      state.isOpen = false
    },

    hydrateCart: (state, action) => {
      state.items = action.payload || []
    },

    setCartOpen: (state, action) => {
      state.isOpen = action.payload
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  hydrateCart,
  setCartOpen,
  toggleCart,
} = cartSlice.actions

export default cartSlice.reducer