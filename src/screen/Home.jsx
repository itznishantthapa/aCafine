import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Home = ({navigation}) => {
  return (
    <View style={{justifyContent:'center',alignItems:'center',flex:1,backgroundColor:'red'}}> 
      <Text style={{padding:20,backgroundColor:'black',color:'#ffffff',borderRadius:5}}
      onPress={()=>navigation.navigate('Cart')}>Home</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})