import getAccessToken from "./getToken";

const createOrder = async (obj) => {
  const token = getAccessToken();

  if (!token) {
    Alert.alert("Error", "Authentication token not found. Please login again.")
    return
  }

    const res = await fetch('http://127.0.0.1:8000/api/create-order/', {
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
  