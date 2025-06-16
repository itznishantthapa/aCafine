import { StyleSheet } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import HomeScreen from "./src/screen/HomeScreen"
import CartScreen from "./src/screen/CartScreen"
import OrderScreen from "./src/screen/OrderScreen"
import PaymentScreen from "./src/screen/PaymentScreen"
import { Ionicons } from "@expo/vector-icons"
import { CartAnimationProvider } from "./src/context/CartAnimationContext"
import { CartProvider } from "./src/context/CartContext"
import CartBadge from "./src/component/common/CartBadge"
import { AppProvider, AppContext } from "./src/context/AppContext"
import { useState, useEffect, useContext } from "react"
import Dashboard from "./src/screen/seller/Dashboard"
import AddDish from "./src/screen/seller/AddDish"
import ManageMenu from "./src/screen/seller/ManageMenu"
import AllOrder from "./src/screen/seller/AllOrder"
import SplashScreen from "./src/screen/SplashScreen"
import SignUpScreen from "./src/screen/SignUpScreen"
import AsyncStorage from '@react-native-async-storage/async-storage'
import TestScreen from "./src/screen/TestScreen"
import TestScreen2 from "./src/screen/TestScreen2"



const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Menu"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Menu") {
            iconName = focused ? "book" : "book-outline"
          } else if (route.name === "My Picks") {
            iconName = focused ? "basket" : "basket-outline"
            return (
              <CartBadge>
                <Ionicons name={iconName} size={size} color={color} />
              </CartBadge>
            )
          } else if (route.name === "Order") {
            iconName = focused ? "timer" : "timer-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 70,
          backgroundColor: "#ffffff",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Menu" component={HomeScreen} />
      <Tab.Screen name="My Picks" component={CartScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
    </Tab.Navigator>
  )
}

const AppContent = () => {
  const [isSeller, setIsSeller] = useState(false)
  const { isAuthenticated, setIsAuthenticated, isInitialized, setIsInitialized } = useContext(AppContext)

  const clearAuthTokens = async () => {
    try {
      await AsyncStorage.removeItem('accessToken')
      await AsyncStorage.removeItem('refreshToken')
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Error clearing tokens:', error)
    }
  }

  useEffect(() => {
    const initialize = async () => {
      // await clearAuthTokens();
      try {
        // Simulate splash screen delay
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Check for authentication token
        const token = await AsyncStorage.getItem('accessToken')
        setIsAuthenticated(!!token)
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initialize()
  }, [setIsAuthenticated, setIsInitialized])

  return (
    <SafeAreaProvider style={{flex:1,backgroundColor:'white'}}>
      <SafeAreaView style={{ flex: 1}} edges={['right', 'bottom', 'left']}>
        <CartProvider>
          <CartAnimationProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false, animation:'fade' }} >
                {!isInitialized ? (
                  <Stack.Screen 
                    name="SplashScreen" 
                    component={SplashScreen}
                  />
                ) : !isAuthenticated ? (
                  <Stack.Screen 
                    name="SignUpScreen" 
                    component={SignUpScreen}
                  />
                ) : (
                  <>
                    {isSeller ? (
                      // Seller Screens
                      <>
                        <Stack.Screen name="Dashboard" component={Dashboard} />
                        <Stack.Screen name="AddDish" component={AddDish} />
                        <Stack.Screen name="ManageMenu" component={ManageMenu} />
                        <Stack.Screen name="AllOrder" component={AllOrder} />
                      </>
                    ) : (
                      // Customer Screens
                      <>
                        <Stack.Screen name="CustomerTabs" component={CustomerTabNavigator} />
                        <Stack.Screen name="TestScreen" component={TestScreen} />
                        <Stack.Screen name="TestScreen2" component={TestScreen2} />
                        <Stack.Screen
                          name="Payment"
                          component={PaymentScreen}
                          options={{
                            headerShown: true,
                            title: "eSewa Payment",
                            headerStyle: { backgroundColor: "#4CAF50" },
                            headerTintColor: "#FFFFFF",
                            headerTitleStyle: { fontWeight: "bold" },
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </CartAnimationProvider>
        </CartProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App

const styles = StyleSheet.create({})
