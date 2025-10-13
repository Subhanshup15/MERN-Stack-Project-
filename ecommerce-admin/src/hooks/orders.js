import { useQuery } from '@tanstack/react-query'
import { fetchOrders, fetchRevenueMonthly } from '../lib/api'

export const useOrders = (params) =>
  useQuery({
    queryKey: ['orders', params],
    queryFn: () => fetchOrders(params),
    keepPreviousData: true,
  })

export const useRevenueMonthly = () =>
  useQuery({
    queryKey: ['analytics', 'revenue-monthly'],
    queryFn: fetchRevenueMonthly,
  })