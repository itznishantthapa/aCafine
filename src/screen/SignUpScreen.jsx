"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
// import { GoogleSignin } from "@react-native-google-signin/google-signin"

const SignUpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const [loadingType, setLoadingType] = useState(null) // 'google' or 'guest'


  // useEffect(() => {
  //   GoogleSignin.configure({
  //     scopes: ['email'],
  //     webClientId: "739951398724-oi1i3298q8klvngcd36l6rroev2nm9mm.apps.googleusercontent.com",
  //   })
  // }, [])

  const handleGoogleSignUp = async () => {
    // setLoading(true)
    // setLoadingType("google")

    // try {
    //   await GoogleSignin.hasPlayServices()
    //     // Sign out first to clear any existing sessions
    //     await GoogleSignin.signOut()
    //     const userInfo = await GoogleSignin.signIn()
    //     if (!userInfo || !userInfo.data || !userInfo.data.scopes) {
    //       console.log('GoogleSignIn error', 'There was some issue with getting id token', userInfo)
    //       return
    //     }
  
    //     console.log(userInfo)
  
    // } catch (error) {
    //   // We might want to provide this error information to an error reporting service
    //   console.error('GoogleSignIn error', error)
    // }finally {
    //   setLoading(false)
    //   setLoadingType(null)
    // }
  }

  const handleGuestContinue = async () => {
    setLoading(true)
    setLoadingType("guest")

    try {
      // Simulate guest setup process
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to main app as guest
      navigation.replace("Tabs")
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.")
      console.error("Guest Continue Error:", error)
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="cafe" size={40} color="#4CAF50" />
          </View>
          <Text style={styles.appName}>aCafine</Text>
          <Text style={styles.appTagline}>Cafe</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to aCafine</Text>
          <Text style={styles.welcomeSubtitle}>
            Discover delicious food and beverages{"\n"}crafted with love, just for you
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {/* Continue with Google Button */}
          <TouchableOpacity
            style={[styles.primaryButton, loading && loadingType !== "google" && styles.disabledButton]}
            onPress={handleGoogleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading && loadingType === "google" ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Continue as Guest Button */}
          <TouchableOpacity
            style={[styles.secondaryButton, loading && loadingType !== "guest" && styles.disabledButton]}
            onPress={handleGuestContinue}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading && loadingType === "guest" ? (
              <ActivityIndicator size="small" color="#4CAF50" />
            ) : (
              <>
                <Ionicons name="person-outline" size={20} color="#4CAF50" />
                <Text style={styles.secondaryButtonText}>Continue as Guest</Text>
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

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ for food lovers</Text>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F1F8E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333333",
    letterSpacing: -1,
  },
  appTagline: {
    fontSize: 18,
    color: "#f37240",
    fontWeight: "600",
    marginTop: -5,
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
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4CAF50",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
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
  footer: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
})

export default SignUpScreen
