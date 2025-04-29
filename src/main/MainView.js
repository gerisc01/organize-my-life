import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getCollection, getTasks } from "../api/helpers";
import CategoryMainView from "../tasks/CategoryMainView";
import GoalsMainView from "../goals/GoalsMainView";

const MainView = () => {
    const [collection, setCollection] = useState({});
    const [tasks, setTasks] = useState({});

    useEffect(() => {
        getCollection().then(data => setCollection(data || {}));
    }, []);

    useEffect(() => {
        if (collection.id) getTasks(collection).then(data => setTasks(data || {}));
    }, [collection]);

    const refreshTasks = () => {
        getTasks(collection).then(data => setTasks(data || {}));
    }

    return (<View style={styles.homeScreen}>
        <View style={styles.bigGoals}>
            <GoalsMainView collection={collection} tasks={tasks} />
        </View>
        <View style={styles.mainInfo}>
            <CategoryMainView collection={collection} tasks={tasks} refreshTasks={() => refreshTasks()} />
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
