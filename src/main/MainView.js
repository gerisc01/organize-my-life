import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getCollection, getTasks } from "../api/helpers";
import CategoryMainView from "../tasks/CategoryMainView";
import GoalsHeaderView from "../goals/GoalsHeaderView";
import GoalsMainView from "../goals/GoalsMainView";

const MainView = () => {
    const [collection, setCollection] = useState({});
    const [tasks, setTasks] = useState({});
    const [mainContentView, setMainContentView] = useState('tasks');
    const lastSelectedTask = React.useRef(null);

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
        return tasks[lastSelectedTask.current] || null;
    }

    const onLastSelectedTaskChanged = (lastTaskId) => {
        if (lastSelectedTask.current !== lastTaskId) {
            lastSelectedTask.current = lastTaskId;
        }
    };

    const toggleMainContent = () => {
        setMainContentView(prevView => prevView === 'tasks' ? 'goals' : 'tasks');
    }

    return (<View style={styles.homeScreen}>
        <View style={styles.bigGoals}>
            <GoalsHeaderView collection={collection} tasks={tasks} toggleGoalDetails={toggleMainContent} getLastSelectedTask={getLastSelectedTask} />
        </View>
        <View style={styles.mainInfo}>
            {mainContentView === 'goals' && <GoalsMainView collection={collection} tasks={tasks} refreshTasks={() => refreshTasks()} />}
            {mainContentView === 'tasks' && <CategoryMainView collection={collection} tasks={tasks}
                      refreshTasks={() => refreshTasks()} onLastSelectedTaskChanged={onLastSelectedTaskChanged} />}
        </View>
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

export default MainView;
