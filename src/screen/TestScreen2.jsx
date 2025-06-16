import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const TestScreen2 = ({navigation}) => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'light-content'}
      />
      <View style={{backgroundColor:"purple", flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1,justifyContent:'center'}}>
          <Text style={{padding:20, backgroundColor:'red', borderRadius:40}} onPress={()=>navigation.navigate('TestScreen')}>TestScreen</Text>
          </View>
        </SafeAreaView>
      </View>
    </>
  )
}

export default TestScreen2

const styles = StyleSheet.create({})