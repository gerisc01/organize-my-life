import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";
import {Goal, GoalSummary} from "../common/Goal";

const BigGoals = ({  }) => {
    return (<View style={styles.container}>
        <View style={styles.goalsSummary}>
            <GoalSummary />
        </View>
        <View style={styles.goal}>
            <Goal />
        </View>
        <View style={styles.goal}>
            <Goal />
        </View>
        <View style={styles.goal}>
            <Goal />
        </View>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    goalsSummary: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
    },
    goal: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
    },
});

export default BigGoals;
