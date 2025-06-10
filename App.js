import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import HomeScreen from './src/screen/HomeScreen'
import CartScreen from './src/screen/CartScreen'
import OrderScreen from './src/screen/OrderScreen'
import Home from './src/screen/Home'
import { Ionicons } from '@expo/vector-icons'


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Menu') {
            iconName = focused ? 'book' : 'book-outline'
          } else if (route.name === 'Cart') {
            iconName = focused ? 'basket' : 'basket-outline'
          } else if (route.name === 'Order') {
            iconName = focused ? 'timer' : 'timer-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 70,
          backgroundColor: 'transparent', 
        },
        headerShown: false,
        
      })}
    >
      <Tab.Screen name="Menu" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
    </Tab.Navigator>
  )
}


const AppContent = () => {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#1c1835' }}>
      <NavigationContainer  >
        <Stack.Navigator screenOptions={{ headerShown: false }}>


          <Stack.Screen name="Tabs" component={TabNavigator} />


        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}



const App = () => {
  return (
    <AppContent />
  )
}

export default App

const styles = StyleSheet.create({})