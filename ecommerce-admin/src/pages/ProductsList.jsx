import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts, useDeleteProduct } from '../hooks/products'

export default function ProductsList() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const limit = 10

  const { data, isLoading, isError } = useProducts({ page, limit, q })
  const del = useDeleteProduct()

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link className="px-3 py-2 bg-blue-600 text-white rounded" to="/products/new">Add Product</Link>
      </div>

      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e)=>{ setQ(e.target.value); setPage(1) }}
          placeholder="Search products..."
          className="border rounded px-3 py-2 w-full"
        />
        <button onClick={()=>setPage(1)} className="px-3 py-2 border rounded">Search</button>
      </div>

      {isLoading && <div>Loading...</div>}
      {isError && <div className="text-red-600">Failed to load products</div>}

      {!isLoading && (
        <div className="bg-white border rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Category</th>
                <th className="text-right p-3">Price</th>
                <th className="text-right p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 text-right">${p.price}</td>
                  <td className="p-3 text-right">{p.stock}</td>
                  <td className="p-3 text-right space-x-3">
                    <Link className="text-blue-600" to={`/products/${p.id}/edit`}>Edit</Link>
                    <button
                      className="text-red-600"
                      onClick={()=>{
                        if (window.confirm('Delete this product?')) del.mutate(p.id)
                      }}
                    >Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="p-3 text-center text-gray-500">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <div className="space-x-2">
          <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  )
}