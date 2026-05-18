import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const localCart = localStorage.getItem('cartItems');
    if (localCart) {
      try {
        setCartItems(JSON.parse(localCart));
      } catch (err) {
        console.error('Error parsing cart items', err);
      }
    }
  }, []);

  // Sync helper
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const addToCart = (product, qty) => {
    // Record product popularity (number of times added to cart)
    const localPopularity = localStorage.getItem('cartPopularity');
    let popularity = localPopularity ? JSON.parse(localPopularity) : {};
    popularity[product._id] = (popularity[product._id] || 0) + qty;
    localStorage.setItem('cartPopularity', JSON.stringify(popularity));

    const existItem = cartItems.find((x) => x.product === product._id);

    if (existItem) {
      const updatedItems = cartItems.map((x) =>
        x.product === product._id
          ? { ...existItem, qty: Math.min(qty, product.countInStock) }
          : x
      );
      saveCart(updatedItems);
    } else {
      const newItem = {
        product: product._id,
        name: product.name,
        brand: product.brand || 'Procurasure',
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: qty,
      };
      saveCart([...cartItems, newItem]);
    }
  };

  const removeFromCart = (id) => {
    const updatedItems = cartItems.filter((x) => x.product !== id);
    saveCart(updatedItems);
  };

  const updateCartQty = (id, qty) => {
    const updatedItems = cartItems.map((x) =>
      x.product === id ? { ...x, qty: Math.min(qty, x.countInStock) } : x
    );
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
