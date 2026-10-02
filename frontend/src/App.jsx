import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import AIAssistantModal from './components/AIAssistantModal';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';

// Floating bot icon
import { Bot } from 'lucide-react';

function App() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
              
              <Routes>
                {/* Admin Routes with dedicated Dark Theme Layout */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>

                {/* Customer Storefront Routes */}
                <Route
                  path="*"
                  element={
                    <>
                      <Navbar onOpenAiAssistant={() => setIsAiModalOpen(true)} />
                      <main className="flex-1">
                        <Routes>
                          <Route
                            path="/"
                            element={<Home onOpenAiAssistant={() => setIsAiModalOpen(true)} />}
                          />
                          <Route path="/products" element={<Products />} />
                          <Route path="/products/:id" element={<ProductDetails />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route
                            path="/checkout"
                            element={
                              <ProtectedRoute>
                                <Checkout />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/orders"
                            element={
                              <ProtectedRoute>
                                <Orders />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/orders/:id"
                            element={
                              <ProtectedRoute>
                                <OrderDetails />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/profile"
                            element={
                              <ProtectedRoute>
                                <Profile />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                        </Routes>
                      </main>
                      <Footer />

                      {/* Floating AI Shopping Assistant Bubble */}
                      <button
                        onClick={() => setIsAiModalOpen(true)}
                        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white p-3.5 rounded-full shadow-2xl shadow-teal-700/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
                        title="Chat with AI Assistant"
                      >
                        <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-xs pl-0 group-hover:pl-2">
                          AI Assistant
                        </span>
                      </button>
                    </>
                  }
                />
              </Routes>

              {/* AI Assistant Modal */}
              <AIAssistantModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
              />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
