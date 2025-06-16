"use client"

import { useEffect, useState, useContext } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { AppContext } from "../context/AppContext"

const SignUpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const { setIsAuthenticated } = useContext(AppContext)

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email', 'profile'],
      webClientId: "39274285306-glhrg3h26mgt4td189v2o0jaqlemmbub.apps.googleusercontent.com",
    })
  }, [])

  const handleGoogleSignUp = async () => {
    setLoading(true)

    try {
      await GoogleSignin.hasPlayServices()
      await GoogleSignin.signOut()
      const userInfo = await GoogleSignin.signIn()
      console.log('Google Sign In Response:', userInfo)
      
      if (!userInfo || !userInfo.data || !userInfo.data.scopes) {
        return
      }
      const response = await axios.post('http://192.168.1.75:8000/api/signup/', {
        email: userInfo.data.user.email,
        first_name: userInfo.data.user.givenName,
        last_name: userInfo.data.user.familyName
      })

      if (response.data.success) {
        await AsyncStorage.setItem('accessToken', response.data.tokens.access)
        await AsyncStorage.setItem('refreshToken', response.data.tokens.refresh)
        setIsAuthenticated(true)
      } else {
        Alert.alert("Error", "Failed to sign up. Please try again.")
      }
    } catch (error) {
      console.error("SignUp Error:", error)
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Image 
              style={styles.logoImage} 
              source={require("../assets/images/logocafe.png")} 
            />
          </View>
          <Text style={styles.appName}>Purwanchal</Text>
          <Text style={styles.appTagline}>Cafe & Restaurant</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Purwanchal</Text>
          <Text style={styles.welcomeSubtitle}>
            Discover delicious food and beverages{"\n"}crafted with love, just for you
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleGoogleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F1F8E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  logoImage: {
    height: '100%',
    width: '100%',
    borderRadius: 60,
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333333",
    letterSpacing: -2,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 20,
    color: "#f37240",
    fontWeight: "600",
    letterSpacing: 1,
  },
  content: {
    flex: 0.5,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 50,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 30,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.6,
  },
  termsContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#4CAF50",
    fontWeight: "600",
  },
 
})

export default SignUpScreen
