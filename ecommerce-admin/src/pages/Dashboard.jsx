import MetricCard from '../components/MetricCard'
import SalesChart from '../components/SalesChart'
import { useProducts } from '../hooks/products'
import { useOrders, useRevenueMonthly } from '../hooks/orders'

export default function Dashboard() {
  const { data: prodMeta } = useProducts({ page: 1, limit: 1 })
  const { data: ordersMeta } = useOrders({ page: 1, limit: 1 })
  const { data: revenue } = useRevenueMonthly()

  const totalProducts = prodMeta?.total ?? 0
  const totalOrders = ordersMeta?.total ?? 0
  const monthlyRevenue = revenue?.monthly ?? Array(12).fill(0)
  const totalRevenue = monthlyRevenue.reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Total Products" value={totalProducts} />
        <MetricCard label="Total Orders" value={totalOrders} />
        <MetricCard label="Revenue (mock)" value={`$${totalRevenue.toLocaleString()}`} />
      </div>
      <SalesChart monthly={monthlyRevenue} />
    </div>
  )
}