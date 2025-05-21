import {Pressable, StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {addTaskToCategory, getCategory, removeTaskFromCategory} from "../api/helpers";
import {getChildrenTasks, getLastSelectedTask, updateTaskCompletion} from "../tasks/helpers";
import {Category} from "../tasks/Category";
import {padGoals} from "./helpers";
import {GoalNextSteps} from "./GoalNextSteps";
import CategoryView from "../tasks/CategoryView";

const GoalsView = ({ collection, tasks, refreshTasks, onLastSelectedTaskChanged, getLastSelectedTask, phoneView }) => {
    const [goals, setGoals] = useState([]);
    const [goalCategory, setGoalCategory] = useState(null);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [selectingNewGoal, setSelectingNewGoal] = useState(false);

    useEffect(() => {
        if (collection.id) {
            refreshGoals();
            getGoalCategory().then(category => setGoalCategory(category));
        }
    }, [collection]);

    const refreshGoals = () => {
        getGoalCategory().then(category => {
            setGoalCategory(category);
            const currentGoals = [...category?.items] || [];
            setGoals(padGoals(currentGoals, 3));
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
        await removeTaskFromCategory(goalCategory, goal)
            .then(_ => refreshGoals())
            .then(_ => setSelectedGoal(null));
    }

    const addGoal = () => {
        if (!goals || goals.filter(id => id).length >= 3) return; // Limit to 3 big goals
        const lastSelectedTask = getLastSelectedTask();
        if (!lastSelectedTask) return;
        addTaskToCategory(goalCategory, lastSelectedTask)
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

    if (phoneView && selectingNewGoal) {
        return <GoalAddNew collection={collection} tasks={tasks} refreshTasks={refreshTasks} addGoal={addGoal}
            setSelectingNewGoal={setSelectingNewGoal} onLastSelectedTaskChanged={onLastSelectedTaskChanged} />
    } else if (phoneView && !selectedGoal) {
        return <GoalSelector tasks={tasks} goalIds={goals} selectGoal={setSelectedGoal} setSelectingNewGoal={setSelectingNewGoal} />
    } else if (phoneView && selectedGoal) {
        const goalTask = tasks[selectedGoal];
        return <GoalNextSteps key={selectedGoal} unselectGoal={() => setSelectedGoal(null)} {...generateProps(null, goalTask)} />
    } else {
        return <GoalsMainView goals={goals} tasks={tasks} generateProps={generateProps}  />
    }
}

const GoalSelector = ({ tasks, goalIds, selectGoal, setSelectingNewGoal }) => {
    return (<View style={styles.selectorContainer}>
        {goalIds.map((goalId, index) => {
            const goalTask = tasks[goalId];
            if (!goalTask) {
                return (
                    <Pressable style={styles.newGoalButton} key={`empty${index}`} onPress={() => setSelectingNewGoal(true)}>
                        <Text>Add a new goal</Text>
                    </Pressable>
                )
            } else {
                return (
                    <Pressable style={styles.goalButton} key={goalId} onPress={() => selectGoal(goalId)}>
                        <Text>{tasks[goalId]?.name}</Text>
                    </Pressable>
                )
            }
        })}
    </View>)
}

const GoalAddNew = ({ collection, tasks, refreshTasks, onLastSelectedTaskChanged, addGoal, setSelectingNewGoal }) => {
    return (<View style={styles.selectorContainer}>
        <Pressable onPress={() => setSelectingNewGoal(false)}>
            <Text style={styles.selectorHeader}>Select a new goal</Text>
        </Pressable>
        <Separator />
        <CategoryView phoneView={true} readOnly={true} collection={collection} tasks={tasks}
                      refreshTasks={refreshTasks} onLastSelectedTaskChanged={onLastSelectedTaskChanged} />
        <Separator />
        <Pressable onPress={() => addGoal()}>
            <Text style={styles.addGoalButton}>Add goal</Text>
        </Pressable>
    </View>)
}

const GoalsMainView = ({ goals, tasks, generateProps }) => {
    return (<View style={styles.container}>{
        goals.map((goalId, index) => {
            const goalTask = tasks[goalId];
            if (!goalTask) return null;
            return (<GoalNextSteps key={goalTask.id} {...generateProps(index, goalTask)} />);
        })
    }</View>)
}

export const Separator = () => {
    return <View style={styles.separator} />
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
    selectorContainer: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
    },
    newGoalButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'lightgreen',
    },
    goalButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
        borderRadius: 5,
    },
    addGoalButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'lightgreen',
    },
    separator: {
        borderBottomColor: 'black',
        borderBottomWidth: 3,
        marginHorizontal: 5,
        marginVertical: 10,
        shadowColor: "white",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {height: 1, width: 1}
    }
});


export default GoalsView;
