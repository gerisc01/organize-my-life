import React, {useEffect, useState} from 'react';
import MainView from "./src/main/MainView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {SafeAreaView, StatusBar, useWindowDimensions} from "react-native";
import { isSessionLoggedIn } from "./src/login/Auth";
import Login from "./src/login/Login";

const App = () => {
    const { width } = useWindowDimensions();
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const phone = width < 768; // You can adjust the width threshold as needed

    useEffect(() => {
        const checkLoginStatus = async () => {
            const loggedIn = await isSessionLoggedIn();
            setIsLoggedIn(loggedIn);
        };
        checkLoginStatus();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style="auto" />
                {isLoggedIn === true && phone && <PhoneView />}
                {isLoggedIn === true && !phone && <MainView />}
                {isLoggedIn === false && <Login onLogin={() => setIsLoggedIn(true)}/>}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default App;
