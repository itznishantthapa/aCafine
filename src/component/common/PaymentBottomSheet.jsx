"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { height: screenHeight } = Dimensions.get("window")

const PaymentBottomSheet = ({ visible, onClose, onPaymentMethodSelect, totalAmount, loading }) => {
  const [slideAnim] = useState(new Animated.Value(screenHeight))

  const showBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const hideBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose()
    })
  }

  // Show animation when visible changes
  if (visible) {
    showBottomSheet()
  }

  const handleEsewaPayment = () => {
    onPaymentMethodSelect("esewa")
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={hideBottomSheet}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouch} onPress={hideBottomSheet} />
        <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Choose Payment Method</Text>
            <TouchableOpacity onPress={hideBottomSheet} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333333" />
            </TouchableOpacity>
          </View>

          {/* Total Amount */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>Rs. {totalAmount.toFixed(2)}</Text>
          </View>

          {/* Payment Methods */}
          <View style={styles.paymentMethods}>
            <Text style={styles.sectionTitle}>Select Payment Method</Text>

            {/* eSewa Payment Option */}
            <TouchableOpacity
              style={[styles.paymentOption, loading && styles.disabledOption]}
              onPress={handleEsewaPayment}
              disabled={loading}
            >
              <View style={styles.paymentOptionLeft}>
                <View style={styles.esewaLogo}>
                  <Image source={require("../../assets/images/esewa.png")} style={{height:"100%",width:'100%'}}/>
                </View>
                <View style={styles.paymentOptionInfo}>
                  <Text style={styles.paymentOptionTitle}>eSewa</Text>
                  <Text style={styles.paymentOptionSubtitle}>Pay securely with eSewa</Text>
                </View>
              </View>
              <View style={styles.paymentOptionRight}>
                {loading ? (
                  <ActivityIndicator size="small" color="#4CAF50" />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#666666" />
                )}
              </View>
            </TouchableOpacity>

            {/* Future Payment Methods */}
            <TouchableOpacity style={[styles.paymentOption, styles.disabledOption]} disabled>
              <View style={styles.paymentOptionLeft}>
                <View style={[styles.paymentLogo, { backgroundColor: "#E0E0E0" }]}>
                  <Ionicons name="card" size={24} color="#999999" />
                </View>
                <View style={styles.paymentOptionInfo}>
                  <Text style={[styles.paymentOptionTitle, { color: "#999999" }]}>Credit/Debit Card</Text>
                  <Text style={[styles.paymentOptionSubtitle, { color: "#CCCCCC" }]}>Coming Soon</Text>
                </View>
              </View>
              <View style={styles.paymentOptionRight}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.paymentOption, styles.disabledOption]} disabled>
              <View style={styles.paymentOptionLeft}>
                <View style={[styles.paymentLogo, { backgroundColor: "#E0E0E0" }]}>
                  <Ionicons name="wallet" size={24} color="#999999" />
                </View>
                <View style={styles.paymentOptionInfo}>
                  <Text style={[styles.paymentOptionTitle, { color: "#999999" }]}>Cash on Delivery</Text>
                  <Text style={[styles.paymentOptionSubtitle, { color: "#CCCCCC" }]}>Coming Soon</Text>
                </View>
              </View>
              <View style={styles.paymentOptionRight}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Security Note */}
          <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
            <Text style={styles.securityText}>Your payment information is secure and encrypted</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlayTouch: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: screenHeight * 0.8,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  closeButton: {
    padding: 4,
  },
  totalContainer: {
    backgroundColor: "#F8F9FA",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  paymentMethods: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  disabledOption: {
    opacity: 0.6,
  },
  paymentOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  esewaLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  esewaLogoText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  paymentLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentOptionInfo: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 2,
  },
  paymentOptionSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  paymentOptionRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  comingSoonText: {
    fontSize: 12,
    color: "#999999",
    fontWeight: "500",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: "#666666",
  },
})

export default PaymentBottomSheet
