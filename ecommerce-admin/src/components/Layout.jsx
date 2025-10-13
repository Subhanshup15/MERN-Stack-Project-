import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded ${isActive ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <aside className="w-60 bg-white border-r h-screen p-4 sticky top-0">
          <h1 className="text-xl font-bold mb-6">Admin</h1>
          <nav className="space-y-2">
            <NavLink className={linkClass} to="/dashboard">Dashboard</NavLink>
            <NavLink className={linkClass} to="/products">Products</NavLink>
            <NavLink className={linkClass} to="/orders">Orders</NavLink>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}