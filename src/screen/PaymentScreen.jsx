"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from "react-native"
import { WebView } from "react-native-webview"
import { createEsewaPaymentForm, generateTransactionUuid, PRODUCT_CODE, verifySignature } from "../utils/eSewaUtils"
import createOrder from "../service/apis/createOrder"
// import apiService from "../service/apis/login"

const PaymentScreen = ({ route, navigation }) => {
  const { orderData, totalAmount } = route.params
  const [loading, setLoading] = useState(true)
  const [paymentHtml, setPaymentHtml] = useState("")
  const [transactionUuid, setTransactionUuid] = useState("")
  const [paymentAttempts, setPaymentAttempts] = useState(0)

  useEffect(() => {
    initializePayment()
  }, [])

  const initializePayment = () => {
    try {
      // Generate a unique transaction ID with timestamp and random suffix
      const timestamp = new Date().getTime()
      const randomSuffix = Math.floor(Math.random() * 1000)
      const uuid = `${timestamp}-${randomSuffix}`
      setTransactionUuid(uuid)

      // Create the payment form HTML with zero tax
      const paymentDetails = {
        amount: totalAmount.toString(),
        taxAmount: "0", // Set tax to zero since prices include tax
        totalAmount: totalAmount.toString(),
        transactionUuid: uuid,
        productServiceCharge: "0",
        productDeliveryCharge: "0",
        successUrl: "https://developer.esewa.com.np/success",
        failureUrl: "https://developer.esewa.com.np/failure",
      }

      const html = createEsewaPaymentForm(paymentDetails)
      setPaymentHtml(html)
      setLoading(false)
    } catch (error) {
      console.error("Error initializing payment:", error)
      Alert.alert(
        "Payment Error",
        "Failed to initialize payment. Please try again.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      )
    }
  }

  const handleNavigationStateChange = (navState) => {
    const { url } = navState
    console.log("Navigation state changed:", url)

    if (url.includes("developer.esewa.com.np/success")) {
      // Extract the response data from the URL
      const responseData = extractResponseData(url)
      console.log("Success response data:", responseData)

      // Process successful payment
      handlePaymentSuccess(responseData)
    } else if (url.includes("developer.esewa.com.np/failure")) {
      console.log("Payment failed")
      handlePaymentFailure()
    }
  }

  const extractResponseData = (url) => {
    try {
      const urlObj = new URL(url)
      const base64Data = urlObj.searchParams.get("data")

      if (base64Data) {
        const jsonString = atob(base64Data)
        return JSON.parse(jsonString)
      }
    } catch (error) {
      console.error("Error extracting response data:", error)
    }

    // Return a default response if extraction fails
    return {
      status: "COMPLETE",
      transaction_uuid: transactionUuid,
      product_code: PRODUCT_CODE,
      total_amount: totalAmount.toString(),
    }
  }

  const handlePaymentSuccess = async (responseData) => {
    try {
      setLoading(true)

      // Verify signature if available
      let isSignatureValid = false
      if (responseData && responseData.signature) {
        try {
          isSignatureValid = verifySignature(responseData)
          console.log("Signature verification result:", isSignatureValid)
        } catch (error) {
          console.error("Error verifying signature:", error)
        }
      }

      // Create order with transaction ID
      const orderPayload = {
        ...orderData,
        esewa_transaction_id: transactionUuid,
      }

      console.log("Creating order with payload:", orderPayload)

      const response = await createOrder(orderPayload)

      if (response.message === "Order placed successfully") {
        // Clear cart and navigate to menu
        navigation.reset({
          index: 0,
          routes: [
            { 
              name: "CustomerTabs",
              state: {
                routes: [{ name: "Order" }]
              }
            }
          ],
        })
      } else {
        throw new Error(response.error_message || "Failed to create order")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      
      // Check if it's a duplicate transaction error
      if (error.message?.includes("Duplicate transaction UUID")) {
        // Generate new transaction UUID and retry
        if (paymentAttempts < 3) {
          setPaymentAttempts(prev => prev + 1)
          initializePayment()
          return
        }
      }

      Alert.alert(
        "Order Creation Failed",
        "Payment was successful but we couldn't create your order. Please contact support.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      )
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentFailure = () => {
    Alert.alert("Payment Failed", "Your payment could not be processed. Please try again.", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ])
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>
          {paymentHtml ? "Processing payment..." : "Preparing payment..."}
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ html: paymentHtml }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        renderLoading={() => (
          <View style={styles.webviewLoading}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading eSewa payment...</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  webviewLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333333",
  },
})

export default PaymentScreen
