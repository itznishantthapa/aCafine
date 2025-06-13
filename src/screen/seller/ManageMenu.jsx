"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"
import getAccessToken from "../../service/apis/getToken"
import SearchBar from '../../component/common/SearchBar'

const ManageMenu = ({ navigation }) => {
  const [dishes, setDishes] = useState([])
  const [filteredDishes, setFilteredDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [error, setError] = useState(null)

  // Categories for filtering
  const categories = [
    { id: "all", name: "All", icon: "grid-outline" },
    { id: "veg", name: "Veg", icon: "leaf-outline" },
    { id: "non-veg", name: "Non-Veg", icon: "restaurant-outline" },
    { id: "drinks", name: "Drinks", icon: "wine-outline" },
    { id: "coffee", name: "Coffee", icon: "cafe-outline" },
    { id: "tea", name: "Tea", icon: "thermometer-outline" },
  ]

  // Fetch dishes from API
  const fetchDishes = async () => {
    try {
      setError(null)
      const token = getAccessToken();

      if (!token) {
        setError("Authentication token not found. Please login again.")
        setLoading(false)
        return
      }

      const response = await fetch("http://127.0.0.1:8000/api/get-all-dish/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch dishes: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Transform API data to match our component structure
        const transformedDishes = data.dishes.map(dish => ({
          id: dish.id,
          title: dish.title,
          currentPrice: dish.current_price,
          originalPrice: dish.original_price,
          discount: dish.discount,
          image: dish.image.startsWith("http") ? dish.image : `http://127.0.0.1:8000${dish.image}`,
          isAvailable: dish.is_available,
          category: dish.category,
          isVeg: dish.is_veg,
        }))
        
        setDishes(transformedDishes)
        setFilteredDishes(transformedDishes)
      } else {
        throw new Error(data.error || "Failed to fetch dishes")
      }
    } catch (err) {
      console.error("Error fetching dishes:", err)
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Toggle dish availability
  const toggleAvailability = async (dishId, currentStatus) => {
    try {
      const token = getAccessToken();

      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please login again.")
        return
      }

      // Optimistically update UI
      const updatedDishes = dishes.map(dish => 
        dish.id === dishId ? { ...dish, isAvailable: !currentStatus } : dish
      )
      setDishes(updatedDishes)
      filterDishes(updatedDishes, selectedCategory, searchQuery)

      // Make API request to update availability
      const response = await fetch(`http://127.0.0.1:8000/api/update-dish/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: dishId,
          is_available: !currentStatus
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        // Revert changes if API call fails
        const revertedDishes = dishes.map(dish => 
          dish.id === dishId ? { ...dish, isAvailable: currentStatus } : dish
        )
        setDishes(revertedDishes)
        filterDishes(revertedDishes, selectedCategory, searchQuery)
        
        throw new Error(data.error || "Failed to update dish availability")
      }
    } catch (err) {
      console.error("Error toggling availability:", err)
      Alert.alert("Error", err.message || "Failed to update dish availability")
    }
  }

  // Delete dish
  const handleDeleteDish = (dishId, dishName) => {
    Alert.alert(
      "Delete Dish",
      `Are you sure you want to delete "${dishName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteDish(dishId)
        }
      ]
    )
  }

  const deleteDish = async (dishId) => {
    try {
      const token = getAccessToken();

      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please login again.")
        return
      }

      const response = await fetch(`http://127.0.0.1:8000/api/delete-dish/?id=${dishId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Remove dish from state
        const updatedDishes = dishes.filter(dish => dish.id !== dishId)
        setDishes(updatedDishes)
        filterDishes(updatedDishes, selectedCategory, searchQuery)
        Alert.alert("Success", "Dish deleted successfully")
      } else {
        throw new Error(data.error || "Failed to delete dish")
      }
    } catch (err) {
      console.error("Error deleting dish:", err)
      Alert.alert("Error", err.message || "Failed to delete dish")
    }
  }

  // Edit dish
  const handleEditDish = (dishId) => {
    navigation.navigate("EditDish", { dishId })
  }

  // Filter dishes based on category and search query
  const filterDishes = (dishesArray, category, query) => {
    let filtered = dishesArray

    // Filter by category
    if (category !== "all") {
      if (category === "veg") {
        filtered = filtered.filter(dish => dish.isVeg)
      } else if (category === "non-veg") {
        filtered = filtered.filter(dish => !dish.isVeg)
      } else {
        filtered = filtered.filter(dish => dish.category === category)
      }
    }

    // Filter by search query
    if (query) {
      const lowercaseQuery = query.toLowerCase()
      filtered = filtered.filter(dish => 
        dish.title.toLowerCase().includes(lowercaseQuery)
      )
    }

    setFilteredDishes(filtered)
  }

  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text)
    filterDishes(dishes, selectedCategory, text)
  }

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    filterDishes(dishes, category, searchQuery)
  }

  // Refresh data
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchDishes()
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchDishes()
  }, [])

  // Refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchDishes()
    }, [])
  )

  // Render category button
  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.selectedCategoryButton
      ]}
      onPress={() => handleCategorySelect(category.id)}
    >
      <Ionicons 
        name={category.icon} 
        size={16} 
        color={selectedCategory === category.id ? "#4CAF50" : "#333333"} 
      />
      <Text 
        style={[
          styles.categoryText, 
          selectedCategory === category.id && styles.selectedCategoryText
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  )

  // Render dish item
  const renderDishItem = ({ item }) => (
    <View style={styles.dishCard}>
      <View style={styles.dishImageContainer}>
        <Image source={{ uri: item.image }} style={styles.dishImage} />
        <View 
          style={[
            styles.vegBadge, 
            { backgroundColor: item.isVeg ? "#E8F5E9" : "#FFEBEE" }
          ]}
        >
          <Ionicons 
            name={item.isVeg ? "leaf" : "restaurant"} 
            size={12} 
            color={item.isVeg ? "#4CAF50" : "#F44336"} 
          />
        </View>
      </View>
      
      <View style={styles.dishInfo}>
        <Text style={styles.dishTitle} numberOfLines={1}>{item.title}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>
            Rs. {parseFloat(item.currentPrice).toFixed(2)}
          </Text>
          {item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.currentPrice) && (
            <Text style={styles.originalPrice}>
              Rs. {parseFloat(item.originalPrice).toFixed(2)}
            </Text>
          )}
        </View>
        
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.dishActions}>
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityLabel}>Available</Text>
          <Switch
            trackColor={{ false: "#CCCCCC", true: "#4CAF50" }}
            thumbColor={item.isAvailable ? "#FFFFFF" : "#F4F3F4"}
            ios_backgroundColor="#CCCCCC"
            onValueChange={() => toggleAvailability(item.id, item.isAvailable)}
            value={item.isAvailable}
          />
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditDish(item.id)}
          >
            <Ionicons name="create-outline" size={18} color="#2196F3" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteDish(item.id, item.title)}
          >
            <Ionicons name="trash-outline" size={18} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  // Loading state
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading menu items...</Text>
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchDishes}>
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
            <Text style={styles.headerTitle}>Manage Menu</Text>
            <Text style={styles.headerSubtitle}>{dishes.length} items in your menu</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("AddDish")}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
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
        placeholder="Search dishes..."
      />

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContainer}
        >
          {categories.map(renderCategoryButton)}
        </ScrollView>
      </View>

      {/* Dish List */}
      <FlatList
        data={filteredDishes}
        renderItem={renderDishItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={["#4CAF50"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={60} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No dishes found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory !== "all" 
                ? "Try changing your search or filter" 
                : "Add your first dish to get started"}
            </Text>
            {!searchQuery && selectedCategory === "all" && (
              <TouchableOpacity 
                style={styles.addDishButton}
                onPress={() => navigation.navigate("AddDish")}
              >
                <Text style={styles.addDishButtonText}>Add New Dish</Text>
              </TouchableOpacity>
            )}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    padding: 16,
    // backgroundColor: "#FFFFFF",
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
    borderWidth:1
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: "#333333",
  },
  categoriesContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  categoriesScrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    gap: 6,
  },
  selectedCategoryButton: {
    borderColor: "#4CAF50",
    backgroundColor: "#F1F8E9",
  },
  categoryText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#4CAF50",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  dishCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  dishImageContainer: {
    position: "relative",
    height: 150,
  },
  dishImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  vegBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  dishInfo: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  dishTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  originalPrice: {
    fontSize: 14,
    color: "#999999",
    textDecorationLine: "line-through",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: "#666666",
  },
  dishActions: {
    padding: 12,
  },
  availabilityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  availabilityLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: "#E3F2FD",
  },
  deleteButton: {
    backgroundColor: "#FFEBEE",
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
  addDishButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addDishButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ManageMenu
