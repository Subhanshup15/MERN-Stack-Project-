import { useState } from 'react'
import { useOrders } from '../hooks/orders'

export default function OrdersList() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, isError } = useOrders({ page, limit })
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Orders</h2>

      {isLoading && <div>Loading...</div>}
      {isError && <div className="text-red-600">Failed to load orders</div>}

      {!isLoading && (
        <div className="bg-white border rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Order ID</th>
                <th className="text-right p-3">Products</th>
                <th className="text-right p-3">Total</th>
                <th className="text-right p-3">Discounted Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3 text-right">{c.totalProducts}</td>
                  <td className="p-3 text-right">${c.total}</td>
                  <td className="p-3 text-right">${c.discountedTotal ?? c.total}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={4} className="p-3 text-center text-gray-500">No orders</td></tr>
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