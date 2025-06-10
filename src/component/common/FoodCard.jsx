import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'

const mockedFoodItems = [
    {
      food_name: "Veggie Burger",
      is_vegetarian: true,
      food_restaurant: "Green Bites",
      is_available: true,
      food_price: 150,
    },
    {
      food_name: "Chicken Mo:Mo",
      is_vegetarian: false,
      food_restaurant: "Nepali Kitchen",
      is_available: false,
      food_price: 120,
    },

  ]
  

const FoodCard = ({ item=mockedFoodItems[0] }) => {
  
    return (
        <TouchableOpacity style={styles.card} onPress={undefined} activeOpacity={0.8}>
          <Image source={{ uri: "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D" }} style={styles.image} resizeMode="cover" />
          <View style={styles.infoContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {item.food_name}
              </Text>
              {item.is_vegetarian && (
                <View style={styles.vegIndicator}>
                  <Ionicons name="leaf" size={12} color="#4CAF50" />
                </View>
              )}
            </View>
    
            <Text style={styles.restaurant} numberOfLines={1}>
              {item.food_restaurant || "Restaurant"}
            </Text>
            <View style={styles.detailsContainer}>
            <Text style={styles.price}>Rs. {item.food_price}</Text>
              <View style={[styles.availabilityContainer, { backgroundColor: item.is_available ? '#E8F5E9' : '#FFEBEE' }]}>
                <Ionicons 
                  name={item.is_available ? "checkmark-circle" : "close-circle"} 
                  size={14} 
                  color={item.is_available ? "#4CAF50" : "#F44336"} 
                />
                <Text style={[styles.availability, { color: item.is_available ? "#4CAF50" : "#F44336" }]}>
                  {item.is_available ? "Available" : "Unavailable"}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => undefined}>
            <AntDesign name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      )
    
}

export default FoodCard

const styles = StyleSheet.create({
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: (12),
      marginBottom: (16),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      flexDirection: "row",
      overflow: "hidden",
      width: "48%",
    },
    image: {
      width: (100),
      height: (120),
    },
    infoContainer: {
      flex: 1,
      padding: (8),
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: (4),
    },
    title: {
      fontFamily: "poppins_semibold",
      fontSize: (16),
      color: "#333333",
      flex: 1,
    },
    vegIndicator: {
      marginLeft: (8),
      padding: (2),
      borderRadius: (4),
      backgroundColor: "#E8F5E9",
    },
    restaurant: {
      fontFamily: "poppins_regular",
      fontSize: (12),
      color: "#757575",
      marginBottom: (4),
    },
    detailsContainer: {
      alignItems: "flex-start",
      justifyContent: "flex-start",
      gap: (3),
    },
    price: {
      fontFamily: "poppins_semibold",
      fontSize: (14),
      color: "#4CAF50",
    },
    addButton: {
      position: "absolute",
      bottom: (2),
      right: (2),
      backgroundColor: "#4CAF50",
      borderRadius: (20),
      width: (32),
      height: (32),
      justifyContent: "center",
      alignItems: "center",
    },
    availabilityContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: (6),
      paddingVertical: (2),
      borderRadius: (4),
    },
    availability: {
      fontFamily: "poppins_semibold",
      fontSize: (12),
      marginLeft: (4),
    },
  })