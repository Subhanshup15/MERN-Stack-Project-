export const API_MODE = import.meta.env.VITE_API_MODE || 'dummy' // 'dummy' | 'node'
export const API_BASE =
  API_MODE === 'node'
    ? (import.meta.env.VITE_API_BASE || 'http://localhost:4000')
    : 'https://dummyjson.com'