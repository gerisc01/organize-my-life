import {StyleSheet, View} from "react-native";
import React, {useEffect, useState} from "react";
import {getCategory} from "../api/helpers";
import {getChildrenTasks, getLastSelectedTask, updateTaskCompletion} from "../tasks/helpers";
import {Category} from "../tasks/Category";
import {padGoals} from "./helpers";

const GoalsMainView = ({ collection, tasks, refreshTasks }) => {
    const [goals, setGoals] = React.useState([]);
    const [goalCategory, setGoalCategory] = React.useState(null);
    const [selectedGoals, setSelectedGoals] = useState([[],[],[]]);

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

    const selectGoal = (goalIndex, taskId) => {
        const newSelectedGoals = [...selectedGoals];
        if (!newSelectedGoals[goalIndex].includes(taskId)) {
            newSelectedGoals[goalIndex].push(taskId);
        }
        setSelectedGoals(newSelectedGoals);
    }

    const unselectGoals = (goalIndex, unselectAll) => {
        if (unselectAll) {
            const newSelectedGoals = [...selectedGoals];
            newSelectedGoals[goalIndex] = [];
            setSelectedGoals(newSelectedGoals);
        } else {
            const newSelectedGoals = [...selectedGoals];
            newSelectedGoals[goalIndex].pop();
            setSelectedGoals(newSelectedGoals);
        }
    }

    const toggleTaskCompletion = async (taskId) => {
        await updateTaskCompletion(tasks[taskId]);
        refreshTasks();
    }

    const generateProps = (goalIndex, fakeCategory) => {
        let parentTask = getLastSelectedTask(selectedGoals[goalIndex], tasks);
        if (!parentTask) parentTask = tasks[goals[goalIndex]]
        return {
            category: fakeCategory,
            tasks: getChildrenTasks(parentTask, tasks),
            parentTasks: parentTask ? selectedGoals[goalIndex].map(selectedId => tasks[selectedId]) : null,
            selectTask: (_, taskId) => selectGoal(goalIndex, taskId),
            unselectTasks: (unselectAll) => unselectGoals(goalIndex, unselectAll),
            toggleTaskCompletion: (taskId) => toggleTaskCompletion(taskId)
        }
    }

    return (<View style={styles.container}>{
        goals.map((goalId, index) => {
            console.log(goalId);
            const goalTask = tasks[goalId];
            if (!goalTask) return null;
            const fakeCategory = {name: goalTask.name};
            return (<Category key={goalTask.id} {...generateProps(index, fakeCategory)} />);
        })
    }</View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
    }
});


export default GoalsMainView;
