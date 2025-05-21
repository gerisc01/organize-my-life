import React, { useEffect, useState } from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import { getCollection, getTasks } from "../api/helpers";
import CategoryView from "../tasks/CategoryView";
import GoalsView from "../goals/GoalsView";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {useSharedValue} from "react-native-reanimated";

const PhoneView = () => {
    const [collection, setCollection] = useState({});
    const [tasks, setTasks] = useState({});
    const [contentView, setContentView] = useState('tasks');
    const lastSelectedTask = useSharedValue(null);

    const swipeGesture = Gesture.Pan()
        .activeOffsetX([-50, 50]) // Only trigger after 50px horizontal movement
        .onEnd((event) => {
            if (Math.abs(event.velocityX) > 500) { // Only trigger on faster swipes
                if (event.velocityX > 0) {
                    setContentView('tasks');
                } else {
                    setContentView('goals');
                }
            }
        });

    useEffect(() => {
        getCollection().then(data => setCollection(data || {}));
    }, []);

    useEffect(() => {
        if (collection.id) getTasks(collection).then(data => setTasks(data || {}));
    }, [collection]);

    const refreshTasks = () => {
        getTasks(collection).then(data => setTasks(data || {}));
    }

    const getLastSelectedTask = () => {
        return tasks[lastSelectedTask.value] || null;
    }

    const onLastSelectedTaskChanged = (lastTaskId) => {
        if (lastSelectedTask.value !== lastTaskId) {
            lastSelectedTask.value = lastTaskId;
        }
    };

    const toggleMainContent = () => {
        setContentView(prevView => prevView === 'tasks' ? 'goals' : 'tasks');
    }

    return (<View style={styles.homeScreen}>
        <GestureDetector gesture={swipeGesture}>
            <View style={styles.homeScreen}>
                {contentView === 'goals' && (
                    <GoalsView phoneView={true} collection={collection} tasks={tasks}
                               refreshTasks={() => refreshTasks()}
                               getLastSelectedTask={getLastSelectedTask}
                               onLastSelectedTaskChanged={onLastSelectedTaskChanged}/>
                )}
                {contentView === 'tasks' && (
                    <CategoryView phoneView={true} collection={collection} tasks={tasks}
                                  refreshTasks={() => refreshTasks()} onLastSelectedTaskChanged={onLastSelectedTaskChanged} />
                )}
            </View>
        </GestureDetector>
    </View>)
}

const styles = StyleSheet.create({
    homeScreen: {
        flex: 1,
        flexDirection: 'column',
    },
    bigGoals: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        margin: 10,
    },
    mainInfo: {
        flex: 9,
        padding: 10,
        flexDirection: 'row',
    }
});

export default PhoneView;
