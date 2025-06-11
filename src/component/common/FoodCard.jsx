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

  // Ensure data exists
  if (!data) {
    return null
  }

  // Extract data properties (coming from transformed API data)
  const { id, title, currentPrice, originalPrice, discount, image, isVeg, is_available, category } = data

  // Create dish object in API format for cart
  const dish = {
    id: id,
    name: title,
    price: currentPrice.toString(),
    image: image,
    is_available: is_available,
    description: `Delicious ${title}`,
  }

  const handleAddToCart = () => {
    if (!is_available) return

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
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        {isVeg && (
          <View style={styles.vegIndicator}>
            <Ionicons name="leaf" size={10} color="#4CAF50" />
          </View>
        )}
        <TouchableOpacity
          style={[styles.addButton, !is_available && styles.disabledButton]}
          onPress={handleAddToCart}
          ref={addButtonRef}
          disabled={!is_available}
        >
          <AntDesign name="plus" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.restaurant} numberOfLines={1}>
          aCafine Cafe
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            Rs.<Text style={styles.priceNumber}>{currentPrice}</Text>
          </Text>
          {originalPrice && originalPrice !== currentPrice && (
            <Text style={styles.originalPrice}>
              Rs.<Text style={styles.originalPriceNumber}>{originalPrice}</Text>
            </Text>
          )}
        </View>

        {discount && (
          <View style={styles.discountBadge}>
            <AntDesign name="tags" size={8} color="#FFFFFF" />
            <Text style={styles.discountText}>{discount}</Text>
          </View>
        )}

        <View style={[styles.availabilityContainer, { backgroundColor: is_available ? "#E8F5E9" : "#FFEBEE" }]}>
          <Ionicons
            name={is_available ? "checkmark-circle" : "close-circle"}
            size={10}
            color={is_available ? "#4CAF50" : "#F44336"}
          />
          <Text style={[styles.availability, { color: is_available ? "#4CAF50" : "#F44336" }]}>
            {is_available ? "Available" : "Unavailable"}
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
