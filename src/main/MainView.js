import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {getCategory, getCollection, getTasks} from "../api/helpers";
import CategoryView from "../tasks/CategoryView";
import GoalsHeaderView from "../goals/GoalsHeaderView";
import GoalsView from "../goals/GoalsView";
import {useSharedValue} from "react-native-reanimated";
import {padGoals} from "../goals/helpers";

const MainView = () => {
    const [collection, setCollection] = useState({});
    const [tasks, setTasks] = useState({});
    const [mainContentView, setMainContentView] = useState('tasks');
    const [goalCategory, setGoalCategory] = useState(null);

    useEffect(() => {
        getCollection().then(data => setCollection(data || {}));
    }, []);

    useEffect(() => {
        if (collection.id) {
            getTasks(collection).then(data => setTasks(data || {}));
            getGoalCategory().then(category => setGoalCategory(category));
        }
    }, [collection]);

    const refreshTasks = () => {
        getTasks(collection).then(data => setTasks(data || {}));
    }

    const refreshGoals = () => {
        getGoalCategory().then(category => {
            setGoalCategory(category);
        });
    }

    const toggleMainContent = () => {
        setMainContentView(prevView => prevView === 'tasks' ? 'goals' : 'tasks');
    }

    const getGoalCategory = async () => {
        const goalCategoryId = collection?.attributes?.big_goals || null;
        return goalCategoryId
            ? await getCategory(goalCategoryId)
            : null;
    }

    return (<View style={styles.homeScreen}>
        <View style={styles.bigGoals}>
            <GoalsHeaderView collection={collection} tasks={tasks} goalCategory={goalCategory} toggleGoalDetails={toggleMainContent} />
        </View>
        <View style={styles.mainInfo}>
            {mainContentView === 'goals' && <GoalsView collection={collection} tasks={tasks} goalCategory={goalCategory}
                                                       refreshTasks={() => refreshTasks()} refreshGoals={() => refreshGoals()} />}
            {mainContentView === 'tasks' && <CategoryView collection={collection} tasks={tasks} refreshTasks={() => refreshTasks()}/>}
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
