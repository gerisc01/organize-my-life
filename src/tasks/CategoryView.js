import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React, {useEffect, useState} from "react";
import {
    getCategories,
    getDefaultSelectedCategories,
    getTasks, reorderCategoryItems,
    reorderTaskChildren,
    updateCategory,
    updateTask
} from "../api/helpers";
import {Category} from "./Category";
import {
    createNewTask, deleteAndRemoveTask,
    editExistingTask, getCategoryTasks, getChildrenTasks,
    getCurrentTasks,
    getLastSelectedTask,
    removeTaskFromAllParents, updateTaskCompletion
} from "./helpers";

const CategoryView = ({ collection, tasks, refreshTasks, onLastSelectedTaskChanged, phoneView, readOnly }) => {
    const [categories, setCategories] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTasks, setSelectedTasks] = useState([]);

    useEffect(() => {
        if (collection.id) {
            getCategories(collection).then(data => setCategories(data || {}));
            getDefaultSelectedCategories(collection).then(data => setSelectedCategories(data || []));
        }
    }, [collection]);

    const selectTask = (categoryId, taskId) => {
        const newSelectedTasks = [...selectedTasks];
        newSelectedTasks.push(taskId);
        setSelectedTasks(newSelectedTasks);
        onLastSelectedTaskChanged(taskId);

        setSelectedCategory(categoryId);
    }

    const unselectTasks = (unselectAll) => {
        if (unselectAll) {
            setSelectedTasks([]);
            setSelectedCategory(null);
            onLastSelectedTaskChanged(null);
        } else {
            const newSelectedTasks = [...selectedTasks];
            newSelectedTasks.pop();
            setSelectedTasks(newSelectedTasks);
            if (newSelectedTasks.length === 0) {
                setSelectedCategory(null);
            }
            onLastSelectedTaskChanged(getLastSelectedTask(newSelectedTasks, tasks));
        }
    }

    const newTask = async (categoryId, taskName) => {
        const parentTask = getLastSelectedTask(selectedTasks, tasks);
        await createNewTask(categories[categoryId], taskName, parentTask);
        refreshTasks();
        if (!parentTask) getCategories(collection).then(data => setCategories(data || {}));
    }

    const editTask = async (taskId, newName) => {
        await editExistingTask(tasks[taskId], newName);
        refreshTasks();
    }

    const deleteTask = async (taskId) => {
        const task = tasks[taskId];
        await deleteAndRemoveTask(task, categories, tasks);
        // Remove the task from the selected tasks
        const newSelectedTasks = selectedTasks.filter(selectedId => selectedId !== taskId);
        setSelectedTasks(newSelectedTasks);
        refreshTasks();
    }

    const reorderTasks = async (id, fromIndex, toIndex) => {
        if (selectedTasks.length > 0) {
            await reorderTaskChildren(getLastSelectedTask(selectedTasks, tasks), fromIndex, toIndex);
            refreshTasks();
        } else {
            const category = categories[id];
            await reorderCategoryItems(category, fromIndex, toIndex);
            getCategories(collection).then(data => setCategories(data || {}));
        }
    }

    const toggleTaskCompletion = async (taskId) => {
        await updateTaskCompletion(tasks[taskId]);
        refreshTasks();
    }

    const generateProps = (category) => {
        const parentTask = getLastSelectedTask(selectedTasks, tasks);
        return {
            readOnly: !!readOnly,
            category: category,
            tasks: parentTask ? getChildrenTasks(parentTask, tasks) : getCategoryTasks(category, tasks),
            parentTasks: parentTask ? selectedTasks.map(selectedId => tasks[selectedId]) : null,
            selectTask: selectTask,
            unselectTasks: unselectTasks,
            reorderTasks: reorderTasks,
            newTask: (name) => newTask(category.id, name),
            editTask: (taskId, name) => editTask(taskId, name),
            deleteAndRemoveTask: (taskId) => deleteTask(taskId),
            toggleTaskCompletion: (taskId) => toggleTaskCompletion(taskId),
            selectCategory: (categoryId) => setSelectedCategory(categoryId),
        }
    }

    if (phoneView) {
        return <CategoryPhoneView categories={categories} selectedCategory={selectedCategory} selectCategory={setSelectedCategory}
                                 selectedTasks={selectedTasks} generateProps={generateProps} />
    } else {
        return <CategoryMainView categories={categories} selectedCategory={selectedCategory} selectedCategories={selectedCategories}
            selectedTasks={selectedTasks} generateProps={generateProps} />
    }
}

const CategoryMainView = ({ categories, selectedCategory, selectedCategories, selectedTasks, generateProps }) => {
    if (selectedTasks?.length > 0) {
        const category = categories[selectedCategory];
        if (!category) return null;
        return (<View style={styles.container}>
            <Category key={category.id} {...generateProps(category)} />
        </View>)
    } else {
        return (<View style={styles.container}>{
            selectedCategories.map(categoryId => {
                const category = categories[categoryId];
                if (!category) return null;
                return (<Category key={categoryId} {...generateProps(category)} />);
            })
        }</View>)
    }
}

const CategoryPhoneView = ({ categories, selectCategory, selectedCategory, selectedTasks, generateProps }) => {
    const category = categories[selectedCategory];
    if (!category) {
        return (<CategorySelector categories={categories} selectCategory={selectCategory} />)
    } else {
        return (<View style={styles.container}>
            <Category key={category.id} {...generateProps(category)} />
        </View>)
    }
}

const CategorySelector = ({ categories, selectCategory }) => {
    return (<View style={styles.selectorContainer}>
        {Object.keys(categories).map((categoryId) => {
            return (
                <Pressable style={styles.categoryButton} key={categoryId} onPress={() => selectCategory(categoryId)}>
                    <Text style={styles.defaultText}>{categories[categoryId]?.name}</Text>
                </Pressable>
            )
        })}
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
    },
    selectorContainer: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
    },
    categoryButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    defaultText: {
        color: 'black',
        fontSize: 20,
    }
});


export default CategoryView;
