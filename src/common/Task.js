import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

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
                <Task task={task} />
            </Animated.View>
        </GestureDetector>
    );
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
    task: {
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        height: taskHeight-15,
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
});
