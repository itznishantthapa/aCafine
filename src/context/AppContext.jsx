import React, { createContext, useEffect, useReducer, useState } from 'react';
import { getApiUrl, API_ENDPOINTS } from '../service/config';

export const AppContext = createContext();

const initialState = {
  allDishes: [],
  error: null,
  loading: true
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DISHES':
      return { ...state, allDishes: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchDishes = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await fetch(getApiUrl(API_ENDPOINTS.GET_ALL_DISHES));
      const data = await res.json();
      if (data.success) {
        dispatch({ type: 'SET_DISHES', payload: data.dishes });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch dishes' });
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch dishes. Please try again.' });
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  return (
    <AppContext.Provider 
      value={{
        allDishState: {
          ...state,
          refreshDishes: fetchDishes
        },
        isAuthenticated,
        setIsAuthenticated,
        isInitialized,
        setIsInitialized
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
