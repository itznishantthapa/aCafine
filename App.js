import { StyleSheet } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import HomeScreen from "./src/screen/HomeScreen"
import CartScreen from "./src/screen/CartScreen"
import OrderScreen from "./src/screen/OrderScreen"
import PaymentScreen from "./src/screen/PaymentScreen"
import { Ionicons } from "@expo/vector-icons"
import { CartAnimationProvider } from "./src/context/CartAnimationContext"
import { CartProvider } from "./src/context/CartContext"
import CartBadge from "./src/component/common/CartBadge"
import { AppProvider } from "./src/context/AppContext"
import { useState, useEffect } from "react"
import Dashboard from "./src/screen/seller/Dashboard"
import AddDish from "./src/screen/seller/AddDish"
import ManageMenu from "./src/screen/seller/ManageMenu"
import AllOrder from "./src/screen/seller/AllOrder"
import SplashScreen from "./src/screen/SplashScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
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
          backgroundColor: "transparent",
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
  const [isSeller, setIsSeller] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Set isInitialized to true after 3 seconds
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 3000)

    // Cleanup timeout on unmount
    return () => clearTimeout(timer)
  }, [])

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#1c1835" }}>
      <CartProvider>
        <CartAnimationProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {!isInitialized ? (
                <Stack.Screen 
                  name="Splash" 
                  component={SplashScreen}
                  options={{ headerShown: false }}
                />
              ) : isSeller ? (
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
                  <Stack.Screen name="Tabs" component={CustomerTabNavigator} />
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
            </Stack.Navigator>
          </NavigationContainer>
        </CartAnimationProvider>
      </CartProvider>
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
