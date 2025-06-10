import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FoodCarousel from '../component/common/FoodCarousel';
import FoodCard from '../component/common/FoodCard';


const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' or 'grid'

  // Categories data
  const categories = [
    { id: 'all', name: 'All', icon: 'grid-outline' },
    { id: 'drinks', name: 'Drinks', icon: 'wine-outline' },
    { id: 'veg', name: 'Veg', icon: 'leaf-outline' },
    { id: 'non-veg', name: 'Non-Veg', icon: 'restaurant-outline' },
    { id: 'coffee', name: 'Coffee', icon: 'cafe-outline' },
    { id: 'tea', name: 'Tea', icon: 'thermometer-outline' },
  ];

  // Mock food data with categories
  const allFoodData = [
    {
      id: 1,
      title: 'Dora Cake',
      currentPrice: 80,
      originalPrice: 100,
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D',
      isVeg: true,
      category: 'veg',
    },
    {
      id: 2,
      title: 'Chocolate Brownie',
      currentPrice: 120,
      originalPrice: 150,
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnJvd25pZXxlbnwwfHwwfHx8MA%3D%3D',
      isVeg: true,
      category: 'veg',
    },
    {
      id: 3,
      title: 'Margherita Pizza',
      currentPrice: 250,
      originalPrice: 300,
      discount: '17% OFF',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D',
      isVeg: true,
      category: 'veg',
    },
    {
      id: 4,
      title: 'Chicken Burger',
      currentPrice: 180,
      originalPrice: 220,
      discount: '18% OFF',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww',
      isVeg: false,
      category: 'non-veg',
    },
    {
      id: 5,
      title: 'Iced Coffee',
      currentPrice: 90,
      originalPrice: 120,
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aWNlZCUyMGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D',
      isVeg: true,
      category: 'coffee',
    },
    {
      id: 6,
      title: 'Green Tea',
      currentPrice: 60,
      originalPrice: 80,
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JlZW4lMjB0ZWF8ZW58MHx8MHx8fDA%3D',
      isVeg: true,
      category: 'tea',
    },
    {
      id: 7,
      title: 'Fresh Orange Juice',
      currentPrice: 70,
      originalPrice: 90,
      discount: '22% OFF',
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlJTIwanVpY2V8ZW58MHx8MHx8fDA%3D',
      isVeg: true,
      category: 'drinks',
    },
    {
      id: 8,
      title: 'Mango Smoothie',
      currentPrice: 110,
      originalPrice: 140,
      discount: '21% OFF',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuZ28lMjBzbW9vdGhpZXxlbnwwfHwwfHx8MA%3D%3D',
      isVeg: true,
      category: 'drinks',
    },
  ];

  // Filter data based on selected category
  const filteredData = selectedCategory === 'all' 
    ? allFoodData 
    : allFoodData.filter(item => item.category === selectedCategory);

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.selectedCategoryButton
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons 
        name={category.icon} 
        size={16} 
        color={selectedCategory === category.id ? '#4CAF50' : '#333333'} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === category.id && styles.selectedCategoryText
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderGridItem = ({ item }) => (
    <View style={styles.gridItem}>
      <FoodCard data={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            onPress={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
          >
            <Ionicons 
              name={viewMode === 'carousel' ? 'grid-outline' : 'albums-outline'} 
              size={20} 
              color="#333333" 
            />
            <Text style={styles.toggleText}>
              {viewMode === 'carousel' ? 'Grid View' : 'Carousel View'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Food Display Section */}
        {viewMode === 'carousel' ? (
          <View style={styles.carouselContainer}>
            <FoodCarousel data={filteredData} />
          </View>
        ) : (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  greetingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  greetingContent: {
    alignItems: 'flex-start',
    maxWidth: '80%',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  cafeName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  userGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  greetingPrefix: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f37240',
  },
  subText: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
  },
  categoriesContainer: {
    paddingVertical: 20,
  },
  categoriesScrollContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    gap: 6,
  },
  selectedCategoryButton: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  categoryText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#4CAF50',
  },
  toggleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    gap: 8,
  },
  toggleText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  carouselContainer: {
    paddingVertical: 20,
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  flatListContainer: {
    gap: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  separator: {
    height: 16,
  },
});

export default HomeScreen;