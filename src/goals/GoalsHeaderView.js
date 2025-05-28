import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React, {useEffect} from "react";
import {Goal, GoalEmpty, GoalSummary} from "./Goal";
import {addTaskToCategory, getCategories, getCategory, getDefaultSelectedCategories} from "../api/helpers";
import ActiveGoals from "./ActiveGoals";
import {padGoals} from "./helpers";

const GoalsHeaderView = ({ collection, tasks, goalCategory, toggleGoalDetails }) => {
    const [goalTasks, setGoalTasks] = React.useState([]);

    useEffect(() => {
        if (collection.id) {
            let currentGoals = [...goalCategory?.items] || [];
            currentGoals = currentGoals.map((goalId) => tasks[goalId]);
            setGoalTasks(padGoals(currentGoals, 3));
        }
    }, [goalCategory]);

    return (<View style={styles.container}>
        <ActiveGoals goals={goalTasks} toggleDetails={toggleGoalDetails} />
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

export default GoalsHeaderView;
