// Configuration file for environment variables

// API configuration
const DEV_API_URL = 'http://127.0.0.1:8000/api/'; // Tested and valid API endpoint
// const DEV_API_URL = 'http://192.168.78.215:8000'; // Tested and valid API endpoint
// const DEV_API_URL = 'http://192.168.43.92:8000'; // Tested and valid API endpoint
const PROD_API_URL = 'https://your-production-api-url.com';

// Current environment
const IS_PRODUCTION = false; // Set to true for production builds

// Export environment variables
export const BASE_URL = IS_PRODUCTION ? PROD_API_URL : DEV_API_URL;
