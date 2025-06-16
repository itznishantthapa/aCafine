// Configuration file for environment variables

// API configuration
const DEV_API_URL = 'http://192.168.1.75:8000'; // Tested and valid API endpoint
// const DEV_API_URL = 'http://192.168.78.215:8000'; // Tested and valid API endpoint
// const DEV_API_URL = 'http://192.168.43.92:8000'; // Tested and valid API endpoint
const PROD_API_URL = 'https://your-production-api-url.com';

// Current environment
const IS_PRODUCTION = false; // Set to true for production builds

// Base URL for API calls
export const BASE_URL = IS_PRODUCTION ? PROD_API_URL : DEV_API_URL;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/login/',
  REGISTER: '/api/register/',
  
  // Dish endpoints
  GET_ALL_DISHES: '/api/get-all-dish/',
  CREATE_DISH: '/api/create-dish/',
  UPDATE_DISH: '/api/update-dish/',
  DELETE_DISH: '/api/delete-dish/',
  
  // Order endpoints
  CREATE_ORDER: '/api/create-order/',
  GET_ALL_ORDERS: '/api/get-all-orders/',
  GET_USER_ORDERS: '/api/get-user-orders/',
  MARK_ORDER_READY: '/api/mark-order-ready/',
};

// Utility function to get full API URL
export const getApiUrl = (endpoint) => `${BASE_URL}${endpoint}`;

// Utility function to handle image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
};
