import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React, {useEffect} from "react";
import {HeaderGoal, HeaderGoalEmpty, GoalSummaryToggle} from "./HeaderGoals";
import {addTaskToCategory, getCategories, getCategory, getDefaultSelectedCategories} from "../api/helpers";
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
        <ActiveGoalsHeader goals={goalTasks} toggleDetails={toggleGoalDetails} />
    </View>);
}

const ActiveGoalsHeader = ({ goals, addGoal, toggleDetails }) => {
    return (<View style={styles.container}>
        <View style={styles.goalsSummary}>
            <GoalSummaryToggle toggleDetails={toggleDetails} />
        </View>
        {goals.map((goal, index) => (
            <View key={index} style={styles.goal}>
                {goal
                    ? <HeaderGoal goal={goal} num={index+1} />
                    : <HeaderGoalEmpty />
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

export default GoalsHeaderView;
