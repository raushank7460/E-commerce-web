import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlistItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user?.token) {
      fetchBackendWishlist();
    } else {
      const saved = localStorage.getItem('wishlistItems');
      setWishlist(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const fetchBackendWishlist = async () => {
    try {
      const res = await api.get('/api/wishlist');
      if (res.data?.data) {
        setWishlist(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load wishlist from server', err);
    }
  };

  const addToWishlist = async (product) => {
    if (wishlist.some(p => p._id === product._id)) {
      return removeFromWishlist(product._id);
    }

    const updated = [...wishlist, product];
    setWishlist(updated);

    if (user?.token) {
      try {
        await api.post('/api/wishlist', { productId: product._id });
      } catch (err) {
        console.error('Failed to sync added wishlist item', err);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    const updated = wishlist.filter(p => p._id !== productId);
    setWishlist(updated);

    if (user?.token) {
      try {
        await api.delete(`/api/wishlist/${productId}`);
      } catch (err) {
        console.error('Failed to sync removed wishlist item', err);
      }
    }
  };

  const moveToCart = async (product) => {
    await addToCart(product, 1);
    await removeFromWishlist(product._id);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(p => p._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        isInWishlist,
        wishlistCount: wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
