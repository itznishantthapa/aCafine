import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const TestScreen2 = () => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'light-content'}
      />
      <View style={{backgroundColor:"purple", flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1}}>
            <Text>TestScreen2</Text>
          </View>
        </SafeAreaView>
      </View>
    </>
  )
}

export default TestScreen2

const styles = StyleSheet.create({})