import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import { AuthProvider } from './auth/AuthContext';
import { Layout } from './Layout';
import { Home } from './Home';
import { Menu } from './menu/Menu';
import { DishDetail } from './menu/DishDetail';
import { CartPage } from './cart/CartPage';
import { Checkout } from './checkout/Checkout';
import { Favorites } from './favorites/Favorites';
import { OrderHistory } from './orders/OrderHistory';
import { RequireAuth } from './auth/RequireAuth';
import { LoginPage } from './auth/LoginPage';
import { SignupPage } from './auth/SignupPage';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { RequireAdmin } from './admin/RequireAdmin';
import { Dashboard } from './admin/Dashboard';
import { DishManager } from './admin/DishManager';
import { OrderManager } from './admin/OrderManager';
export default function App() {
  return (<ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="menu/:id" element={<DishDetail />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<RequireAuth>
              <Checkout />
            </RequireAuth>} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="orders" element={<RequireAuth>
              <OrderHistory />
            </RequireAuth>} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdmin>
            <AdminLayout />
          </RequireAdmin>}>
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<DishManager />} />
            <Route path="orders" element={<OrderManager />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>);
}
