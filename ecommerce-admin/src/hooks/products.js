import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchProducts, fetchProduct, createProduct, updateProduct, deleteProduct
} from '../lib/api'

export const useProducts = (params) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    keepPreviousData: true,
  })

export const useProduct = (id) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  })

export const useCreateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useUpdateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['product', id] })
    },
  })
}

export const useDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
}