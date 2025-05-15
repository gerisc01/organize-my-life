import { Platform } from 'react-native';
// Use for Web
import AsyncStorage from '@react-native-async-storage/async-storage';
// Use for iOS/Android
import * as SecureStore from 'expo-secure-store';

export const setSession = async (username, password) => {
    return await setCredentials('session', {
        username: username,
        password: password,
    });
};

export const isSessionLoggedIn = async () => {
    const session = await getCredentials('session');
    return !!session && !!session.username && !!session.password;
}

export const getSessionApiKey = async () => {
    const session =  await getCredentials('session');
    return session.password;
};

export const setCredentials = async(key, value) => {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } else {
            await SecureStore.setItemAsync(key, JSON.stringify(value));
        }
        return true;
    } catch (error) {
        console.error('Error storing credentials:', error);
        return false;
    }
}

export const getCredentials = async(key) => {
    try {
        let value;
        if (Platform.OS === 'web') {
            value = await AsyncStorage.getItem(key);
        } else {
            value = await SecureStore.getItemAsync(key);
        }
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error retrieving credentials:', error);
        return null;
    }
}

export const removeCredentials = async(key) => {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
        return true;
    } catch (error) {
        console.error('Error removing credentials:', error);
        return false;
    }
}
