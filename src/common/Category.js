import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";
import {CreateTask, MoveableTask, Task} from "./Task";

export const Category = ({ category, parentTasks, tasks, reorderTasks, selectTask, unselectTasks, addTask }) => {
    const [startAdding, setStartAdding] = React.useState(false);
    const indexMoved = (originalIndex, movedBy) => {
        if (movedBy === 0) return;
        if (originalIndex + movedBy < 0 || originalIndex + movedBy >= tasks.length) return;
        reorderTasks(category.id, originalIndex, originalIndex + movedBy);
    }
    return (<View style={styles.category}>
        <Text style={styles.categoryTitle}>{category?.name}</Text>
        <View style={styles.taskContainer}>
            {parentTasks?.map((parentTask, index) => (
                <Task key={index+parentTask.name} disabled={true} task={parentTask} />
            ))}
            {tasks?.map((task, index) => (
                <MoveableTask key={index+task.name} task={task}
                              selectTask={(taskId) => selectTask(category.id, taskId)}
                              indexMoved={(movedBy) => indexMoved(index, movedBy)} />
            ))}
            {startAdding && <CreateTask onTaskCreate={(newText) => addTask(newText)} onTaskClose={() => setStartAdding(false)}/>}
        </View>
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
    taskContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        padding: 5,
        marginHorizontal: 20,
        marginTop: 10,
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
