import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";
import { CreateTask, EditableTask, MoveableTask, Task, TaskCompleteToggle} from "./Task";

export const Category = ({ category, parentTasks, tasks, reorderTasks, selectTask, unselectTasks, newTask, editTask, deleteAndRemoveTask, toggleTaskCompletion }) => {
    const [startAdding, setStartAdding] = React.useState(false);
    const indexMoved = (originalIndex, movedBy) => {
        if (movedBy === 0) return;
        if (originalIndex + movedBy < 0 || originalIndex + movedBy >= tasks.length) return;
        reorderTasks(category.id, originalIndex, originalIndex + movedBy);
    }
    const allTasksCompleted = () => {
        if (!tasks) return false;
        return tasks.every(task => task.completed);
    }
    const getLastParentTask = () => {
        if (!parentTasks || parentTasks.length === 0) return null;
        return parentTasks[parentTasks.length - 1];
    }
    return (<View style={styles.category}>
        <Text style={styles.categoryTitle}>{category?.name}</Text>
        <ScrollView style={styles.taskScrollContainer} contentContainerStyle={styles.taskContainer}>
            {parentTasks?.map((parentTask, index) => (
                <EditableTask key={index+parentTask.name} disabled={index !== parentTasks.length - 1} task={parentTask}
                              onTaskUpdate={(newText) => editTask(parentTask.id, newText)}
                              onTaskDelete={() => deleteAndRemoveTask(parentTask.id)}
                              onTaskClose={() => setStartAdding(false)}
                />
            ))}
            {tasks?.map((task, index) => (
                <MoveableTask key={index+task.name} task={task}
                              selectTask={(taskId) => selectTask(category.id, taskId)}
                              indexMoved={(movedBy) => indexMoved(index, movedBy)} />
            ))}
            {startAdding && <CreateTask onTaskCreate={(newText) => newTask(newText)} onTaskClose={() => setStartAdding(false)}/>}
            {allTasksCompleted() && parentTasks && !startAdding && <TaskCompleteToggle task={getLastParentTask()} toggleTaskCompletion={toggleTaskCompletion} />}
        </ScrollView>
        <View style={styles.backButtons}>
            <NavButton text="Back" onPress={() => unselectTasks(false)} disabled={!parentTasks} />
            <NavButton text="Home" onPress={() => unselectTasks(true)} disabled={!parentTasks} />
            <NavButton text="Add" onPress={() => setStartAdding(!startAdding)} />
        </View>
    </View>);
}

const NavButton = ({ text, onPress, disabled }) => {
    const disablePress = disabled || !onPress;
    return (
        <Pressable onPress={onPress} disabled={disablePress} style={disablePress ? styles.navButtonDisabled : styles.navButton}>
            <Text>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    category: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 20,
        alignSelf: 'center',
    },
    taskScrollContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        padding: 5,
        marginHorizontal: 20,
        marginTop: 10,
    },
    taskContainer: {
        flex: 1,
    },
    backButtons: {
        flexDirection: 'row',
        height: 25,
        marginHorizontal: 20,
    },
    navButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
    },
    navButtonDisabled: {
        flex: 1,
        backgroundColor: 'lightgrey',
        borderWidth: 1,
        borderColor: 'black',
    },
});
