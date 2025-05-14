import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React, {useEffect} from "react";
import {Goal, GoalEmpty, GoalSummary} from "./Goal";
import {addTaskToCategory, getCategories, getCategory, getDefaultSelectedCategories} from "../api/helpers";
import ActiveGoals from "./ActiveGoals";
import {padGoals} from "./helpers";

const GoalsHeaderView = ({ collection, tasks, toggleGoalDetails, getLastSelectedTask }) => {
    const [goals, setGoals] = React.useState([]);
    const [goalCategory, setGoalCategory] = React.useState(null);

    useEffect(() => {
        if (collection.id) {
            refreshGoals();
            getGoalCategory().then(category => setGoalCategory(category));
        }
    }, [collection]);

    const refreshGoals = () => {
        getGoalCategory().then(category => {
            setGoalCategory(category);
            setGoals(padGoals(category?.items, 3));
        });
    }

    const getGoalCategoryId = () => {
        return collection?.attributes?.big_goals || null;
    }

    const getGoalCategory = async () => {
        const goalCategoryId = getGoalCategoryId();
        return goalCategoryId
            ? await getCategory(goalCategoryId)
            : null;
    }

    const getGoalTasks = () => {
        return goals.map((goalId) => tasks[goalId])
    }

    const addGoal = () => {
        if (!goals || goals.filter(id => id).length >= 3) return; // Limit to 3 big goals
        const lastSelectedTask = getLastSelectedTask();
        if (!lastSelectedTask) return;
        addTaskToCategory(goalCategory, lastSelectedTask).then(_ => refreshGoals());
    }

    return (<View style={styles.container}>
        <ActiveGoals goals={getGoalTasks()} addGoal={addGoal} toggleDetails={toggleGoalDetails} />
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
