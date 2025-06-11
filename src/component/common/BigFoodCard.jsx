"use client"

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React, { useRef } from "react"
import { AntDesign } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"
import { useCartAnimation } from "../../context/CartAnimationContext"
import { useCart } from "../../context/CartContext"

const BigFoodCard = ({ data }) => {
  const { startAnimation } = useCartAnimation()
  const { addItem } = useCart()
  const addButtonRef = useRef(null)

  // Ensure data exists
  if (!data) {
    return null
  }

  // Extract data properties (coming from transformed API data)
  const {
    id,
    title,
    currentPrice,
    originalPrice,
    discount,
    image,
    isVeg,
    is_available,
    category,
  } = data

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
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.vegIndicator}>
          <Ionicons name={isVeg ? "leaf" : "restaurant"} size={18} color={isVeg ? "#4CAF50" : "#FF6B6B"} />
        </View>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={[styles.addButton, !is_available && styles.disabledButton]}
          onPress={is_available ? handleAddToCart : null}
          ref={addButtonRef}
          disabled={!is_available}
        >
          <AntDesign name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            Rs.<Text style={styles.priceText}>{currentPrice}</Text>
          </Text>
          {originalPrice && originalPrice !== currentPrice && (
            <Text style={styles.originalPrice}>
              Rs.<Text style={styles.originalPriceText}>{originalPrice}</Text>
            </Text>
          )}
          {discount && (
            <View style={styles.discountBadge}>
              <AntDesign name="tags" size={12} color="#FFFFFF" />
              <Text style={styles.discountText}>{discount}</Text>
            </View>
          )}
        </View>
        {!is_available && <Text style={styles.unavailableText}>Currently Unavailable</Text>}
      </View>
    </View>
  )
}

export default BigFoodCard

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: 390,
    height: 300,
    position: "relative",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    gap: 8,
    paddingTop:12
  },
  title: {
    fontSize: 24,
    color: "#333333",
    fontWeight: "bold",
    textAlign: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  price: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  priceText: {
    fontSize: 20,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 12,
    color: "#f37240",
    fontWeight: "normal",
    textDecorationLine: "line-through",
  },
  originalPriceText: {
    fontSize: 16,
    color: "#f37240",
    fontWeight: "normal",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f37240",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  discountText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  vegIndicator: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  unavailableText: {
    fontSize: 14,
    color: "#FF4444",
    fontWeight: "600",
    textAlign: "center",
  },
})
