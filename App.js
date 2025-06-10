import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FoodCard from './src/component/common/FoodCard'
import BigFoodCard from './src/component/common/BigFoodCard'

const App = () => {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#f0f0f0'}}>

      <BigFoodCard />
    </View>
  )
}

export default App

