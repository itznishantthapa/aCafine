import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FoodCard from './src/component/common/FoodCard'
import BigFoodCard from './src/component/common/BigFoodCard'
import FoodCarousel from './src/component/common/FoodCarousel'
import HomeScreen from './src/screen/HomeScreen'

const App = () => {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#f0f0f0'}}>

      <HomeScreen/>
    </View>
  )
}

export default App

