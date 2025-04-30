import {Pressable, StyleSheet, Text, View} from "react-native";
import {formatDate} from "./helpers";
import {useState} from "react";

export const GoalSummary = ({ toggleDetails }) => {
    const [summaryText, setSummaryText] = useState('Expand for Details');
    const summaryPressed = () => {
        toggleDetails();
        setSummaryText(summaryText === 'Expand for Details' ? 'Collapse Details' : 'Expand for Details');
    }
    return (<Pressable style={styles.goalSummary} onPress={() => summaryPressed()}>
        <Text style={styles.goalSummaryHeader}>{formatDate(new Date())}</Text>
        <Text style={styles.goalSummaryText}>{summaryText}</Text>
    </Pressable>)
}

export const Goal = ({ goal, num }) => {
    return (<View style={styles.goal}>
        <Text style={styles.goalHeader}>Goal #{num}</Text>
        {goal.completed && <Text style={styles.completedGoalText}>{goal.name}</Text>}
        {!goal.completed && <Text style={styles.goalText}>{goal.name}</Text>}
    </View>)
}

export const GoalEmpty = ({ addGoal }) => {
    return (<Pressable style={styles.emptyGoal} onPress={() => addGoal()}>
        <Text>Press to add focused goal</Text>
    </Pressable>)
}

const styles = StyleSheet.create({
    goalSummary: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    goalSummaryHeader: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    goalSummaryText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    goal: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    goalHeader: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    goalText: {
        fontSize: 16,
    },
    completedGoalText: {
        fontSize: 16,
        textDecorationLine: 'line-through',
        color: 'grey',
    },
    emptyGoal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
