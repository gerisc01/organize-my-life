import {Pressable, StyleSheet, Text, View} from "react-native";
import React from "react";

export const ListTitle = ({ text, onPress, disabled }) => (
    <Pressable disabled={disabled} onPress={() => onPress()}>
        <Text style={styles.categoryTitle}>{text}</Text>
    </Pressable>
)

export const SelectItemButton = ({ text, onPress }) => (
    <Pressable onPress={() => onPress()}>
        <Text style={styles.selectItemButton}>{text}</Text>
    </Pressable>
)

export const NavButton = ({ text, onPress, disabled }) => {
    const disablePress = disabled || !onPress;
    return (
        <Pressable onPress={onPress} disabled={disablePress} style={disablePress ? styles.navButtonDisabled : styles.navButton}>
            <Text>{text}</Text>
        </Pressable>
    );
}

export const PlusButton = ({ onPress }) => {
    return (
        <Pressable onPress={onPress} style={styles.plusButton}>
            <Text style={styles.plusButtonText}>+</Text>
        </Pressable>
    );
}

export const Separator = () => {
    return <View style={styles.separator} />
}

const styles = StyleSheet.create({
    categoryTitle: {
        fontSize: 20,
        alignSelf: 'center',
    },
    navButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
    },
    navButtonDisabled: {
        flex: 1,
        backgroundColor: 'lightgrey',
        borderWidth: 1,
        borderColor: 'black',
    },
    selectItemButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'lightgreen',
    },
    plusButton: {
        height: '50%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'lightgreen',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    plusButtonText: {
        fontColor: 'grey',
        fontWeight: 'bold',
        fontSize: 20
    },
    separator: {
        borderBottomColor: 'black',
        borderBottomWidth: 3,
        marginHorizontal: 5,
        marginVertical: 10,
        shadowColor: "white",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {height: 1, width: 1}
    }
});
