import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";
import {Goal, GoalEmpty, GoalSummary} from "./Goal";

const ActiveGoals = ({ goals, addGoal }) => {
    return (<View style={styles.container}>
        <View style={styles.goalsSummary}>
            <GoalSummary />
        </View>
        {goals.map((goal, index) => (
            <View key={index} style={styles.goal}>
                {goal
                    ? <Goal goal={goal} />
                    : <GoalEmpty addGoal={addGoal} />
                }
            </View>
        ))}
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

export default ActiveGoals;
