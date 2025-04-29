import {addChildToTask, addTaskToCategory, createTask, deleteTask, updateCategory, updateTask} from "../api/helpers";

export const getLastSelectedTask = (selectedTasks, tasks) => {
    if (selectedTasks.length > 0) {
        const lastTaskId = selectedTasks[selectedTasks.length - 1];
        return tasks[lastTaskId];
    }
    return null;
}

export const getCategoryTasks = (category, tasks) => {
    if (!category || !category.items) return [];
    return category.items.map(taskId => tasks[taskId]);
}

export const getChildrenTasks = (parentTask, tasks) => {
    if (!parentTask || !parentTask.children) return [];
    return parentTask.children.map(taskId => tasks[taskId]);
}

export const createNewTask = async (category, taskName, parentTask) => {
    // Make the new task object
    const newTask = {name: taskName}
    const createdTask = await createTask(newTask);
    // Update the related object (category or parent task)
    parentTask
        ? await addChildToTask(parentTask, createdTask)
        : await addTaskToCategory(category, createdTask);
}

export const editExistingTask = async (task, taskName) => {
    const newTask = {...task, name: taskName}
    await updateTask(newTask);
}

export const deleteAndRemoveTask = async (task, categories, tasks) => {
    await removeTaskFromAllParents(task, tasks);
    await removeTaskFromAllCategories(task, categories);
    await deleteTask(task);
}

export const updateTaskCompletion = async (task) => {
    const updatedTask = {...task, completed: !task.completed};
    await updateTask(updatedTask);
}

export const removeTaskFromAllParents = async (task, tasks) => {
    for (const taskId of Object.keys(tasks)) {
        const selectedTask = tasks[taskId];
        if (selectedTask && selectedTask.children) {
            if (selectedTask.children.includes(task.id)) {
                selectedTask.children = selectedTask.children.filter(childId => childId !== task.id);
                await updateTask(selectedTask);
            }
        }
    }
}

export const removeTaskFromAllCategories = async (task, categories) => {
    for (const categoryId of Object.keys(categories)) {
        const category = categories[categoryId];
        if (category && category.items && category.items.includes(task.id)) {
            category.items = category.items.filter(taskId => taskId !== task.id);
            await updateCategory(category);
        }
    }
}

