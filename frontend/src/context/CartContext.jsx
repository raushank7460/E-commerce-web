// CartContext: manages cart state for both guest (localStorage) and logged-in users (backend sync)
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const getFirstImage = (images) => {
  if (!images) return '';
  if (Array.isArray(images)) return images[0] || '';
  return images.split(' ')[0] || '';
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.token) {
      fetchBackendCart();
    } else {
      const saved = localStorage.getItem('cartItems');
      setCartItems(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const fetchBackendCart = async () => {
    try {
      const res = await api.get('/api/cart');
      if (res.data?.data?.items) {
        const formatted = res.data.data.items.map(item => ({
          _id: item.product._id,
          product: item.product,
          name: item.product.name,
          price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price,
          originalPrice: item.product.price,
          image: getFirstImage(item.product.images),
          quantity: item.quantity,
          stock: item.product.stock
        }));
        setCartItems(formatted);
      }
    } catch (err) {
      console.error('Failed to load cart from server', err);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const targetQty = Number(quantity);
    const existingIndex = cartItems.findIndex(i => (i._id || i.product?._id) === product._id);

    if (existingIndex > -1) {
      const newQty = cartItems[existingIndex].quantity + targetQty;
      return updateQuantity(product._id, newQty);
    }

    const newItem = {
      _id: product._id,
      product,
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      originalPrice: product.price,
      image: getFirstImage(product.images),
      quantity: targetQty,
      stock: product.stock
    };

    const newItems = [...cartItems, newItem];
    setCartItems(newItems);

    if (user?.token) {
      try {
        await api.post('/api/cart', { productId: product._id, quantity: targetQty });
      } catch (err) {
        console.error('Failed to sync added cart item', err);
      }
    }

    return { success: true };
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    const updated = cartItems.map(item =>
      (item._id || item.product?._id) === productId ? { ...item, quantity } : item
    );
    setCartItems(updated);

    if (user?.token) {
      try {
        await api.put(`/api/cart/${productId}`, { quantity });
      } catch (err) {
        console.error('Failed to sync quantity update', err);
      }
    }
  };

  const removeFromCart = async (productId) => {
    const updated = cartItems.filter(item => (item._id || item.product?._id) !== productId);
    setCartItems(updated);

    if (user?.token) {
      try {
        await api.delete(`/api/cart/${productId}`);
      } catch (err) {
        console.error('Failed to sync item removal', err);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');

    if (user?.token) {
      try {
        await api.delete('/api/cart');
      } catch (err) {
        console.error('Failed to clear cart on server', err);
      }
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const discount = subtotal > 2000 ? Math.round(subtotal * 0.05) : 0;
  const totalAmount = Math.max(0, subtotal - discount + tax + shippingFee);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal: Math.round(subtotal * 100) / 100,
        shippingFee,
        tax,
        discount,
        totalAmount: Math.round(totalAmount * 100) / 100,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
