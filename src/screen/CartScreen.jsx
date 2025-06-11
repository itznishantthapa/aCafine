"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from "react-native"
import { Ionicons, AntDesign } from "@expo/vector-icons"
import { useCart } from "../context/CartContext"
import PaymentBottomSheet from "../component/common/PaymentBottomSheet"

const CartScreen = ({ navigation }) => {
  const {
    items,
    totalItems,
    totalAmount,
    eatMode,
    updateQuantity,
    removeItem,
    clearCart,
    setEatMode,
    getOrderData,
  } = useCart()

  const [showPaymentSheet, setShowPaymentSheet] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)

  const handleQuantityChange = (dish_id, newQuantity) => {
    if (newQuantity < 1) {
      Alert.alert("Remove Item", "Are you sure you want to remove this item from cart?", [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => removeItem(dish_id) },
      ])
    } else {
      updateQuantity(dish_id, newQuantity)
    }
  }

  const handleClearCart = () => {
    Alert.alert("Clear Cart", "Are you sure you want to remove all items from cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", onPress: clearCart },
    ])
  }

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Alert.alert("Empty Cart", "Please add items to cart before placing order.")
      return
    }

    // Check if all items are available
    const unavailableItems = items.filter((item) => !item.is_available)
    if (unavailableItems.length > 0) {
      Alert.alert(
        "Unavailable Items",
        "Some items in your cart are currently unavailable. Please remove them before proceeding.",
      )
      return
    }

    // Show payment method selection
    setShowPaymentSheet(true)
  }

  const handlePaymentMethodSelect = (method) => {
    if (method === "esewa") {
      setProcessingPayment(true)
      setShowPaymentSheet(false)

      // Get order data in API format
      const orderData = getOrderData()

      // Navigate to payment screen
      setTimeout(() => {
        setProcessingPayment(false)
        navigation.navigate("Payment", {
          orderData,
          totalAmount,
        })
      }, 500)
    }
  }

  const renderCartItem = (item) => (
    <View key={item.dish_id} style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />

      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.dish_name}
        </Text>
        <Text style={styles.itemPrice}>Rs. {item.price}</Text>
        {!item.is_available && <Text style={styles.unavailableText}>Currently Unavailable</Text>}
      </View>

      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.dish_id, item.quantity - 1)}
        >
          <AntDesign name="minus" size={16} color="#333333" />
        </TouchableOpacity>

        <Text style={styles.quantityText}>{item.quantity}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.dish_id, item.quantity + 1)}
        >
          <AntDesign name="plus" size={16} color="#333333" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(item.dish_id)}>
        <Ionicons name="trash-outline" size={20} color="#FF4444" />
      </TouchableOpacity>
    </View>
  )

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Cart</Text>
        </View>
        <View style={styles.emptyCart}>
          <Ionicons name="basket-outline" size={80} color="#CCCCCC" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>Add some delicious items to get started!</Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate("Menu")}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Eat Mode Selection */}
      <View style={styles.eatModeContainer}>
        <Text style={styles.eatModeTitle}>Dining Option:</Text>
        <View style={styles.eatModeButtons}>
          <TouchableOpacity
            style={[styles.eatModeButton, eatMode === "EAT" && styles.selectedEatMode]}
            onPress={() => setEatMode("EAT")}
          >
            <Ionicons name="restaurant-outline" size={20} color={eatMode === "EAT" ? "#FFFFFF" : "#333333"} />
            <Text style={[styles.eatModeText, eatMode === "EAT" && styles.selectedEatModeText]}>Dine In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.eatModeButton, eatMode === "PACK" && styles.selectedEatMode]}
            onPress={() => setEatMode("PACK")}
          >
            <Ionicons name="bag-outline" size={20} color={eatMode === "PACK" ? "#FFFFFF" : "#333333"} />
            <Text style={[styles.eatModeText, eatMode === "PACK" && styles.selectedEatModeText]}>Takeaway</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.cartItems} showsVerticalScrollIndicator={false}>
        {items.map(renderCartItem)}
      </ScrollView>

      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Items:</Text>
          <Text style={styles.summaryValue}>{totalItems}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>Rs. {totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity
        style={[styles.placeOrderButton, processingPayment && styles.disabledButton]}
        onPress={handlePlaceOrder}
        disabled={processingPayment}
      >
        <Text style={styles.placeOrderText}>{processingPayment ? "Processing..." : "Place Order"}</Text>
      </TouchableOpacity>

      {/* Payment Bottom Sheet */}
      <PaymentBottomSheet
        visible={showPaymentSheet}
        onClose={() => setShowPaymentSheet(false)}
        onPaymentMethodSelect={handlePaymentMethodSelect}
        totalAmount={totalAmount}
        loading={processingPayment}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  clearButton: {
    fontSize: 16,
    color: "#FF4444",
    fontWeight: "600",
  },
  eatModeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  eatModeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
  },
  eatModeButtons: {
    flexDirection: "row",
    gap: 10,
  },
  eatModeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    gap: 8,
  },
  selectedEatMode: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  eatModeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  selectedEatModeText: {
    color: "#FFFFFF",
  },
  cartItems: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  unavailableText: {
    fontSize: 12,
    color: "#FF4444",
    fontStyle: "italic",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
  },
  orderSummary: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#F9F9F9",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  placeOrderButton: {
    backgroundColor: "#4CAF50",
    marginHorizontal: 20,
    marginVertical: 15,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyCartText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
})

export default CartScreen
