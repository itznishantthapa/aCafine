import AsyncStorage from '@react-native-async-storage/async-storage';

const getAccessToken = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
            console.log('No access token found');
            return null;
        }
        return token;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}

export default getAccessToken;