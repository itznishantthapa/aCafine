import { View, Text, StyleSheet, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Header = () => {
  return (
    <>
      <View style={styles.greetingContainer}>
        <View style={styles.greetingContent}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.cafeName}>Purwanchal Cafe</Text>
          <View style={styles.userGreeting}>
            <Text style={styles.greetingPrefix}>Hello,</Text>
            <Text style={styles.userName}>Nishant</Text>
          </View>
          <Text style={styles.subText}>Tell us what would you like to have!</Text>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  greetingContainer: {
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.02,
    backgroundColor: "#FFFFFF",
  },
  greetingContent: {
    alignItems: "flex-start",
    maxWidth: screenWidth * 0.8,
  },
  welcomeText: {
    fontSize: screenWidth * 0.045,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 2,
  },
  cafeName: {
    fontSize: screenWidth * 0.07,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: screenHeight * 0.01,
  },
  userGreeting: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: screenHeight * 0.01,
    gap: 6,
  },
  greetingPrefix: {
    fontSize: screenWidth * 0.04,
    fontWeight: "500",
    color: "#666666",
  },
  userName: {
    fontSize: screenWidth * 0.055,
    fontWeight: "bold",
    color: "#f37240",
  },
  subText: {
    fontSize: screenWidth * 0.035,
    color: "#666666",
    lineHeight: screenHeight * 0.022,
  },
})

export default Header 