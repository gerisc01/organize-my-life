import React from 'react';
import MainView from "./src/main/MainView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {SafeAreaView, StatusBar, useWindowDimensions} from "react-native";
import TestDraggable from "./src/dnd/TestDraggable";

const App = () => {
    const { width } = useWindowDimensions();
    const phone = width < 768; // You can adjust the width threshold as needed

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style="auto" />
                {phone ? <PhoneView /> : <MainView />}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default App;
