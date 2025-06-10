// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  SET_EAT_MODE: 'SET_EAT_MODE',
};

// Initial state
const initialState = {
  items: [], // Format: [{ dish_id, dish_name, price, image, quantity, is_available }]
  totalItems: 0,
  totalAmount: 0,
  eatMode: 'EAT', // 'EAT' or 'PACK'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { dish } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.dish_id === dish.id);
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New item, add to cart
        const newItem = {
          dish_id: dish.id,
          dish_name: dish.name,
          price: parseFloat(dish.price),
          image: dish.image,
          quantity: 1,
          is_available: dish.is_available,
          description: dish.description,
        };
        updatedItems = [...state.items, newItem];
      }

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount,
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const { dish_id } = action.payload;
      const updatedItems = state.items.filter(item => item.dish_id !== dish_id);
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount,
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { dish_id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: CART_ACTIONS.REMOVE_ITEM, payload: { dish_id } });
      }

      const updatedItems = state.items.map(item =>
        item.dish_id === dish_id ? { ...item, quantity } : item
      );

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount,
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      };
    }

    case CART_ACTIONS.LOAD_CART: {
      const { cartData } = action.payload;
      const totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...cartData,
        totalItems,
        totalAmount,
      };
    }

    case CART_ACTIONS.SET_EAT_MODE: {
      return {
        ...state,
        eatMode: action.payload.eatMode,
      };
    }

    default:
      return state;
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from AsyncStorage on app start
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Save cart to AsyncStorage whenever state changes
  useEffect(() => {
    saveCartToStorage();
  }, [state]);

  const loadCartFromStorage = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: { cartData: parsedCart } });
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  };

  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  // Cart actions
  const addItem = (dish) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { dish } });
  };

  const removeItem = (dish_id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { dish_id } });
  };

  const updateQuantity = (dish_id, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { dish_id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const setEatMode = (eatMode) => {
    dispatch({ type: CART_ACTIONS.SET_EAT_MODE, payload: { eatMode } });
  };

  // Get cart data in API format for order creation
  const getOrderData = (esewaTransactionId = '') => {
    return {
      eat_mode: state.eatMode,
      esewa_transaction_id: esewaTransactionId,
      items: state.items.map(item => ({
        dish_id: item.dish_id,
        quantity: item.quantity,
      })),
    };
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setEatMode,
    getOrderData,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};