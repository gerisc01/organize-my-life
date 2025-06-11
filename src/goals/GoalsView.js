import {Pressable, StyleSheet, Text, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {addTaskToCategory, getCategory, removeTaskFromCategory} from "../api/helpers";
import {getChildrenTasks, getLastSelectedTask, updateTaskCompletion} from "../tasks/helpers";
import {Category} from "../tasks/Category";
import {padGoals} from "./helpers";
import {GoalNextSteps} from "./GoalNextSteps";
import CategoryView from "../tasks/CategoryView";
import {GoalSelector} from "../common/CategorySelectors";
import {PlusButton} from "../common/ListButtons";
import {GoalAddNew} from "../common/ItemSelectors";

const GoalsView = ({ collection, tasks, goalCategory, refreshGoals, refreshTasks, phoneView }) => {
    const [goals, setGoals] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [selectingNewGoal, setSelectingNewGoal] = useState(false);

    useEffect(() => {
        if (goalCategory) {
            const currentGoals = [...goalCategory?.items] || [];
            setGoals(padGoals(currentGoals, 3));
        }
    }, [goalCategory]);

    const removeGoal = async (goal) => {
        if (!goals) return;
        await removeTaskFromCategory(goalCategory, goal)
            .then(_ => refreshGoals())
            .then(_ => setSelectedGoal(null));
    }

    const addGoal = (selectedTask) => {
        if (!goals || goals.filter(id => id).length >= 3) return; // Limit to 3 big goals
        if (!selectedTask) return;
        addTaskToCategory(goalCategory, selectedTask)
            .then(_ => refreshGoals())
            .then(_ => setSelectingNewGoal(false));
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
            toggleTaskCompletion,
        }
    }

    if (selectingNewGoal) {
        return <GoalAddNew collection={collection} tasks={tasks} refreshTasks={refreshTasks} addGoal={addGoal}
            setSelectingNewGoal={setSelectingNewGoal} />
    } else if (phoneView && !selectedGoal) {
        return <GoalSelector tasks={tasks} goalIds={goals} selectGoal={setSelectedGoal} setSelectingNewGoal={setSelectingNewGoal} />
    } else if (phoneView && selectedGoal) {
        const goalTask = tasks[selectedGoal];
        return <GoalNextSteps key={selectedGoal} unselectGoal={() => setSelectedGoal(null)} {...generateProps(null, goalTask)} />
    } else {
        return <GoalsMainView goals={goals} tasks={tasks} setSelectingNewGoal={setSelectingNewGoal} generateProps={generateProps}  />
    }
}

const GoalsMainView = ({ goals, tasks, setSelectingNewGoal, generateProps }) => {
    return (<View style={styles.container}>{
        goals.map((goalId, index) => {
            const goalTask = tasks[goalId];
            if (goalTask) {
                return (<GoalNextSteps key={goalTask.id} {...generateProps(index, goalTask)} />);
            } else {
                return <PlusButton key={`empty${index}`} onPress={() => setSelectingNewGoal(true)} />
            }
        })
    }</View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
    },
    selectorHeader: {
        fontSize: 20,
        alignSelf: 'center',
    },
});


export default GoalsView;
