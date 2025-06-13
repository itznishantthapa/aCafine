import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const OrderCard = ({ 
  order, 
  onPress, 
  onMarkReady,
  showMarkReady = true,
  formatDate,
  calculateTotal 
}) => {
  const orderStatus = !order.is_paid
    ? { status: "Payment Pending", color: "#FF9800", icon: "payment" }
    : !order.is_ready
      ? { status: "Cooking", color: "#FF6B35", icon: "restaurant" }
      : { status: "Ready", color: "#4CAF50", icon: "check-circle" };

  return (
    <TouchableOpacity style={styles.orderCard} onPress={onPress} activeOpacity={0.7}>
      {/* Order Header with ID and Status */}
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>Order #{order.order_id}</Text>
          <Text style={styles.orderTime}>{formatDate(order.order_time)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: orderStatus.color }]}>
          <MaterialIcons name={orderStatus.icon} size={14} color="#FFFFFF" />
          <Text style={styles.statusText}>{orderStatus.status}</Text>
        </View>
      </View>

      {/* Customer Information */}
      <View style={styles.customerInfo}>
        <View style={styles.customerDetail}>
          <Ionicons name="person-outline" size={16} color="#666666" />
          <Text style={styles.customerName}>{order.customer.full_name}</Text>
        </View>
        {order.customer.phone && (
          <View style={styles.customerDetail}>
            <Ionicons name="call-outline" size={16} color="#666666" />
            <Text style={styles.customerPhone}>{order.customer.phone}</Text>
          </View>
        )}
      </View>

      {/* Order Details */}
      <View style={styles.orderDetails}>
        {/* Eat Mode */}
        <View style={styles.eatModeContainer}>
          <Ionicons 
            name={order.eat_mode === "EAT" ? "restaurant-outline" : "bag-outline"} 
            size={16} 
            color="#4CAF50" 
          />
          <Text style={styles.eatModeText}>
            {order.eat_mode === "EAT" ? "Dine In" : "Takeaway"}
          </Text>
        </View>

        {/* Items List */}
        <View style={styles.itemsContainer}>
          <Text style={styles.itemsTitle}>Order Items</Text>
          {order.items.map((orderItem, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemQuantity}>{orderItem.quantity}x</Text>
              <Text style={styles.itemName}>{orderItem.dish_name}</Text>
              <Text style={styles.itemPrice}>
                Rs. {(orderItem.price * orderItem.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Total Amount */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>Rs. {calculateTotal(order.items).toFixed(2)}</Text>
        </View>
      </View>

      {/* Action Button */}
      {showMarkReady && !order.is_ready && (
        <TouchableOpacity 
          style={styles.markReadyButton} 
          onPress={() => onMarkReady(order.order_id)}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.markReadyButtonText}>Mark as Ready</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#E8F5E9",
    borderBottomWidth: 1,
    borderBottomColor: "#C8E6C9",
  },
  orderIdContainer: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
  },
  orderTime: {
    fontSize: 13,
    color: "#666666",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    gap: 16,
  },
  customerDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  customerName: {
    fontSize: 15,
    color: "#333333",
    fontWeight: "500",
  },
  customerPhone: {
    fontSize: 15,
    color: "#333333",
  },
  orderDetails: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  eatModeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
    backgroundColor: "#F1F8E9",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  eatModeText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  itemsContainer: {
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666666",
    width: 40,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
  },
  markReadyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    gap: 8,
  },
  markReadyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OrderCard; 