import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";
import {CompletedTask, CreateTask, EditableTask, MoveableTask, Task, TaskCompleteToggle, TaskContainer} from "../tasks/Task";
import {ListTitle, NavButton} from "../common/ListButtons";
import {ListItems, ListParentItems} from "../common/List";

export const WeeklyGoals = ({ category, parentTasks, tasks, reorderTasks, selectTask, unselectTasks, removeTask, toggleAddingGoals, toggleTaskCompletion, selectCategory }) => {
    const indexMoved = (originalIndex, movedBy) => {
        if (movedBy === 0 || readOnly) return;
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
    const unselectCategoryAndTasks = () => {
        selectCategory(null);
        unselectTasks(true);
    }
    const removeAndUnselectTasks = () => {
        const lastParentTask = getLastParentTask();
        const lastParentTaskId = lastParentTask.id ? lastParentTask.id : lastParentTask;
        removeTask(lastParentTaskId);
        unselectTasks(true);
    }
    return (<View style={styles.category}>
        <ListTitle text={category?.name} onPress={unselectCategoryAndTasks} />
        <View style={styles.taskScrollContainer}>
            <ListParentItems readOnly={true} parentTasks={parentTasks} />
            <ListItems Task={TaskContainer} selectTask={(task) => selectTask(category.id, task)} indexMoved={indexMoved} tasks={tasks} />
            {allTasksCompleted() && parentTasks && <TaskCompleteToggle task={getLastParentTask()} toggleTaskCompletion={toggleTaskCompletion} />}
        </View>
        <View style={styles.backButtons}>
            <NavButton text="Back" onPress={() => unselectTasks(false)} disabled={!parentTasks} />
            <NavButton text="Home" onPress={() => unselectTasks(true)} disabled={!parentTasks} />
            {(!parentTasks || parentTasks.length <= 0) && <NavButton text="Add" onPress={() => toggleAddingGoals(category.id)} />}
            {parentTasks && parentTasks.length > 0 && <NavButton text="Remove" onPress={() => removeAndUnselectTasks()} />}
        </View>
    </View>);
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
});
