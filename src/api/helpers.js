import axios from "axios";
import {loadObject, listCollectionItems, createObject, updateObject, deleteObject} from "./ListsApi";
import {getSessionApiKey} from '../login/Auth'
import {getWeeklyGoalsId} from "../goals/helpers";

/******************************************************************************
 Collections
******************************************************************************/

export const getCollection = async () => {
    // Fetch the account and then get the collection based on the id
    // stored in that account response.
    const apiKey = await getSessionApiKey();
    try {
        const accountResp = await loadObject('accounts', apiKey);
        const collections = accountResp?.collections;
        if (!collections || collections.length === 0) {
            throw new Error("No collections found");
        }
        return await loadObject('collections', collections[0]); // Cache the collection
    } catch (error) {
        throw new Error(`Failed to fetch collection: ${error}`);
    }
}

export const getDefaultSelectedCategories = async (collection) => {
    // Fake a promise so that the downstream code can be tested
    return new Promise((resolve) => {
        const lists = collection?.lists;
        if (!lists || lists.length === 0) {
            resolve([]);
        } else {
            resolve([lists[0], lists[2], lists[4]]);
        }
    });
}

/******************************************************************************
 Categories / Lists
******************************************************************************/

export const getCategories = async (collection) => {
    let collectionLists = collection?.lists;
    if (!collectionLists || collectionLists.length === 0) {
        throw new Error("No lists found");
    }
    // Add attribute listIds to the collectionLists
    const weeklyGoalsId = getWeeklyGoalsId(collection);
    if (weeklyGoalsId) collectionLists.push(weeklyGoalsId);
    // For each collection list call listsApiGet('lists', id)
    const categories = {};
    for (const listId of collectionLists) {
        const list = await loadObject('lists', listId);
        categories[listId] = {
            id: listId,
            name: list.name,
            items: list.items,
        };
    }
    return categories;
}

export const getCategory = async (id) => {
    return await loadObject('lists', id);
}

export const updateCategory = async (category) => {
    return await updateObject('lists', category);
}

export const addTaskToCategory = async (category, task) => {
    if (!category || !task) throw new Error("Category or task is missing");
    if (!category.items) category.items = [];
    if (category.items.includes(task.id)) throw new Error("Task already exists in category");
    category.items = [...category.items, task.id];
    return await updateObject('lists', category);
}

export const removeTaskFromCategory = async (category, task) => {
    if (!category || !task) throw new Error("Category or task is missing");
    if (!category.items) category.items = [];
    category.items = [...category.items].filter(itemId => itemId !== task.id);
    return await updateObject('lists', category);
}

export const reorderCategoryItems = async (category, fromIndex, toIndex) => {
    const updatedCategory = { ...category };
    if (!updatedCategory.items) throw new Error("Cannot reorder tasks without items");
    const movedTask = updatedCategory.items.splice(fromIndex, 1)[0];
    updatedCategory.items.splice(toIndex, 0, movedTask);
    await updateObject('lists', updatedCategory);
}


/******************************************************************************
 Tasks / Items
******************************************************************************/

export const getTasks = async (collection) => {
    if (!collection || !collection.id) {
        throw new Error("No collection found");
    }
    const collectionItems = await listCollectionItems(collection.id);
    // Returns as a list of lists, convert to an object with id as key
    const tasks = {};
    for (const item of collectionItems) {
        tasks[item.id] = item;
    }
    return tasks;
}

export const createTask = async (task) => {
    return await createObject('items', task);
}

export const updateTask = async (task) => {
    return await updateObject('items', task);
}

export const addChildToTask = async (parentTask, childTask) => {
    if (!parentTask || !childTask) throw new Error("Parent or child task is missing");
    if (!parentTask.children) parentTask.children = [];
    parentTask.children.push(childTask.id);
    return await updateObject('items', parentTask);
}

export const reorderTaskChildren = async (parentTask, fromIndex, toIndex) => {
    const updatedParent = { ...parentTask };
    if (!updatedParent.children) throw new Error("Cannot reorder tasks without children");
    const newChildren = [...updatedParent.children];
    const movedChild = newChildren.splice(fromIndex, 1)[0];
    newChildren.splice(toIndex, 0, movedChild);
    updatedParent.children = newChildren;
    await updateTask(updatedParent);
}

export const deleteTask = async (task) => {
    return await deleteObject('items', task);
}
