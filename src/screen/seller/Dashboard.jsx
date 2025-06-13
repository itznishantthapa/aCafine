"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
  Alert,
  StatusBar,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { FontAwesome6, Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import getAccessToken from "../../service/apis/getToken"
import OrderCard from '../../component/common/OrderCard';

const Dashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [orders, setOrders] = useState([])
  const [dishes, setDishes] = useState([])
  const [showRevenue, setShowRevenue] = useState(false)
  const [stats, setStats] = useState({
    totalOrdersToday: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  })
  const [error, setError] = useState(null)

  // Format date
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
        hour: "numeric",
        minute: "numeric",
      })
    }
  }

  // Calculate total amount
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + Number.parseFloat(item.price) * item.quantity, 0)
  }

  // Fetch data function
  const fetchData = async () => {
    try {
      setError(null)
      const token = getAccessToken();

      if (!token) {
        setError("Authentication token not found. Please login again.")
        setLoading(false)
        return
      }

      // Fetch all orders
      const ordersResponse = await fetch("http://127.0.0.1:8000/api/get-all-orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!ordersResponse.ok) {
        throw new Error(`Failed to fetch orders: ${ordersResponse.status}`)
      }

      const ordersData = await ordersResponse.json()
      setOrders(ordersData)

      // Fetch dishes
      const dishesResponse = await fetch("http://127.0.0.1:8000/api/get-all-dish/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!dishesResponse.ok) {
        throw new Error(`Failed to fetch dishes: ${dishesResponse.status}`)
      }

      const dishesData = await dishesResponse.json()
      setDishes(dishesData.dishes || [])

      // Calculate statistics
      calculateStats(ordersData)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Calculate statistics from orders data
  const calculateStats = (ordersData) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayOrders = ordersData.filter((order) => {
      const orderDate = new Date(order.order_time)
      return orderDate >= today
    })

    const pendingOrders = ordersData.filter((order) => !order.is_ready)
    const completedOrders = ordersData.filter((order) => order.is_ready)

    // Calculate total revenue using the price from order items
    let totalRevenue = 0
    ordersData.forEach((order) => {
      order.items.forEach((item) => {
        totalRevenue += Number.parseFloat(item.price) * item.quantity
      })
    })

    setStats({
      totalOrdersToday: todayOrders.length,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      totalRevenue,
    })
  }

  // Refresh data
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [])

  // Refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, []),
  )

  // Handle marking an order as ready
  const handleMarkAsReady = async (orderId) => {
    try {
      const token = getAccessToken();

      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please login again.")
        return
      }

      const response = await fetch(`http://127.0.0.1:8000/api/mark-order-ready/?id=${orderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to mark order as ready: ${response.status}`)
      }

      const data = await response.json()
      Alert.alert("Success", data.message)

      // Refresh orders after marking as ready
      fetchData()
    } catch (err) {
      console.error("Error marking order as ready:", err)
      Alert.alert("Error", err.message)
    }
  }

  // Navigate to add new dish screen
  const handleAddNewDish = () => {
    navigation.navigate("AddDish")
  }

  // Navigate to manage menu screen
  const handleManageMenu = () => {
    navigation.navigate("ManageMenu")
  }

  // Navigate to all orders screen with specific filter
  const handleViewAllOrders = (filter = 'all') => {
    navigation.navigate("AllOrder", { initialFilter: filter })
  }

  // Toggle revenue visibility
  const toggleRevenueVisibility = () => {
    setShowRevenue(!showRevenue)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#FF4444" />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Seller Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage your restaurant</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="close" />
        <View style={{ borderWidth: 0.5, borderColor: 'black', width: '85%', height: 0 }} />
        <Ionicons name="close" />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <TouchableOpacity 
              style={[styles.statsCard, styles.primaryCard]}
              onPress={() => handleViewAllOrders('today')}
              activeOpacity={0.7}
            >
              <View style={styles.statsIconContainer}>
                <Ionicons name="today-outline" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.statsValue}>{stats.totalOrdersToday}</Text>
              <Text style={styles.statsLabel}>Today's Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statsCard, styles.warningCard]}
              onPress={() => handleViewAllOrders('pending')}
              activeOpacity={0.7}
            >
              <View style={styles.statsIconContainer}>
                <Ionicons name="time-outline" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.statsValue}>{stats.pendingOrders}</Text>
              <Text style={styles.statsLabel}>Pending Orders</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <TouchableOpacity 
              style={[styles.statsCard, styles.successCard]}
              onPress={() => handleViewAllOrders('ready')}
              activeOpacity={0.7}
            >
              <View style={styles.statsIconContainer}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.statsValue}>{stats.completedOrders}</Text>
              <Text style={styles.statsLabel}>Completed Orders</Text>
            </TouchableOpacity>

            <View style={[styles.statsCard, styles.infoCard]}>
              <View style={styles.statsIconContainer}>
                <FontAwesome6 name="money-bill-wheat" size={24} color="#FFFFFF" />
              </View>
              <TouchableOpacity 
                style={styles.revenueContainer} 
                onPress={toggleRevenueVisibility}
                activeOpacity={0.7}
              >
                <Text style={styles.statsValue}>
                  {showRevenue ? `Rs. ${stats.totalRevenue}` : '******'}
                </Text>
                <Ionicons 
                  name={showRevenue ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#FFFFFF" 
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
              <Text style={styles.statsLabel}>Total Revenue</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddNewDish}>
              <View style={[styles.actionIconContainer, { backgroundColor: "#E8F5E9" }]}>
                <Ionicons name="add-circle-outline" size={28} color="#4CAF50" />
              </View>
              <Text style={styles.actionText}>Add New Dish</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleManageMenu}>
              <View style={[styles.actionIconContainer, { backgroundColor: "#FFF3E0" }]}>
                <Ionicons name="restaurant-outline" size={28} color="#FF9800" />
              </View>
              <Text style={styles.actionText}>Manage Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => handleViewAllOrders('all')}>
              <View style={[styles.actionIconContainer, { backgroundColor: "#E3F2FD" }]}>
                <Ionicons name="list-outline" size={28} color="#2196F3" />
              </View>
              <Text style={styles.actionText}>All Orders</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending Orders */}
        <View style={styles.pendingOrdersContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Orders</Text>
            <TouchableOpacity onPress={() => handleViewAllOrders('pending')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {orders.filter((order) => !order.is_ready).length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
              <Text style={styles.emptyStateText}>No pending orders!</Text>
            </View>
          ) : (
            orders
              .filter((order) => !order.is_ready)
              .map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  onPress={() => handleViewOrderDetails(order)}
                  onMarkReady={handleMarkAsReady}
                  formatDate={formatDate}
                  calculateTotal={calculateTotal}
                />
              ))
          )}
        </View>

        {/* Menu Status */}
        <View style={styles.menuStatusContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Menu Status</Text>
            <TouchableOpacity onPress={handleManageMenu}>
              <Text style={styles.viewAllText}>Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuStatsRow}>
            <View style={styles.menuStatCard}>
              <Text style={styles.menuStatValue}>{dishes.length}</Text>
              <Text style={styles.menuStatLabel}>Total Items</Text>
            </View>

            <View style={styles.menuStatCard}>
              <Text style={styles.menuStatValue}>{dishes.filter((dish) => dish.is_available).length}</Text>
              <Text style={styles.menuStatLabel}>Available</Text>
            </View>

            <View style={styles.menuStatCard}>
              <Text style={styles.menuStatValue}>{dishes.filter((dish) => !dish.is_available).length}</Text>
              <Text style={styles.menuStatLabel}>Unavailable</Text>
            </View>
          </View>

          <View style={styles.menuItemsPreview}>
            {dishes.map((dish) => (
              <View key={dish.id} style={styles.menuItemCard}>
                <Image
                  source={{
                    uri: dish.image.startsWith("http") ? dish.image : `http://127.0.0.1:8000${dish.image}`,
                  }}
                  style={styles.menuItemImage}
                />
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{dish.title}</Text>
                  <Text style={styles.menuItemPrice}>Rs. {Number.parseFloat(dish.current_price).toFixed(2)}</Text>
                </View>
                <View
                  style={[styles.availabilityBadge, { backgroundColor: dish.is_available ? "#E8F5E9" : "#FFEBEE" }]}
                >
                  <Text style={[styles.availabilityText, { color: dish.is_available ? "#4CAF50" : "#F44336" }]}>
                    {dish.is_available ? "Available" : "Unavailable"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  profileButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: "#4CAF50",
  },
  warningCard: {
    backgroundColor: "#FF9800",
  },
  successCard: {
    backgroundColor: "#2196F3",
  },
  infoCard: {
    backgroundColor: "#9C27B0",
  },
  statsIconContainer: {
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
  },
  pendingOrdersContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 12,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  orderTime: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  orderTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  orderTypeText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#F5F5F5",
    padding: 8,
    borderRadius: 8,
  },
  customerName: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
    marginLeft: 6,
  },
  customerPhone: {
    fontSize: 14,
    color: "#333333",
    marginLeft: 6,
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginRight: 8,
    width: 24,
  },
  itemName: {
    fontSize: 14,
    color: "#333333",
  },
  markReadyButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  markReadyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  menuStatusContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 24,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  menuStatCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F5F7FA",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  menuStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  menuStatLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },
  menuItemsPreview: {
    gap: 12,
  },
  menuItemCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    overflow: "hidden",
  },
  menuItemImage: {
    width: 70,
    height: 70,
  },
  menuItemInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  revenueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  eyeIcon: {
    opacity: 0.9,
  },
})

export default Dashboard
