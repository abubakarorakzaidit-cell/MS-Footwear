import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const STORAGE_KEY = "ms_footwear_cart";

const readCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const cartKey = (productId, size) => `${productId}__${size}`;

  const addToCart = (product, { size, quantity = 1 }) => {
    setItems((prev) => {
      const key = cartKey(product._id, size);
      const existing = prev.find((i) => cartKey(i.productId, i.size) === key);

      if (existing) {
        return prev.map((i) =>
          cartKey(i.productId, i.size) === key
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock || 99) }
            : i
        );
      }

      return [
        ...prev,
        {
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url,
          size,
          quantity,
          maxStock: product.stock,
        },
      ];
    });
  };

  const removeFromCart = (productId, size) => {
    setItems((prev) => prev.filter((i) => cartKey(i.productId, i.size) !== cartKey(productId, size)));
  };

  const updateQuantity = (productId, size, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        cartKey(i.productId, i.size) === cartKey(productId, size)
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock || 99)) }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
