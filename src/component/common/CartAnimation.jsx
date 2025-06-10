// src/component/common/CartAnimation.jsx
import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CartAnimation = ({ startPosition, onAnimationEnd }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Calculate the end position (center-bottom where the cart tab is)
    const endX = screenWidth / 2 - startPosition.x - 15; // Adjust for icon size
    const endY = screenHeight - startPosition.y - 35; // Adjust for tab bar height

    // Animation sequence
    Animated.parallel([
      // Move to cart position
      Animated.timing(translateX, {
        toValue: endX,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: endY,
        duration: 800,
        useNativeDriver: true,
      }),
      // Scale down as it moves
      Animated.timing(scale, {
        toValue: 0.5,
        duration: 800,
        useNativeDriver: true,
      }),
      // Fade out slightly at the end
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    });
  }, [startPosition]);

  return (
    <Animated.View
      style={[
        styles.animatedItem,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
          left: startPosition.x,
          top: startPosition.y,
        },
      ]}
    >
      <View style={styles.itemCircle}>
        <Ionicons name="basket" size={18} color="#FFFFFF" />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedItem: {
    position: 'absolute',
    zIndex: 9999,
  },
  itemCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CartAnimation;