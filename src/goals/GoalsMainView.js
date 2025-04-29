import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React, {useEffect} from "react";
import {Goal, GoalEmpty, GoalSummary} from "./Goal";
import {getCategories, getCategory, getDefaultSelectedCategories} from "../api/helpers";
import ActiveGoals from "./ActiveGoals";

const GoalsMainView = ({ collection, tasks }) => {
    const [goals, setGoals] = React.useState([]);

    useEffect(() => {
        if (collection.id) {
            getGoalIds(collection).then(goalIds => setGoals(padGoals(goalIds, 3)));
        }
    }, [collection]);

    const getGoalIds = async (collection) => {
        const goalCategoryId = collection?.attributes?.big_goals;
        if (goalCategoryId) {
            const goalCategory = await getCategory(goalCategoryId);
            if (goalCategory) return goalCategory.items || [];
        }
        return [];
    }

    const getGoalTasks = () => {
        return goals.map((goalId) => tasks[goalId])
    }

    return (<View style={styles.container}>
        <ActiveGoals goals={getGoalTasks()} addGoal={() => console.log('Add goal pressed')} />
    </View>);
}

const padGoals = (goals, goalNum) => {
    const result = [];
    if (!goals || goals.length === 0) return [null, null, null];
    while (result.length < goalNum) {
        const goal = goals.shift();
        result.push(goal ? goal : null);
    }
    return result;
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

export default GoalsMainView;
