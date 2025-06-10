// src/context/CartAnimationContext.jsx
import React, { createContext, useState, useContext } from 'react';
import CartAnimation from '../component/common/CartAnimation';

const CartAnimationContext = createContext();

export const CartAnimationProvider = ({ children }) => {
  const [animationConfig, setAnimationConfig] = useState(null);

  const startAnimation = (startPosition) => {
    setAnimationConfig({ startPosition, key: Date.now() });
  };

  const endAnimation = () => {
    setAnimationConfig(null);
  };

  return (
    <CartAnimationContext.Provider value={{ animationConfig, startAnimation, endAnimation }}>
      {children}
      {animationConfig && (
        <CartAnimation
          key={animationConfig.key}
          startPosition={animationConfig.startPosition}
          onAnimationEnd={endAnimation}
        />
      )}
    </CartAnimationContext.Provider>
  );
};

export const useCartAnimation = () => useContext(CartAnimationContext);