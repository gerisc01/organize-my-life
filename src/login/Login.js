import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { setCredentials } from './Auth';
import {loadObject} from "../api/ListsApi";
import axios from "axios";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const getAccount = async (id) => {
        try {
            const serverLocation = process.env.EXPO_PUBLIC_API_URL;
            const uri = `${serverLocation}/api/accounts/${id}`;
            const headers = {
                headers: {
                    'ACCOUNT_ID': id
                }
            };
            const response =  await axios.get(uri, headers);
            return response.data;
        } catch (error) {
            throw error.response.data.message;
        }
    }

    const handleLogin = async () => {
        try {
            if (!username || !password) {
                setError('Please enter both username and password');
                return;
            }

            // Validate credentials
            const accountResp = await getAccount(password);
            if (!accountResp || !accountResp.id || accountResp.id !== password) {
                setError('Invalid username or password');
                return;
            } else {
                // Success!
                await setCredentials('session', {
                    username: username,
                    password: password,
                });
                onLogin();
            }

            // Clear form
            setUsername('');
            setPassword('');
            setError('');
        } catch (err) {
            setError('Login failed');
            console.error('Login error:', err);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default Login;
