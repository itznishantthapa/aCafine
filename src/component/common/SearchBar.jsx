import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = "Search...",
  containerStyle,
  inputStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.searchBar}>
        <View style={styles.searchIconContainer}>
          <Ionicons name="search" size={20} color="#666666" />
        </View>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          value={value}
          onChangeText={onChangeText}
        />
        {value ? (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => onChangeText("")}
          >
            <Ionicons name="close-circle" size={20} color="#666666" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f37240',
    shadowColor: '#000',
    height:50
  },
  searchIconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333333',
    paddingVertical: 10,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export default SearchBar; 