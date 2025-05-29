import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";
import {CompletedTask, CreateTask, EditableTask, MoveableTask, Task, TaskCompleteToggle, TaskContainer} from "./Task";
import {DraggableItem} from "../dnd/DraggableItem";
import {DraggableList} from "../dnd/DraggableList";

export const Category = ({ readOnly, category, parentTasks, tasks, reorderTasks, selectTask, unselectTasks, newTask, editTask, deleteAndRemoveTask, toggleTaskCompletion, selectCategory }) => {
    const [startAdding, setStartAdding] = React.useState(false);
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
    return (<View style={styles.category}>
        <Pressable onPress={() => unselectCategoryAndTasks()}>
            <Text style={styles.categoryTitle}>{category?.name}</Text>
        </Pressable>
        <View style={styles.taskScrollContainer}>
            {parentTasks?.map((parentTask, index) => (
                <EditableTask key={index+parentTask.name} disabled={index !== parentTasks.length - 1 || readOnly} task={parentTask}
                              onTaskUpdate={(newText) => editTask(parentTask.id, newText)}
                              onTaskDelete={() => deleteAndRemoveTask(parentTask.id)}
                              onTaskClose={() => setStartAdding(false)}
                />
            ))}
            <DraggableList
                data={tasks}
                itemHeight={40}
                renderItem={({ item, index, scrollViewRef, scrollY, itemHeight }) => (
                    <DraggableItem
                        key={item.id}
                        scrollViewRef={scrollViewRef}
                        scrollY={scrollY}
                        itemHeight={itemHeight}
                        onTap={() => selectTask(category.id, item.id)}
                        onDragEnd={(movedBy) => indexMoved(index, movedBy)}
                    >
                        <TaskContainer task={item} />
                    </DraggableItem>
                )}
            />
            {startAdding && <CreateTask onTaskCreate={(newText) => newTask(newText)} onTaskClose={() => setStartAdding(false)}/>}
            {allTasksCompleted() && parentTasks && !startAdding && <TaskCompleteToggle task={getLastParentTask()} toggleTaskCompletion={toggleTaskCompletion} />}
        </View>
        <View style={styles.backButtons}>
            <NavButton text="Back" onPress={() => unselectTasks(false)} disabled={!parentTasks} />
            <NavButton text="Home" onPress={() => unselectTasks(true)} disabled={!parentTasks} />
            <NavButton text="Add" onPress={() => setStartAdding(!startAdding)} disabled={readOnly} />
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
