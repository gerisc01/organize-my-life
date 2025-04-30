import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";
import {EditableTask, GoalTask} from "../tasks/Task";

export const GoalNextSteps = ({ goalTask, parentTasks, tasks, toggleTaskCompletion }) => {
    return (<View style={styles.category}>
        <Text style={styles.categoryTitle}>{goalTask?.name}</Text>
        <View style={styles.taskContainer}>
            {parentTasks?.map((parentTask, index) => (
                <EditableTask key={index+parentTask.name} disabled={true} task={parentTask} />
            ))}
            {tasks?.map((task, index) => (
                <GoalTask key={index+task.name} task={task} toggleTaskCompletion={toggleTaskCompletion} />
            ))}
        </View>
        <View style={styles.backButtons}>
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
