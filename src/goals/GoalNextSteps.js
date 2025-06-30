import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";
import {EditableTask, GoalTask} from "../tasks/Task";
import {ListTitle, NavButton} from "../common/ListButtons";
import {ListCheckboxItems, ListParentItems} from "../common/List";

export const GoalNextSteps = ({ goalTask, parentTasks, tasks, unselectGoal, removeGoal, toggleTaskCompletion }) => {
    return (<View style={styles.category}>
        <ListTitle text={goalTask?.name} onPress={() => unselectGoal()} disabled={!unselectGoal} />
        <View style={styles.taskContainer}>
            {parentTasks && <ListParentItems parentTasks={parentTasks} readOnly={true} />}
            {tasks && <ListCheckboxItems tasks={tasks} toggleTaskCompletion={toggleTaskCompletion} />}
        </View>
        <View style={styles.backButtons}>
            <NavButton text={goalTask.completed ? 'Task Completed' : 'Complete Task?'}
                       onPress={() => toggleTaskCompletion(goalTask.id)} />
            <NavButton text='Remove Goals' onPress={() => removeGoal()}
                       disabled={false} />
        </View>
    </View>);
}

const styles = StyleSheet.create({
    category: {
        flex: 1,
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
});
