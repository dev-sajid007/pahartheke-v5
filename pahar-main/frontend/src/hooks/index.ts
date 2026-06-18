import { useState, useEffect } from 'react'
import { useAppDispatch } from './redux'
import { setLoading, setError } from '@/store/slices/uiSlice'

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoadingState] = useState(false)
  const [error, setErrorState] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  const execute = async () => {
    setLoadingState(true)
    setErrorState(null)
    dispatch(setLoading(true))

    try {
      const result = await asyncFunction()
      setData(result)
      dispatch(setError(null))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setErrorState(errorMessage)
      dispatch(setError(errorMessage))
    } finally {
      setLoadingState(false)
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate])

  return { data, loading, error, execute }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return [storedValue, setValue]
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}