"use client"

import { useRef, useEffect } from "react"
import { Provider, useDispatch, useSelector } from "react-redux"
import { makeStore } from "@/lib/store"
import { hydrateCart } from "@/features/cart/cartSlice"

function CartPersistence({ children }) {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)

  useEffect(() => {
    const cartData = localStorage.getItem("cartItems")
    if (cartData) {
      dispatch(hydrateCart(JSON.parse(cartData)))
    }
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items))
  }, [items])

  return children
}

export default function StoreProvider({ children }) {
  const storeRef = useRef(null)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <CartPersistence>{children}</CartPersistence>
    </Provider>
  )
}