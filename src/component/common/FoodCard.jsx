"use client"

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useRef } from "react"
import { Ionicons } from "@expo/vector-icons"
import { AntDesign } from "@expo/vector-icons"
import { useCartAnimation } from "../../context/CartAnimationContext"
import { useCart } from "../../context/CartContext"

const FoodCard = ({ data }) => {
  const { startAnimation } = useCartAnimation()
  const { addItem } = useCart()
  const addButtonRef = useRef(null)

  // Convert BigFoodCard data format to FoodCard format or use default
  const item = data
    ? {
        id: data.id || 1,
        food_name: data.title || data.name || "Veggie Burger",
        is_vegetarian: data.isVeg !== undefined ? data.isVeg : true,
        food_restaurant: "aCafine Cafe",
        is_available: data.is_available !== undefined ? data.is_available : true,
        food_price: data.currentPrice || Number.parseFloat(data.price) || 150,
        original_price: data.originalPrice || null,
        discount: data.discount || null,
        image:
          data.image ||
          "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
        description: data.description || "Delicious food item",
      }
    : {
        id: 1,
        food_name: "Veggie Burger",
        is_vegetarian: true,
        food_restaurant: "aCafine Cafe",
        is_available: true,
        food_price: 150,
        original_price: 180,
        discount: "17% OFF",
        image:
          "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
        description: "Delicious veggie burger",
      }

  // Create dish object in API format
  const dish = {
    id: item.id,
    name: item.food_name,
    price: item.food_price.toString(),
    image: item.image,
    is_available: item.is_available,
    description: item.description,
  }

  const handleAddToCart = () => {
    if (!item.is_available) return

    // Add item to cart
    addItem(dish)

    // Measure the position of the add button for animation
    addButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
      startAnimation({
        x: pageX + width / 2,
        y: pageY + height / 2,
      })
    })
  }

  return (
    <TouchableOpacity style={styles.card} onPress={() => undefined} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        {item.is_vegetarian && (
          <View style={styles.vegIndicator}>
            <Ionicons name="leaf" size={10} color="#4CAF50" />
          </View>
        )}
        <TouchableOpacity
          style={[styles.addButton, !item.is_available && styles.disabledButton]}
          onPress={handleAddToCart}
          ref={addButtonRef}
          disabled={!item.is_available}
        >
          <AntDesign name="plus" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.food_name}
        </Text>

        <Text style={styles.restaurant} numberOfLines={1}>
          {item.food_restaurant}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            Rs.<Text style={styles.priceNumber}>{item.food_price}</Text>
          </Text>
          {item.original_price && (
            <Text style={styles.originalPrice}>
              Rs.<Text style={styles.originalPriceNumber}>{item.original_price}</Text>
            </Text>
          )}
        </View>

        {item.discount && (
          <View style={styles.discountBadge}>
            <AntDesign name="tags" size={8} color="#FFFFFF" />
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
        )}

        <View style={[styles.availabilityContainer, { backgroundColor: item.is_available ? "#E8F5E9" : "#FFEBEE" }]}>
          <Ionicons
            name={item.is_available ? "checkmark-circle" : "close-circle"}
            size={10}
            color={item.is_available ? "#4CAF50" : "#F44336"}
          />
          <Text style={[styles.availability, { color: item.is_available ? "#4CAF50" : "#F44336" }]}>
            {item.is_available ? "Available" : "Unavailable"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default FoodCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  vegIndicator: {
    position: "absolute",
    top: 6,
    left: 6,
    padding: 4,
    borderRadius: 8,
    backgroundColor: "#E8F5E9",
  },
  addButton: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  infoContainer: {
    padding: 8,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  restaurant: {
    fontSize: 11,
    color: "#757575",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  price: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  priceNumber: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 9,
    color: "#f37240",
    textDecorationLine: "line-through",
  },
  originalPriceNumber: {
    fontSize: 12,
    color: "#f37240",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f37240",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    gap: 2,
    alignSelf: "flex-start",
  },
  discountText: {
    fontSize: 8,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  availability: {
    fontSize: 9,
    marginLeft: 2,
    fontWeight: "500",
  },
})
