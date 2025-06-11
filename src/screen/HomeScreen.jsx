"use client"

import { useState, useContext } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import FoodCarousel from "../component/common/FoodCarousel"
import FoodCard from "../component/common/FoodCard"
import { AppContext } from "../context/AppContext"

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("carousel") // 'carousel' or 'grid'
  const { allDishState } = useContext(AppContext)
  const [refreshing, setRefreshing] = useState(false)

  // Categories data
  const categories = [
    { id: "all", name: "All", icon: "grid-outline" },
    { id: "drinks", name: "Drinks", icon: "wine-outline" },
    { id: "veg", name: "Veg", icon: "leaf-outline" },
    { id: "non-veg", name: "Non-Veg", icon: "restaurant-outline" },
    { id: "coffee", name: "Coffee", icon: "cafe-outline" },
    { id: "tea", name: "Tea", icon: "thermometer-outline" },
  ]

  // Transform API data to match the existing component structure
  const transformDishData = (dish) => ({
    id: dish.id,
    title: dish.title,
    currentPrice: Number.parseFloat(dish.current_price),
    originalPrice: dish.original_price ? Number.parseFloat(dish.original_price) : null,
    discount: dish.discount > 0 ? `${dish.discount}% OFF` : null,
    image: dish.image.startsWith("http") ? dish.image : `http://127.0.0.1:8000${dish.image}`,
    isVeg: dish.is_veg,
    category: dish.category,
    is_available: dish.is_available,
  })

  // Transform all dishes data
  const allFoodData = allDishState.allDishes.map(transformDishData)

  // Map API categories to UI categories
  const mapCategory = (apiCategory) => {
    const categoryMap = {
      veg: "veg",
      "non-veg": "non-veg",
      drinks: "drinks",
      coffee: "coffee",
      tea: "tea",
    }
    return categoryMap[apiCategory] || "drinks" // default to drinks for unmapped categories
  }

  // Filter data based on selected category
  const filteredData =
    selectedCategory === "all"
      ? allFoodData
      : allFoodData.filter((item) => {
          if (selectedCategory === "veg") {
            return item.isVeg === true
          } else if (selectedCategory === "non-veg") {
            return item.isVeg === false
          } else {
            return mapCategory(item.category) === selectedCategory
          }
        })

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryButton, selectedCategory === category.id && styles.selectedCategoryButton]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons name={category.icon} size={16} color={selectedCategory === category.id ? "#4CAF50" : "#333333"} />
      <Text style={[styles.categoryText, selectedCategory === category.id && styles.selectedCategoryText]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  )

  const renderGridItem = ({ item }) => (
    <View style={styles.gridItem}>
      <FoodCard data={item} />
    </View>
  )

  // Loading state
  if (allDishState.allDishes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading delicious dishes...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Error state
  if (allDishState.error && allDishState.allDishes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF4444" />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{allDishState.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={allDishState.refreshDishes}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {viewMode === "carousel" ? (
        <View style={styles.carouselViewContainer}>
          {/* Greeting Section */}
          <View style={styles.greetingContainer}>
            <View style={styles.greetingContent}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.cafeName}>aCafine Cafe</Text>
              <View style={styles.userGreeting}>
                <Text style={styles.greetingPrefix}>Hello,</Text>
                <Text style={styles.userName}>Nishant</Text>
              </View>
              <Text style={styles.subText}>Tell us what would you like to have!</Text>
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScrollContainer}
            >
              {categories.map(renderCategoryButton)}
            </ScrollView>
          </View>

          {/* View Toggle Button */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setViewMode(viewMode === "carousel" ? "grid" : "carousel")}
            >
              <Ionicons name={viewMode === "carousel" ? "grid-outline" : "albums-outline"} size={20} color="#333333" />
              <Text style={styles.toggleText}>{viewMode === "carousel" ? "Grid View" : "Carousel View"}</Text>
            </TouchableOpacity>
          </View>

          {/* Food Display Section */}
          <View style={styles.carouselContainer}>
            <FoodCarousel data={filteredData} />
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={allDishState.refreshDishes} colors={["#4CAF50"]} tintColor="#4CAF50" />
          }
        >
          {/* Greeting Section */}
          <View style={styles.greetingContainer}>
            <View style={styles.greetingContent}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.cafeName}>aCafine Cafe</Text>
              <View style={styles.userGreeting}>
                <Text style={styles.greetingPrefix}>Hello,</Text>
                <Text style={styles.userName}>Nishant</Text>
              </View>
              <Text style={styles.subText}>Tell us what would you like to have!</Text>
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScrollContainer}
            >
              {categories.map(renderCategoryButton)}
            </ScrollView>
          </View>

          {/* View Toggle Button */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setViewMode(viewMode === "carousel" ? "grid" : "carousel")}
            >
              <Ionicons name={viewMode === "carousel" ? "grid-outline" : "albums-outline"} size={20} color="#333333" />
              <Text style={styles.toggleText}>{viewMode === "carousel" ? "Grid View" : "Carousel View"}</Text>
            </TouchableOpacity>
          </View>

          {/* Food Display Section */}
          <View style={styles.gridContainer}>
            <FlatList
              data={filteredData}
              renderItem={renderGridItem}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContainer}
              columnWrapperStyle={styles.row}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  carouselViewContainer: {
    flex: 1,
    height: screenHeight,
  },
  greetingContainer: {
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.02, // Reduced from 0.04
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  greetingContent: {
    alignItems: "flex-start",
    maxWidth: screenWidth * 0.8,
  },
  welcomeText: {
    fontSize: screenWidth * 0.045, // Reduced from 0.05
    fontWeight: "600",
    color: "#666666",
    marginBottom: 2, // Reduced from 4
  },
  cafeName: {
    fontSize: screenWidth * 0.07, // Reduced from 0.08
    fontWeight: "bold",
    color: "#333333",
    marginBottom: screenHeight * 0.01, // Reduced from 0.02
  },
  userGreeting: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: screenHeight * 0.01, // Reduced from 0.015
    gap: 6, // Reduced from 8
  },
  greetingPrefix: {
    fontSize: screenWidth * 0.04, // Reduced from 0.045
    fontWeight: "500",
    color: "#666666",
  },
  userName: {
    fontSize: screenWidth * 0.055, // Reduced from 0.06
    fontWeight: "bold",
    color: "#f37240",
  },
  subText: {
    fontSize: screenWidth * 0.035, // Reduced from 0.0375
    color: "#666666",
    lineHeight: screenHeight * 0.022, // Reduced from 0.027
  },
  categoriesContainer: {
    paddingVertical: screenHeight * 0.015, // Reduced from 0.025
  },
  categoriesScrollContainer: {
    paddingHorizontal: screenWidth * 0.05,
    gap: 10, // Reduced from 12
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: screenWidth * 0.035, // Reduced from 0.04
    paddingVertical: screenHeight * 0.01, // Reduced from 0.012
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    gap: 5, // Reduced from 6
  },
  selectedCategoryButton: {
    borderColor: "#4CAF50",
    backgroundColor: "#F1F8E9",
  },
  categoryText: {
    fontSize: screenWidth * 0.032, // Reduced from 0.035
    color: "#333333",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#4CAF50",
  },
  toggleContainer: {
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.01, // Reduced from 0.012
    alignItems: "center",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: screenWidth * 0.045, // Reduced from 0.05
    paddingVertical: screenHeight * 0.012, // Reduced from 0.015
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    gap: 6, // Reduced from 8
  },
  toggleText: {
    fontSize: screenWidth * 0.032, // Reduced from 0.035
    color: "#333333",
    fontWeight: "500",
  },
  carouselContainer: {
    flex: 1,
    paddingVertical: screenHeight * 0.015, // Reduced from 0.025
  },
  gridContainer: {
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.025,
  },
  flatListContainer: {
    gap: screenHeight * 0.02,
  },
  row: {
    justifyContent: "space-between",
  },
  gridItem: {
    flex: 1,
    marginHorizontal: screenWidth * 0.01,
  },
  separator: {
    height: screenHeight * 0.02,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: screenWidth * 0.1,
  },
  loadingText: {
    fontSize: screenWidth * 0.04,
    color: "#666666",
    marginTop: screenHeight * 0.02,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 25,
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
})

export default HomeScreen