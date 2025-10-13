import axios from 'axios'
import { API_MODE, API_BASE } from './config'

const api = axios.create({ baseURL: API_BASE })

// PRODUCTS
export const fetchProducts = async ({ page = 1, limit = 10, q = '' } = {}) => {
  if (API_MODE === 'dummy') {
    const skip = (page - 1) * limit
    const url = q
      ? `/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
      : `/products?limit=${limit}&skip=${skip}`
    const { data } = await api.get(url) // { products, total }
    return { items: data.products, total: data.total, page, limit }
  } else {
    const { data } = await api.get('/products', { params: { page, limit, q } })
    return { items: data.products, total: data.total, page: data.page, limit: data.limit }
  }
}

export const fetchProduct = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}

export const createProduct = async (payload) => {
  if (API_MODE === 'dummy') {
    const { data } = await api.post('/products/add', payload)
    return data
  } else {
    const { data } = await api.post('/products', payload)
    return data
  }
}

export const updateProduct = async ({ id, payload }) => {
  const { data } = await api.put(`/products/${id}`, payload)
  return data
}

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`)
  return data
}

// ORDERS
export const fetchOrders = async ({ page = 1, limit = 10 } = {}) => {
  if (API_MODE === 'dummy') {
    const skip = (page - 1) * limit
    const { data } = await api.get(`/carts?limit=${limit}&skip=${skip}`) // { carts, total }
    return { items: data.carts, total: data.total, page, limit }
  } else {
    const { data } = await api.get('/orders', { params: { page, limit } })
    return { items: data.orders, total: data.total, page: data.page, limit: data.limit }
  }
}

// Analytics (monthly revenue)
export const fetchRevenueMonthly = async () => {
  if (API_MODE === 'node') {
    const { data } = await api.get('/analytics/revenue-monthly') // { monthly: number[12] }
    return data
  } else {
    // Fallback for dummyjson: fake monthly assignment using order IDs
    const { items } = await fetchOrders({ page: 1, limit: 100 })
    const monthly = Array(12).fill(0)
    items.forEach((c) => {
      const month = (c.id - 1) % 12
      monthly[month] += c.discountedTotal ?? c.total ?? 0
    })
    return { monthly }
  }
}