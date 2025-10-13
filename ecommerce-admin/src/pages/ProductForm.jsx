import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useProduct, useCreateProduct, useUpdateProduct } from '../hooks/products'

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be >= 0'),
  stock: z.coerce.number().min(0, 'Stock must be >= 0'),
  category: z.string().min(2, 'Category is required'),
})

export default function ProductForm({ mode }) {
  const { id } = useParams()
  const nav = useNavigate()

  const { data: product, isLoading } = useProduct(id)
  const create = useCreateProduct()
  const update = useUpdateProduct()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title:'', description:'', price:0, stock:0, category:'' }
  })

  useEffect(() => {
    if (mode === 'edit' && product) {
      reset({
        title: product.title ?? '',
        description: product.description ?? '',
        price: product.price ?? 0,
        stock: product.stock ?? 0,
        category: product.category ?? '',
      })
    }
  }, [mode, product, reset])

  const onSubmit = async (values) => {
    try {
      if (mode === 'create') await create.mutateAsync(values)
      else await update.mutateAsync({ id, payload: values })
      nav('/products')
    } catch (e) {
      console.error(e)
      alert('Failed to save product')
    }
  }

  if (mode === 'edit' && isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-4">{mode === 'create' ? 'Add Product' : 'Edit Product'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white border rounded p-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input {...register('title')} className="w-full border rounded px-3 py-2" />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea {...register('description')} className="w-full border rounded px-3 py-2" rows="3" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Price</label>
            <input type="number" step="0.01" {...register('price')} className="w-full border rounded px-3 py-2" />
            {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <input type="number" {...register('stock')} className="w-full border rounded px-3 py-2" />
            {errors.stock && <p className="text-sm text-red-600">{errors.stock.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Category</label>
          <input {...register('category')} className="w-full border rounded px-3 py-2" />
          {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            {mode === 'create' ? 'Create' : 'Save'}
          </button>
          <button type="button" onClick={()=>nav(-1)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  )
}