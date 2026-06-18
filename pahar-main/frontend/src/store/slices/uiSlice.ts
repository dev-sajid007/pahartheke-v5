import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

interface UIState {
  notifications: Notification[]
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  loading: boolean
  error: string | null
  modal: {
    isOpen: boolean
    type?: string
    data?: any
  }
}

const initialState: UIState = {
  notifications: [],
  sidebarOpen: false,
  theme: 'light',
  loading: false,
  error: null,
  modal: {
    isOpen: false,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        duration: 5000,
        ...action.payload,
      }
      state.notifications.push(notification)
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    },

    clearNotifications: (state) => {
      state.notifications = []
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },

    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    openModal: (
      state,
      action: PayloadAction<{ type: string; data?: any }>
    ) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data,
      }
    },

    closeModal: (state) => {
      state.modal = {
        isOpen: false,
      }
    },
  },
})

export const {
  showNotification,
  removeNotification,
  clearNotifications,
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLoading,
  setError,
  openModal,
  closeModal,
} = uiSlice.actions

export default uiSlice.reducer