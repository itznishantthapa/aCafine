"use client"

import { StyleSheet, View, Animated, Image, StatusBar } from "react-native"
import { useEffect, useRef } from "react"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

const SplashScreen = () => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current
  const logoOpacity = useRef(new Animated.Value(0)).current
  const textOpacity = useRef(new Animated.Value(0)).current
  const textTranslateY = useRef(new Animated.Value(30)).current
  const taglineOpacity = useRef(new Animated.Value(0)).current
  const backgroundOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Start the animation sequence
    const animationSequence = Animated.sequence([
      // Background fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      // Logo animation
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),

      // Text animation
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // Tagline animation
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ])

    // Start the animation sequence
    animationSequence.start()
  }, [])

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <SafeAreaView style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
          {/* Animated Background */}
          <Animated.View style={[styles.backgroundGradient, { opacity: backgroundOpacity }]} />

          {/* Logo Container */}
          <View style={styles.logoContainer}>
            {/* Animated Logo Icon */}
            <Animated.View
              style={[
                styles.logoIcon,
                {
                  transform: [{ scale: logoScale }],
                  opacity: logoOpacity,
                },
              ]}
            >
              {/* <Ionicons name="cafe" size={60} color="#4CAF50" /> */}
              <Image style={{height:'100%',width:"100%"}} source={require("../assets/images/logocafe.png")} />
            </Animated.View>

            {/* Animated App Name */}
            <Animated.Text
              style={[
                styles.appName,
                {
                  opacity: textOpacity,
                  transform: [{ translateY: textTranslateY }],
                },
              ]}
            >
              Purwanchal
            </Animated.Text>

            {/* Animated Tagline */}
            <Animated.Text
              style={[
                styles.tagline,
                {
                  opacity: taglineOpacity,
                },
              ]}
            >
              Cafe & Restaurant
            </Animated.Text>
          </View>

          {/* Loading Indicator */}
          <Animated.View style={[styles.loadingContainer, { opacity: taglineOpacity }]}>
            <View style={styles.loadingDots}>
              <LoadingDot delay={0} />
              <LoadingDot delay={200} />
              <LoadingDot delay={400} />
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    </>
  )
}

// Loading dot component with individual animation
const LoadingDot = ({ delay }) => {
  const dotOpacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animateDot = () => {
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => animateDot())
    }

    const timer = setTimeout(animateDot, delay)
    return () => clearTimeout(timer)
  }, [delay])

  return <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
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
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333333",
    letterSpacing: -2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 20,
    color: "#f37240",
    fontWeight: "600",
    letterSpacing: 1,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
    alignItems: "center",
  },
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
})

export default SplashScreen
