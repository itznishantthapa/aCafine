import {  StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const TestScreen = ({navigation}) => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />
      <View style={{backgroundColor:"yellow", flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{padding:20, backgroundColor:'red', borderRadius:40}} onPress={()=>navigation.navigate('TestScreen2')}>TestScreen</Text>
          </View>
        </SafeAreaView>
      </View>
    </>
  )
}

export default TestScreen

const styles = StyleSheet.create({}) 