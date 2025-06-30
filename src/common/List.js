import {
    CreateTask,
    EditableTask,
    GoalTask,
    TaskCompleteToggle,
    TaskContainer,
    taskContainerHeight
} from "../tasks/Task";
import {DraggableList} from "./DraggableList";
import {DraggableItem} from "./DraggableItem";
import {StyleSheet, View} from "react-native";
import React from "react";

export const ListParentItems = ({ readOnly, parentTasks, editTask, deleteTask, closeTask}) => {
    return (parentTasks?.map((parentTask, index) => {
        let onTaskUpdate = editTask ? (newText) => editTask(parentTasks[0].id, newText) : () => {};
        let onTaskDelete = deleteTask ? () => deleteTask(parentTask.id) : () => {};
        let onTaskClose = closeTask ? () => closeTask() : () => {};
        return (<EditableTask key={index + parentTask.name} disabled={index !== parentTasks.length - 1 || readOnly} task={parentTask}
                              onTaskUpdate={onTaskUpdate} onTaskDelete={onTaskDelete} onTaskClose={onTaskClose} />)
    }))
};

export const ListCheckboxItems = ({ tasks, toggleTaskCompletion }) => (
    tasks?.map((task, index) => (
        <GoalTask key={index+task.name} task={task} toggleTaskCompletion={toggleTaskCompletion} />
    ))
)

export const ListItems = ({ tasks, Task = TaskContainer, selectTask, indexMoved }) => (
    <DraggableList
        data={tasks}
        itemHeight={taskContainerHeight}
        renderItem={({ item, index, scrollViewRef, scrollY, itemHeight }) => (
            <DraggableItem
                key={item.id}
                scrollViewRef={scrollViewRef}
                scrollY={scrollY}
                itemHeight={itemHeight}
                onTap={() => selectTask(item.id)}
                onDragEnd={(movedBy) => indexMoved(index, movedBy)}
            >
                <Task task={item} />
            </DraggableItem>
        )}
    />
)

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
