import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FavoritesProvider } from './context/FavoritesContext'
import { CartProvider } from './context/CartContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FavoritesProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </FavoritesProvider>
  </StrictMode>,
)
