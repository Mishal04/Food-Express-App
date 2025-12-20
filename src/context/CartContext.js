import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  // Guest cart ke liye localStorage mein store karein
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('foodexpress_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // User login status track karein (guest vs logged in)
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    // Cart ko save karein
    localStorage.setItem('foodexpress_cart', JSON.stringify(cartItems));
    
    // Check if user is logged in
    const checkAuthStatus = () => {
      const user = localStorage.getItem('foodexpress_current_user') || 
                   localStorage.getItem('currentUser') ||
                   localStorage.getItem('mockUser');
      setIsGuest(!user);
    };
    
    checkAuthStatus();
    
    // Listen for auth changes
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [cartItems]);

  const addToCart = (item) => {
    console.log("🛒 Adding to cart:", item.name);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        const newItems = prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        console.log("🛒 Cart updated:", newItems);
        return newItems;
      } else {
        const newItems = [...prevItems, { ...item, quantity: 1 }];
        console.log("🛒 Item added to cart:", newItems);
        return newItems;
      }
    });
    
    // Show notification
    if (window.showCartNotification) {
      window.showCartNotification(`${item.name} added to cart!`);
    } else {
      console.log("📢 Notification:", `${item.name} added to cart!`);
    }
  };

  const removeFromCart = (id) => {
    console.log("🗑️ Removing item from cart:", id);
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    console.log("🔄 Updating quantity:", id, "to", quantity);
    
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    console.log("🧹 Clearing entire cart");
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    isGuest
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};