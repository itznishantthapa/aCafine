import getAccessToken from "./getToken";
import { getApiUrl, API_ENDPOINTS } from "../config";

const createOrder = async (obj) => {
  const token = await getAccessToken();

  if (!token) {
    Alert.alert("Error", "Authentication token not found. Please login again.")
    return
  }

  const res = await fetch(getApiUrl(API_ENDPOINTS.CREATE_ORDER), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(obj),
  });

  const data = await res.json();
  console.log(data);
  return data;
};

export default createOrder;
  