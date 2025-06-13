"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"
import getAccessToken from "../../service/apis/getToken"
import SearchBar from '../../component/common/SearchBar';
import OrderCard from '../../component/common/OrderCard';

const AllOrders = ({ navigation, route }) => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState(route.params?.initialFilter || "all")
  const [error, setError] = useState(null)

  // Filter options
  const filters = [
    { id: "all", name: "All Orders" },
    { id: "pending", name: "Pending" },
    { id: "ready", name: "Ready" },
    { id: "today", name: "Today" },
  ]

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setError(null)
      const token = getAccessToken();


      if (!token) {
        setError("Authentication token not found. Please login again.")
        setLoading(false)
        return
      }

      const response = await fetch("http://127.0.0.1:8000/api/get-all-orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`)
      }

      const data = await response.json()
      setOrders(data)
      applyFilters(data, activeFilter, searchQuery)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Apply filters and search
  const applyFilters = (ordersData, filter, query) => {
    let filtered = [...ordersData]

    // Apply status filter
    if (filter === "pending") {
      filtered = filtered.filter((order) => !order.is_ready)
    } else if (filter === "ready") {
      filtered = filtered.filter((order) => order.is_ready)
    } else if (filter === "today") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.order_time)
        return orderDate >= today
      })
    }

    // Apply search query
    if (query) {
      const lowercaseQuery = query.toLowerCase()
      filtered = filtered.filter((order) => {
        // Search by order ID
        if (order.order_id.toString().includes(lowercaseQuery)) {
          return true
        }

        // Search by customer name
        if (order.customer_name && order.customer_name.toLowerCase().includes(lowercaseQuery)) {
          return true
        }

        // Search by items
        const hasMatchingItem = order.items.some((item) => item.dish_name.toLowerCase().includes(lowercaseQuery))

        return hasMatchingItem
      })
    }

    setFilteredOrders(filtered)
  }

  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text)
    applyFilters(orders, activeFilter, text)
  }

  // Handle filter selection
  const handleFilterSelect = (filter) => {
    setActiveFilter(filter)
    applyFilters(orders, filter, searchQuery)
  }

  // Mark order as ready
  const handleMarkAsReady = async (orderId) => {
    try {
      const token = getAccessToken();

      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please login again.")
        return
      }

      // Optimistically update UI
      const updatedOrders = orders.map((order) => (order.order_id === orderId ? { ...order, is_ready: true } : order))
      setOrders(updatedOrders)
      applyFilters(updatedOrders, activeFilter, searchQuery)

      // Make API request
      const response = await fetch(`http://127.0.0.1:8000/api/mark-order-ready/?id=${orderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        // Revert changes if API call fails
        const revertedOrders = orders.map((order) =>
          order.order_id === orderId ? { ...order, is_ready: false } : order,
        )
        setOrders(revertedOrders)
        applyFilters(revertedOrders, activeFilter, searchQuery)

        throw new Error(data.error || "Failed to mark order as ready")
      } else {
        Alert.alert("Success", "Order marked as ready")
      }
    } catch (err) {
      console.error("Error marking order as ready:", err)
      Alert.alert("Error", err.message || "Failed to mark order as ready")
    }
  }

  // View order details
  const handleViewOrderDetails = (order) => {
    navigation.navigate("OrderDetails", { order })
  }

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

  // Refresh data
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchOrders()
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchOrders()
  }, [])

  // Apply initial filter when component mounts
  useEffect(() => {
    if (route.params?.initialFilter) {
      handleFilterSelect(route.params.initialFilter)
    }
  }, [route.params?.initialFilter])

  // Refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchOrders()
    }, []),
  )

  // Render filter button
  const renderFilterButton = (filter) => (
    <TouchableOpacity
      key={filter.id}
      style={[styles.filterButton, activeFilter === filter.id && styles.activeFilterButton]}
      onPress={() => handleFilterSelect(filter.id)}
    >
      <Text style={[styles.filterButtonText, activeFilter === filter.id && styles.activeFilterButtonText]}>
        {filter.name}
      </Text>
    </TouchableOpacity>
  )

  // Render order item
  const renderOrderItem = ({ item }) => (
    <OrderCard
      order={item}
      onPress={() => handleViewOrderDetails(item)}
      onMarkReady={handleMarkAsReady}
      formatDate={formatDate}
      calculateTotal={calculateTotal}
    />
  );

  // Loading state
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    )
  }

  // Error state
  if (error && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#FF4444" />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>All Orders</Text>
            <Text style={styles.headerSubtitle}>
              {orders.length} total • {orders.filter((o) => !o.is_ready).length} pending
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh} disabled={refreshing}>
          <Ionicons name="refresh" size={24} color={refreshing ? "#CCCCCC" : "#4CAF50"} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="close" />
        <View style={{ borderWidth: 0.5, borderColor: 'black', width: '85%', height: 0 }} />
        <Ionicons name="close" />
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search orders by ID, customer, or items..."
      />

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContainer}
        >
          {filters.map(renderFilterButton)}
        </ScrollView>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.order_id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={60} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || activeFilter !== "all"
                ? "Try changing your search or filter"
                : "Orders will appear here when customers place them"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 4,
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
  refreshButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: "#333333",
  },
  filtersContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  filtersScrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
  },
  activeFilterButton: {
    borderColor: "#4CAF50",
    backgroundColor: "#F1F8E9",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  activeFilterButtonText: {
    color: "#4CAF50",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
  },
})

export default AllOrders
