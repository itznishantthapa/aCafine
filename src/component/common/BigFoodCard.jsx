import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const BigFoodCard = ({ data }) => {
  // Use default values if no data is provided (for backward compatibility)
  const {
    title = 'Dora Cake',
    currentPrice = 80,
    originalPrice = 100,
    discount = '20% OFF',
    image = 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D',
    isVeg = true,
  } = data || {};

  return (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
        <View style={styles.vegIndicator}>
                  <Ionicons name={isVeg ? "leaf" : "restaurant"} size={18} color={isVeg ? "#4CAF50" : "#FF6B6B"} />
                </View>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity style={styles.addButton} onPress={() => undefined}>
            <AntDesign name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.price}>Rs.<Text style={styles.priceText}>{currentPrice}</Text></Text>
                <Text style={styles.originalPrice}>Rs.<Text style={styles.originalPriceText}>{originalPrice}</Text></Text>
                <View style={styles.discountBadge}>
                    <AntDesign name="tags" size={12} color="#FFFFFF" />
                    <Text style={styles.discountText}>{discount}</Text>
                </View>
            </View>
        </View>

    </View>
  )
}

export default BigFoodCard

const styles = StyleSheet.create({
container:{
    justifyContent:'center',
    alignItems:'center'
},
    imageContainer:{
        width: 390,
        height: 300,
        position: 'relative',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    image:{
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    addButton: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: "#4CAF50",
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoContainer:{
      alignItems:'center',
      justifyContent:'center',
      width: 300,
      gap:8,
    },
    title: {
        fontSize: 24,
        color: "#333333",
        fontWeight: 'bold',
        textAlign: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    price: {
        fontSize: 14,
        color: "#4CAF50",
        fontWeight: 'bold',
    },
    priceText: {
        fontSize: 20,
        color: "#4CAF50",
        fontWeight: 'bold',
    },
    originalPrice: {
        fontSize: 12,
        color: "#f37240",
        fontWeight: 'normal',
        textDecorationLine: 'line-through',
    },
    originalPriceText: {
        fontSize: 16,
        color: "#f37240",
        fontWeight: 'normal',
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f37240',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        gap: 3,
    },
    discountText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    vegIndicator: {
        position:'absolute',
        top:10,
        left:10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: "#E8F5E9",
        zIndex: 1000,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    }
})