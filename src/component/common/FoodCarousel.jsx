import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import BigFoodCard from './BigFoodCard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FoodCarousel = ({ data }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use provided data or fallback to default data
  const foodData = data || [
    {
      id: 1,
      title: 'Dora Cake',
      currentPrice: 80,
      originalPrice: 100,
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D',
      isVeg: true,
    },
  ];

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  const renderFoodCard = (item, index) => {
    const inputRange = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, 50],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.cardContainer,
          {
            transform: [{ scale }, { translateY }],
            opacity,
          },
        ]}
      >
        <BigFoodCard data={item} />
      </Animated.View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {foodData.map((_, index) => {
          const inputRange = [
            (index - 1) * screenWidth,
            index * screenWidth,
            (index + 1) * screenWidth,
          ];

          const dotScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.3, 0.8],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  transform: [{ scale: dotScale }],
                  opacity: dotOpacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { 
            useNativeDriver: false,
            listener: handleScroll,
          }
        )}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={screenWidth}
        snapToAlignment="center"
        contentContainerStyle={styles.scrollContainer}
      >
        {foodData.map((item, index) => renderFoodCard(item, index))}
      </Animated.ScrollView>
      {renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: screenHeight * 0.45,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  cardContainer: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginHorizontal: 4,
  },
});

export default FoodCarousel;