import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Category } from "../common/Category";
import {
    createTask, deleteTask,
    getCategories,
    getCollection,
    getSavedPriorityCategories,
    getTasks,
    updateCategory,
    updateTask
} from "../api/tasks";
import BigGoals from "./BigGoals";

const MainView = () => {
    const [tasks, setTasks] = useState({});
    const [collection, setCollection] = useState({});
    const [categories, setCategories] = useState({});
    const [priorities, setPriorities] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTasks, setSelectedTasks] = useState([]);

    useEffect(() => {
        getCollection().then(data => setCollection(data || {}));
    }, []);

    useEffect(() => {
        if (collection.id) {
            getTasks(collection).then(data => setTasks(data || {}));
            getCategories(collection).then(data => setCategories(data || {}));
            getSavedPriorityCategories(collection).then(data => setPriorities(data || []));
        }
    }, [collection]);

    const unselectTasks = (unselectAll) => {
        if (unselectAll) {
            setSelectedTasks([]);
            setSelectedCategory(null);
        } else {
            const newSelectedTasks = [...selectedTasks];
            newSelectedTasks.pop();
            setSelectedTasks(newSelectedTasks);
            if (newSelectedTasks.length === 0) {
                setSelectedCategory(null);
            }
        }
    }

    const selectTask = (categoryId, taskId) => {
        const newSelectedTasks = [...selectedTasks];
        newSelectedTasks.push(taskId);
        setSelectedTasks(newSelectedTasks);

        setSelectedCategory(categoryId);
    }

    const addTask = async (categoryId, task, parentTask) => {
        // Make the new task object
        const newTask = {name: task}
        const createdTask = await createTask(newTask);
        // If the task has a parent, add it to the parent
        if (parentTask) {
            const parent = tasks[parentTask];
            if (!parent.children) parent.children = [];
            parent.children.push(createdTask.id);
            await updateTask(parent);
        } else {
            // Update the category if it wasn't a parent
            const category = categories[categoryId];
            if (!category.items) category.items = [];
            category.items.push(createdTask.id);
            await updateCategory(category);
        }
        getTasks(collection).then(data => setTasks(data || {}));
        if (!parentTask) getCategories(collection).then(data => setCategories(data || {}));
    }

    const editTask = async (taskId, newName) => {
        const newTask = {...tasks[taskId], name: newName}
        await updateTask(newTask);
        getTasks(collection).then(data => setTasks(data || {}));
    }

    const toggleTaskCompletion = async (taskId) => {
        const newTask = {...tasks[taskId], completed: !tasks[taskId].completed}
        await updateTask(newTask);
        getTasks(collection).then(data => setTasks(data || {}));
    }

    const removeTask = async (task) => {
        if (selectedTasks.length > 0 && selectedTasks.includes(task.id)) {
            // Remove the task from any parents
            for (const taskId of Object.keys(tasks)) {
                const selectedTask = tasks[taskId];
                if (selectedTask && selectedTask.children) {
                    if (selectedTask.children.includes(task.id)) {
                        selectedTask.children = selectedTask.children.filter(childId => childId !== task.id);
                        await updateTask(selectedTask);
                    }
                }
            }
            // Remove the task from the selected tasks
            const newSelectedTasks = selectedTasks.filter(taskId => taskId !== task.id);
            setSelectedTasks(newSelectedTasks);
        }
        // Remove the task from any categories
        for (const categoryId of Object.keys(categories)) {
            const category = categories[categoryId];
            if (category && category.items && category.items.includes(task.id)) {
                category.items = category.items.filter(taskId => taskId !== task.id);
                await updateCategory(category);
            }
        }
        await deleteTask(task);
        getTasks(collection).then(data => setTasks(data || {}));
    }

    const reorderTasks = async (id, fromIndex, toIndex) => {
        if (selectedTasks.length > 0) {
            const newTasks = {...tasks};
            const lastTaskId = selectedTasks[selectedTasks.length - 1];
            const lastTask = newTasks[lastTaskId];
            if (!lastTask.children) return;
            const newChildren = [...lastTask.children];
            const movedChild = newChildren.splice(fromIndex, 1)[0];
            newChildren.splice(toIndex, 0, movedChild);
            lastTask.children = newChildren;
            await updateTask(lastTask);
            getTasks(collection).then(data => setTasks(data || {}));
        } else {
            const newCategory = {...categories[id]};
            const items = newCategory.items;
            const movedTask = items.splice(fromIndex, 1)[0];
            items.splice(toIndex, 0, movedTask);
            newCategory.items = items;
            await updateCategory(newCategory);
            getCategories(collection).then(data => setCategories(data || {}));
        }
    }

    const getCurrentTasks = (categoryId) => {
        if (selectedTasks.length > 0) {
            const lastTaskId = selectedTasks[selectedTasks.length - 1];
            const lastTask = tasks[lastTaskId];
            if (!lastTask.children) return [];
            return lastTask.children.map(taskId => tasks[taskId]);
        } else {
            const category = categories[categoryId];
            if (!category) return [];
            return category.items?.map(taskId => tasks[taskId]) || [];
        }
    }

    if (selectedTasks.length > 0) {
        const category = categories[selectedCategory];
        if (!category) return null;
        const parentTasks = selectedTasks?.map(taskId => tasks[taskId]) || [];
        const lastParentId = selectedTasks[selectedTasks.length - 1];
        return (
            <View style={styles.homeScreen}>
                    <Category key={category.id} category={category} unselectTasks={unselectTasks}
                          tasks={getCurrentTasks(category.id)} parentTasks={parentTasks}
                          selectTask={selectTask} reorderTasks={reorderTasks}
                              addTask={(name) => addTask(category.id, name, lastParentId)}
                              editTask={(taskId, name) => editTask(taskId, name)}
                              removeTask={(task) => removeTask(task)}
                              toggleTaskCompletion={(taskId) => toggleTaskCompletion(taskId)}
                    />
            </View>
        );
    } else {
        return (
            <View style={styles.homeScreen}>
                <View style={styles.bigGoals}>
                    <BigGoals />
                </View>
                <View style={styles.mainInfo}>
                    {
                        priorities.map(categoryId => {
                            const category = categories[categoryId];
                            if (!category) return null;
                            return (<Category key={categoryId} category={category} tasks={getCurrentTasks(category.id)}
                                              selectTask={selectTask} reorderTasks={reorderTasks}
                                              addTask={(name) => addTask(categoryId, name)}
                                              editTask={(taskId, name) => editTask(taskId, name)}
                                              removeTask={(task) => removeTask(task)}
                                              toggleTaskCompletion={(taskId) => toggleTaskCompletion(taskId)}
                            />);
                        })
                    }
                </View>
            </View>
        );
    }
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
