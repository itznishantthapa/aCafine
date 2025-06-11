"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"

const OrderScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  const fetchOrders = async () => {
    try {
      setError(null)
      const response = await fetch('http://127.0.0.1:8000/api/get-user-orders/', {
        headers: {
          'Authorization': `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5NTc5NjQyLCJpYXQiOjE3NDk1NzY2NDIsImp0aSI6ImI3NjkwMzVkODNmMTQ2YzY4ZGU0YjJlYWJkYjdmMjUyIiwidXNlcl9pZCI6Mn0.39jhmeK4A3XRj0LwWWN-LsOGENF9jfFKoeDxB-R2m5Q"}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders()
  }, [])

  // Check order status when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (orders.length > 0 && !isCheckingStatus) {
        checkLatestOrderStatus()
      }
    }, []),
  )

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchOrders()
    if (orders.length > 0) {
      checkLatestOrderStatus()
    }
  }, [orders])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  const calculateTotal = (items) => {
    return items?.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getOrderStatus = (order) => {
    if (!order?.is_ready) {
      return { status: "Cooking", color: "#FF6B35", icon: "restaurant" }
    } else {
      return { status: "Ready", color: "#4CAF50", icon: "check-circle" }
    }
  }

  const checkLatestOrderStatus = async () => {
    if (orders.length === 0 || isCheckingStatus) return

    setIsCheckingStatus(true)
    const latestOrder = orders[0]
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/get-user-orders/`, {
        headers: {
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5NTc5NjQyLCJpYXQiOjE3NDk1NzY2NDIsImp0aSI6ImI3NjkwMzVkODNmMTQ2YzY4ZGU0YjJlYWJkYjdmMjUyIiwidXNlcl9pZCI6Mn0.39jhmeK4A3XRj0LwWWN-LsOGENF9jfFKoeDxB-R2m5Q"}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()

      if (data.length > 0) {
        const updatedLatestOrder = data[0]
        // Update the latest order in the orders array
        setOrders((prevOrders) => {
          const updatedOrders = [...prevOrders]
          updatedOrders[0] = updatedLatestOrder
          return updatedOrders
        })
      }
    } catch (error) {
      console.error("Error checking order status:", error)
    } finally {
      setIsCheckingStatus(false)
    }
  }

  const renderOrderItem = (item, index) => (
    <View key={index} style={styles.orderItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.dish_name}</Text>
        <Text style={styles.itemDetails}>
          Qty: {item.quantity} × Rs. {item.price}
        </Text>
      </View>
      <Text style={styles.itemTotal}>Rs. {(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  )

  const renderLatestOrder = () => {
    if (orders.length === 0) return null

    const latestOrder = orders[0]
    const orderStatus = getOrderStatus(latestOrder)
    const total = calculateTotal(latestOrder?.items)

    return (
      <View style={styles.latestOrderContainer}>
        <View style={styles.latestOrderHeader}>
          <Text style={styles.latestOrderTitle}>Latest Order</Text>
          <View style={[styles.statusBadge, { backgroundColor: orderStatus.color }]}>
            <MaterialIcons name={orderStatus.icon} size={16} color="#FFFFFF" />
            <Text style={styles.statusText}>{orderStatus.status}</Text>
          </View>
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Order #{latestOrder?.order_id}</Text>
              <Text style={styles.orderTime}>{formatDate(latestOrder?.order_time)}</Text>
            </View>
            <View style={styles.eatModeContainer}>
              <Ionicons name={latestOrder?.eat_mode === "EAT" ? "restaurant" : "bag"} size={16} color="#4CAF50" />
              <Text style={styles.eatModeText}>{latestOrder?.eat_mode === "EAT" ? "Dine In" : "Takeaway"}</Text>
            </View>
          </View>

          <View style={styles.itemsContainer}>
            {latestOrder?.items.map((item, index) => renderOrderItem(item, index))}
          </View>

          <View style={styles.orderTotal}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>Rs. {total.toFixed(2)}</Text>
          </View>

          {!latestOrder.is_ready && (
            <View style={styles.cookingIndicator}>
              <Text style={styles.cookingText}>Your order is being prepared...</Text>
            </View>
          )}

          {latestOrder.is_ready && (
            <View style={styles.readyIndicator}>
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.readyText}>Your Order is Ready!</Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  const renderOrderHistory = () => {
    if (orders.length <= 1) return null

    const historyOrders = orders.slice(1)

    return (
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Order History</Text>
        {historyOrders.map((order) => {
          const orderStatus = getOrderStatus(order)
          const total = calculateTotal(order.items)

          return (
            <TouchableOpacity
              key={order.order_id}
              style={styles.historyOrderCard}
              onPress={() => {
                // You can navigate to order details screen here
                Alert.alert("Order Details", `Order #${order.order_id} details`)
              }}
            >
              <View style={styles.historyOrderHeader}>
                <View style={styles.historyOrderInfo}>
                  <Text style={styles.historyOrderId}>Order #{order.order_id}</Text>
                  <Text style={styles.historyOrderTime}>{formatDate(order.order_time)}</Text>
                </View>
                <View style={[styles.historyStatusBadge, { backgroundColor: orderStatus.color }]}>
                  <MaterialIcons name={orderStatus.icon} size={12} color="#FFFFFF" />
                  <Text style={styles.historyStatusText}>{orderStatus.status}</Text>
                </View>
              </View>

              <View style={styles.historyOrderDetails}>
                <Text style={styles.historyItemCount}>
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </Text>
                <Text style={styles.historyEatMode}>{order.eat_mode === "EAT" ? "Dine In" : "Takeaway"}</Text>
                <Text style={styles.historyTotal}>Rs. {total.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptySubtitle}>Your order history will appear here once you place your first order.</Text>
          <TouchableOpacity style={styles.orderNowButton} onPress={() => navigation.navigate("Menu")}>
            <Text style={styles.orderNowButtonText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity onPress={onRefresh} disabled={refreshing}>
          <Ionicons name="refresh" size={24} color={refreshing ? "#CCCCCC" : "#4CAF50"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {renderLatestOrder()}
        {renderOrderHistory()}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginVertical: 20,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 30,
  },
  orderNowButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  orderNowButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  latestOrderContainer: {
    padding: 20,
  },
  latestOrderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  latestOrderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  orderTime: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  eatModeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  eatModeText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 15,
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  itemDetails: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  orderTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  cookingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    padding: 12,
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    gap: 8,
  },
  cookingText: {
    fontSize: 14,
    color: "#FF6B35",
    fontWeight: "600",
  },
  historyContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
  },
  historyOrderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  historyOrderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyOrderInfo: {
    flex: 1,
  },
  historyOrderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  historyOrderTime: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  historyStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },
  historyStatusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  historyOrderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyItemCount: {
    fontSize: 14,
    color: "#666666",
  },
  historyEatMode: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  historyTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  readyIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    padding: 12,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    gap: 8,
  },
  readyText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
})

export default OrderScreen
