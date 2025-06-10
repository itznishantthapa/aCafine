import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

export const carouselFoodItems = [
    {
      id: '1',
      food_name: "Deluxe Veggie Burger",
      is_vegetarian: true,
      food_restaurant: "Green Bites",
      is_available: true,
      food_price: 250,
      description: "Fresh vegetables with special sauce",
      image: "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: '2',
      food_name: "Chicken Mo:Mo Special",
      is_vegetarian: false,
      food_restaurant: "Nepali Kitchen",
      is_available: true,
      food_price: 180,
      description: "Steamed dumplings with spicy sauce",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9tb3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: '3',
      food_name: "Margherita Pizza",
      is_vegetarian: true,
      food_restaurant: "Italian Delight",
      is_available: false,
      food_price: 320,
      description: "Classic Italian pizza with fresh basil",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGl6emF8ZW58MHx8MHx8fDA%3D"
    },
    {
      id: '4',
      food_name: "Chocolate Lava Cake",
      is_vegetarian: true,
      food_restaurant: "Sweet Treats",
      is_available: true,
      food_price: 150,
      description: "Warm chocolate cake with molten center",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvY29sYXRlJTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D"
    }
]

const BigFoodCard = ({ item=carouselFoodItems[0] }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay} />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.food_name}
            </Text>
            {item.is_vegetarian && (
              <View style={styles.vegIndicator}>
                <Ionicons name="leaf" size={16} color="#4CAF50" />
              </View>
            )}
          </View>
          <Text style={styles.restaurant} numberOfLines={1}>
            {item.food_restaurant}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footerContainer}>
          <Text style={styles.price}>Rs. {item.food_price}</Text>
          <View style={[styles.availabilityContainer, { backgroundColor: item.is_available ? '#E8F5E9' : '#FFEBEE' }]}>
            <Ionicons 
              name={item.is_available ? "checkmark-circle" : "close-circle"} 
              size={16} 
              color={item.is_available ? "#4CAF50" : "#F44336"} 
            />
            <Text style={[styles.availability, { color: item.is_available ? "#4CAF50" : "#F44336" }]}>
              {item.is_available ? "Available" : "Unavailable"}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => undefined}>
          <AntDesign name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

export default BigFoodCard

const styles = StyleSheet.create({
  card: {
    width: width * 0.85,
    height: '40%',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'poppins_semibold',
    fontSize: 24,
    color: '#FFFFFF',
    flex: 1,
  },
  vegIndicator: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#E8F5E9',
  },
  restaurant: {
    fontFamily: 'poppins_regular',
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  description: {
    fontFamily: 'poppins_regular',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 15,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontFamily: 'poppins_semibold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availability: {
    fontFamily: 'poppins_semibold',
    fontSize: 14,
    marginLeft: 6,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})
