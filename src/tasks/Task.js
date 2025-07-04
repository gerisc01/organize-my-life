import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import Checkbox from 'expo-checkbox';

export const MoveableTask = ({ task, selectTask, unselectTasks, indexMoved }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const isDragging = useSharedValue(false);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        };
    });

    const panGesture = Gesture.Pan()
        .runOnJS(true)
        .onStart(() => {
            isDragging.value = true;
        })
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            const movedBy = Math.round(translateY.value / taskHeight);
            indexMoved(movedBy);
            isDragging.value = false;
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
        });

    const tapGesture = Gesture.Tap()
        .runOnJS(true)
        .onEnd(() => {
            if (!isDragging.value) {
                selectTask(task.id);
            }
        });

    const composedGesture = Gesture.Simultaneous(tapGesture, panGesture);

    return (
        <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.moveableTaskContainer, animatedStyle]}>
                { task.completed ? <CompletedTask task={task} /> : <Task task={task} /> }
            </Animated.View>
        </GestureDetector>
    );
}

export const TaskContainer = ({ task }) => {
    return (
        <View style={styles.moveableTaskContainer}>
            { task.completed ? <CompletedTask task={task} /> : <Task task={task} /> }
        </View>
    )
}
export const taskContainerHeight = 40;

export const CompletedTask = ({ task }) => {
    return (
        <View style={styles.completedTask}>
            <Text style={styles.completedTaskText}>{task.name}</Text>
        </View>
    )
}

export const Task = ({ task, disabled }) => {
    return (
        <View style={disabled ? styles.disabledTask : styles.task}>
            <Text>{task.name}</Text>
        </View>
    )
}

export const CreateTask = ({ onTaskCreate, onTaskClose }) => {
    const [newTaskText, setNewTaskText] = React.useState('');
    const checkmark = '✔️';
    const xmark = '❌';

    const handleTaskCreate = () => {
        onTaskCreate(newTaskText);
        onTaskClose();
    };

    const handleTaskClose = () => {
        setNewTaskText('');
        onTaskClose();
    }

    return (
        <View style={styles.newTask}>
            <TextInput style={styles.newTaskInput} onChangeText={setNewTaskText} value={newTaskText} placeholder="New Task Name" />
            <Text style={styles.newTaskButton} onPress={() => handleTaskCreate()}>{checkmark}</Text>
            <Text style={styles.newTaskButton} onPress={() => handleTaskClose()}>{xmark}</Text>
        </View>
    )
}

// TODO: This and CreateTask should be merged into one component
export const EditableTask = ({ onTaskUpdate, onTaskDelete, onTaskClose, task, disabled }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [newTaskText, setNewTaskText] = React.useState(task.name);
    const checkmark = '✔️';
    const xmark = '❌';
    const pencil = '✏️';
    const trash = '🗑️';

    const handleTaskUpdate = () => {
        onTaskUpdate(newTaskText);
        onTaskClose();
    };

    const handleTaskDelete = () => {
        onTaskDelete();
        onTaskClose();
    };

    const handleTaskClose = () => {
        setIsEditing(false);
        setNewTaskText(task.name);
        onTaskClose();
    }

    if (isEditing) {
        return (
            <View style={styles.newTask}>
                <TextInput style={styles.newTaskInput} onChangeText={setNewTaskText} value={newTaskText} />
                <Text style={styles.newTaskButton} onPress={() => handleTaskUpdate()}>{checkmark}</Text>
                <Text style={styles.newTaskButton} onPress={() => handleTaskClose()}>{xmark}</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.newTask}>
                <View style={styles.parentTaskNonEditable}>
                    <Text>{task.name}</Text>
                </View>
                {!disabled && <Text style={styles.newTaskButton} onPress={() => setIsEditing(true)}>{pencil}</Text>}
                {!disabled && <Text style={styles.newTaskButton} onPress={() => handleTaskDelete()}>{trash}</Text>}
            </View>
        );
    }
}

export const GoalTask = ({ task, toggleTaskCompletion }) => (
    <View style={styles.simpleTask}>
        <Checkbox style={styles.checkbox} value={task.completed} onValueChange={() => toggleTaskCompletion(task.id)} />
        {task.completed && <Text style={styles.completedTaskText}>{task.name}</Text>}
        {!task.completed && <Text>{task.name}</Text>}
    </View>
)

export const TaskCompleteToggle = ({ task, toggleTaskCompletion }) => {
    const style = task?.completed ? styles.uncompleteTaskButton : styles.completeTaskButton;
    const text = task?.completed ? "Task Complete" : "Mark as Complete?";
    return (
        <Pressable style={style} onPress={() => toggleTaskCompletion(task.id)}>
            <Text style={styles.completeTaskButtonText}>{text}</Text>
        </Pressable>
    )
}

const taskHeight = 40;

const styles = StyleSheet.create({
    moveableTaskContainer: {
        height: taskHeight,
    },
    disabledTask: {
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        backgroundColor: 'lightgrey',
        height: taskHeight-15,
    },
    parentTaskNonEditable: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        backgroundColor: 'lightgrey',
        height: taskHeight-15,
    },
    task: {
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        height: taskHeight-15,
    },
    completedTask: {
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        backgroundColor: '#f5f2f2',
        height: taskHeight-15,
    },
    completedTaskText: {
        textDecorationLine: 'line-through',
        color: 'grey',
    },
    newTask: {
        flexDirection: 'row',
        alignItems: 'center',
        height: taskHeight-15,
    },
    newTaskInput: {
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'dashed',
        flex: 1,
        height: taskHeight-16,
    },
    newTaskButton: {
        color: 'black',
        padding: 3,
        ...Platform.select({
            web: {
                cursor: 'pointer',
            },
        }),
    },
    simpleTask: {
        borderBottomWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        flexDirection: 'row',
        height: taskHeight-15,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    checkbox: {
        marginRight: 5,
    },
    completeTaskButton: {
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        backgroundColor: 'green',
        height: taskHeight-15,
    },
    completeTaskButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    uncompleteTaskButton: {
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        backgroundColor: 'red',
        height: taskHeight-15,
    },
});
