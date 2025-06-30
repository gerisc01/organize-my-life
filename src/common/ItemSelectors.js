import React, {useRef} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import CategoryView from "../tasks/CategoryView";
import {ListTitle, SelectItemButton, Separator} from "./ListButtons";

export const GoalAddNew = ({ collection, tasks, refreshTasks, addGoal, setSelectingNewGoal }) => {
    const currentTaskRef = useRef(null);
    return (<View style={styles.selectorContainer}>
        <ListTitle text='Select a new goal' onPress={() => setSelectingNewGoal(false)}/>
        <Separator />
        <CategoryView phoneView={true} readOnly={true} collection={collection} tasks={tasks}
                      currentTaskRef={currentTaskRef} refreshTasks={refreshTasks} />
        <Separator />
        <SelectItemButton text='Add goal' onPress={() => addGoal(currentTaskRef.current)} />
    </View>)
}

export const WeeklyGoalAddNew = ({ collection, tasks, refreshTasks, addTask, toggleAddingGoals }) => {
    const currentTaskRef = useRef(null);
    return (<View style={styles.selectorContainer}>
        <ListTitle text='Select a new goal' onPress={() => toggleAddingGoals()}/>
        <Separator />
        <CategoryView phoneView={true} readOnly={true} collection={collection} tasks={tasks}
                      currentTaskRef={currentTaskRef} refreshTasks={refreshTasks} />
        <Separator />
        <SelectItemButton text='Add goal' onPress={() => addTask(currentTaskRef.current)} />
    </View>)
}

const styles = StyleSheet.create({
    selectorContainer: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
    },
});
