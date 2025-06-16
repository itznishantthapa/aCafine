"use client"

import { useCallback, useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import getAccessToken from "../../service/apis/getToken"
import { getApiUrl, API_ENDPOINTS } from "../../service/config"
import { useFocusEffect } from "@react-navigation/native"

const CATEGORIES = [
  { id: "veg", name: "Vegetarian" },
  { id: "non-veg", name: "Non-Vegetarian" },
  { id: "drinks", name: "Drinks" },
  { id: "coffee", name: "Coffee" },
  { id: "tea", name: "Tea" },
  { id: "dessert", name: "Dessert" },
]

const AddDish = ({ navigation }) => {

  useFocusEffect(
    useCallback(() => {
      // When screen is focused
      StatusBar.setBackgroundColor('red');
      StatusBar.setBarStyle('light-content');
  
      return () => {
        // When screen is unfocused (backed or navigated away)
        StatusBar.setBackgroundColor('black'); // or default color
        StatusBar.setBarStyle('light-content');
      };
    }, [])
  );
  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [currentPrice, setCurrentPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [discount, setDiscount] = useState("0")
  const [category, setCategory] = useState("drinks")
  const [isVeg, setIsVeg] = useState(true)
  const [isAvailable, setIsAvailable] = useState(true)
  const [image, setImage] = useState(null)

  // UI state
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Handle image picking
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need camera roll permission to upload images.")
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0])
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image. Please try again.")
    }
  }

  // Calculate discount when original price or current price changes
  const calculateDiscount = () => {
    if (originalPrice && currentPrice && Number(originalPrice) > Number(currentPrice)) {
      const discountValue = ((Number(originalPrice) - Number(currentPrice)) / Number(originalPrice)) * 100
      setDiscount(Math.round(discountValue).toString())
    } else {
      setDiscount("0")
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = "Dish name is required"
    }

    if (!currentPrice.trim()) {
      newErrors.currentPrice = "Current price is required"
    } else if (isNaN(Number(currentPrice)) || Number(currentPrice) <= 0) {
      newErrors.currentPrice = "Please enter a valid price"
    }

    if (originalPrice.trim() && (isNaN(Number(originalPrice)) || Number(originalPrice) <= 0)) {
      newErrors.originalPrice = "Please enter a valid original price"
    }

    if (originalPrice && Number(originalPrice) <= Number(currentPrice)) {
      newErrors.originalPrice = "Original price should be higher than current price"
    }

    if (!image) {
      newErrors.image = "Please upload an image"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const token = getAccessToken();

      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please login again.")
        setLoading(false)
        return
      }

      // Create form data for multipart/form-data request (for image upload)
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("current_price", currentPrice)

      if (originalPrice) {
        formData.append("original_price", originalPrice)
      }

      formData.append("discount", discount)
      formData.append("category", category)
      formData.append("is_veg", isVeg ? "true" : "false")
      formData.append("is_available", isAvailable ? "true" : "false")

      // Append image if selected
      if (image) {
        // Get file extension from URI
        const uriParts = image.uri.split(".")
        const fileType = uriParts[uriParts.length - 1]

        formData.append("image", {
          uri: image.uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        })
      }

      // Make API request
      const response = await fetch(getApiUrl(API_ENDPOINTS.CREATE_DISH), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        navigation.goBack();
      } else {
        throw new Error(data.error || "Failed to add dish")
      }
    } catch (error) {
      console.error("Error adding dish:", error)
      Alert.alert("Error", error.message || "Failed to add dish. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Dish</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="close" />
        <View style={{ borderWidth: 0.5, borderColor: 'black', width: '85%', height: 0 }} />
        <Ionicons name="close" />
      </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Image Upload Section */}
          <View style={styles.imageSection}>
            <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="image-outline" size={40} color="#AAAAAA" />
                  <Text style={styles.uploadText}>Tap to upload image</Text>
                </View>
              )}
            </TouchableOpacity>
            {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* Dish Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dish Name*</Text>
              <TextInput
                style={[styles.textInput, errors.title && styles.inputError]}
                placeholder="Enter dish name"
                value={title}
                onChangeText={setTitle}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Enter dish description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Pricing */}
            <View style={styles.priceContainer}>
              {/* Current Price */}
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Current Price*</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>Rs.</Text>
                  <TextInput
                    style={[styles.textInput, styles.priceInput, errors.currentPrice && styles.inputError]}
                    placeholder="0.00"
                    value={currentPrice}
                    onChangeText={(text) => {
                      setCurrentPrice(text)
                      if (originalPrice) {
                        calculateDiscount()
                      }
                    }}
                    keyboardType="numeric"
                  />
                </View>
                {errors.currentPrice && <Text style={styles.errorText}>{errors.currentPrice}</Text>}
              </View>

              {/* Original Price */}
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Original Price</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>Rs.</Text>
                  <TextInput
                    style={[styles.textInput, styles.priceInput, errors.originalPrice && styles.inputError]}
                    placeholder="0.00"
                    value={originalPrice}
                    onChangeText={(text) => {
                      setOriginalPrice(text)
                      if (text && currentPrice) {
                        calculateDiscount()
                      }
                    }}
                    keyboardType="numeric"
                  />
                </View>
                {errors.originalPrice && <Text style={styles.errorText}>{errors.originalPrice}</Text>}
              </View>
            </View>

            {/* Discount */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Discount (%)</Text>
              <TextInput
                style={[styles.textInput]}
                placeholder="0"
                value={discount}
                onChangeText={setDiscount}
                keyboardType="numeric"
                editable={false}
              />
              <Text style={styles.helperText}>
                Discount is calculated automatically based on original and current price
              </Text>
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryChip, category === cat.id && styles.categoryChipSelected]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Text style={[styles.categoryChipText, category === cat.id && styles.categoryChipTextSelected]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Toggle Switches */}
            <View style={styles.togglesContainer}>
              {/* Vegetarian Toggle */}
              <View style={styles.toggleGroup}>
                <View>
                  <Text style={styles.toggleLabel}>Vegetarian</Text>
                  <Text style={styles.toggleSubLabel}>Is this dish vegetarian?</Text>
                </View>
                <Switch
                  trackColor={{ false: "#CCCCCC", true: "#4CAF50" }}
                  thumbColor={isVeg ? "#FFFFFF" : "#F4F3F4"}
                  ios_backgroundColor="#CCCCCC"
                  onValueChange={setIsVeg}
                  value={isVeg}
                />
              </View>

              {/* Availability Toggle */}
              <View style={styles.toggleGroup}>
                <View>
                  <Text style={styles.toggleLabel}>Availability</Text>
                  <Text style={styles.toggleSubLabel}>Is this dish available now?</Text>
                </View>
                <Switch
                  trackColor={{ false: "#CCCCCC", true: "#4CAF50" }}
                  thumbColor={isAvailable ? "#FFFFFF" : "#F4F3F4"}
                  ios_backgroundColor="#CCCCCC"
                  onValueChange={setIsAvailable}
                  value={isAvailable}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Add Dish</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    padding: 16,
    alignItems: "center",
  },
  imageUpload: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666666",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  formSection: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333333",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  currencySymbol: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#666666",
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    paddingLeft: 0,
  },
  inputError: {
    borderColor: "#F44336",
  },
  errorText: {
    color: "#F44336",
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: "#666666",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  categoryChipSelected: {
    backgroundColor: "#E8F5E9",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#666666",
  },
  categoryChipTextSelected: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  togglesContainer: {
    marginTop: 8,
  },
  toggleGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  toggleSubLabel: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#A5D6A7",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default AddDish
