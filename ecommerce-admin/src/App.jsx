import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProductsList from './pages/ProductsList.jsx'
import ProductForm from './pages/ProductForm.jsx'
import OrdersList from './pages/OrdersList.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/new" element={<ProductForm mode="create" />} />
          <Route path="/products/:id/edit" element={<ProductForm mode="edit" />} />
          <Route path="/orders" element={<OrdersList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}