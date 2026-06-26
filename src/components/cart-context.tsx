"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  product: { id: string; name: string; slug: string; image_url: string; price: number };
  quantity: number;
  size?: string;
  price_at_time: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function sanitizeProduct(product: any) {
  return { id: product.id, name: product.name, slug: product.slug, image_url: product.image_url, price: product.price };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mithila_cart');
      if (saved) setCartItems(JSON.parse(saved));
    } catch(e) {}
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) localStorage.setItem('mithila_cart', JSON.stringify(cartItems));
  }, [cartItems, isMounted]);

  const addToCart = (item: CartItem) => {
    const sanitized = { ...item, product: sanitizeProduct(item.product) };
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === sanitized.product.id && i.size === sanitized.size);
      if (existing) {
        const newQuantity = Math.min(existing.quantity + sanitized.quantity, 10);
        return prev.map(i => (i.product.id === sanitized.product.id && i.size === sanitized.size) ? { ...i, quantity: newQuantity } : i);
      }
      const newQuantity = Math.min(sanitized.quantity, 10);
      return [...prev, { ...sanitized, quantity: newQuantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCartItems(prev => prev.filter(i => !(i.product.id === productId && i.size === size)));
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) { removeFromCart(productId, size); return; }
    const newQuantity = Math.min(quantity, 10);
    setCartItems(prev => prev.map(i => (i.product.id === productId && i.size === size) ? { ...i, quantity: newQuantity } : i));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, setIsCartOpen, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
