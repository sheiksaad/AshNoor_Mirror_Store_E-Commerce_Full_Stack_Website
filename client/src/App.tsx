import { useLocation } from "react-router";
import type { JSX } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { useAuth } from "@/features/auth/context/AuthContext";

import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ProductListPage } from "@/features/product/pages/ProductListPage";
import { ProductDetailPage } from "@/features/product/pages/ProductDetailPage";
import { CartPage } from "@/features/cart/pages/CartPage";
import { CheckoutPage } from "@/features/order/pages/CheckoutPage";
import { DashboardLayout } from "@/features/dashboard/pages/DashboardLayout";
import { ProfilePage } from "@/features/dashboard/pages/ProfilePage";
import { AddressBookPage } from "@/features/dashboard/pages/AddressBookPage";
import { OrderHistoryPage } from "@/features/order/pages/OrderHistoryPage";
import { OrderDetailPage } from "@/features/order/pages/OrderDetailPage";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { AdminOverviewPage } from "@/features/admin/pages/AdminOverviewPage";
import { AdminProductsPage } from "@/features/admin/pages/AdminProductsPage";
import { AdminOrdersPage } from "@/features/admin/pages/AdminOrdersPage";
import { AdminCouponsPage } from "@/features/admin/pages/AdminCouponsPage";
import { WishlistPage } from "@/features/wishlist/pages/WishlistPage";
import { AdminCustomersPage } from "@/features/admin/pages/AdminCustomersPage";
import { AdminAnalyticsPage } from "@/features/admin/pages/AdminAnalyticsPage";

function App(): JSX.Element {
  const { isLoading } = useAuth();
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin") || location.pathname.startsWith("/account");

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-body-md text-on-surface-variant">Loading...</div>;

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductListPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          <Route path="addresses" element={<AddressBookPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverviewPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;