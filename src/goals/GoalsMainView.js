import {StyleSheet, View} from "react-native";
import React, {useEffect, useState} from "react";
import {addTaskToCategory, getCategory, removeTaskFromCategory} from "../api/helpers";
import {getChildrenTasks, getLastSelectedTask, updateTaskCompletion} from "../tasks/helpers";
import {Category} from "../tasks/Category";
import {padGoals} from "./helpers";
import {GoalNextSteps} from "./GoalNextSteps";

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

    const removeGoal = async (goal) => {
        if (!goals) return;
        await removeTaskFromCategory(goalCategory, goal).then(_ => refreshGoals());
    }

    const getParentTasksAndActionableGoals = (goal) => {
        let parentTasks = [];
        let actionableGoals = [];

        let currentTask = goal;
        while (currentTask?.children && currentTask.children.length > 0) {
            actionableGoals = currentTask.children.map(childId => tasks[childId]);
            parentTasks.push(currentTask);
            let nextChild = currentTask.children.find(childId => !tasks[childId].completed);
            currentTask = tasks[nextChild] || null;
        }

        return [parentTasks, actionableGoals];
    }

    const toggleTaskCompletion = async (taskId) => {
        await updateTaskCompletion(tasks[taskId]);
        refreshTasks();
    }

    const generateProps = (goalIndex, goalTask) => {
        const [parentTasks, actionableGoals] = getParentTasksAndActionableGoals(goalTask);
        return {
            goalTask: goalTask,
            parentTasks: parentTasks,
            tasks: actionableGoals,
            removeGoal: () => removeGoal(goalTask),
        }
    }

    return (<View style={styles.container}>{
        goals.map((goalId, index) => {
            const goalTask = tasks[goalId];
            if (!goalTask) return null;
            return (<GoalNextSteps key={goalTask.id} toggleTaskCompletion={toggleTaskCompletion} {...generateProps(index, goalTask)} />);
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
