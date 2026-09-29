import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ProductVariant } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant | null, customization?: Record<string, string> | null) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dastkar_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dastkar_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to sync cart to storage', e);
    }
  }, [items]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    variant?: ProductVariant | null,
    customization?: Record<string, string> | null
  ) => {
    const unitPrice = variant ? variant.price : product.base_price;
    setItems((prev) => {
      // Check if item already exists with exact same variant and customization
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          (i.variant?.id ?? null) === (variant?.id ?? null) &&
          JSON.stringify(i.customization || {}) === JSON.stringify(customization || {})
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      return [
        ...prev,
        {
          product,
          variant,
          quantity,
          customization,
          unit_price: unitPrice,
        },
      ];
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setItems((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index].quantity = quantity;
      }
      return next;
    });
  };

  const removeFromCart = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
