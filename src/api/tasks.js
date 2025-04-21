import axios from "axios";
import {loadObject, listCollectionItems, createObject, updateObject, deleteObject} from "./ListsApi";

// const tasks = {
//     '1': {'id': '1', 'name': 'Make Organization Site', 'completed': false, 'children': ['5', '6', '7']},
//     '2': {'id': '2', 'name': 'Make Personal Site', 'completed': false},
//     '3': {'id': '3', 'name': 'Finish Scoreboard', 'completed': false},
//     '4': {'id': '4', 'name': 'Sayonara Wild Hearts', 'completed': false},
//     '5': {'id': '5', 'name': 'Make Front End Components', 'completed': false},
//     '6': {'id': '6', 'name': 'Build API', 'completed': false},
//     '7': {'id': '7', 'name': 'Release to Raspberry Pi', 'completed': false},
// };

export const getCollection = async () => {
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
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

export const deleteTask = async (task) => {
    return await deleteObject('items', task);
}

export const getCategories = async (collection) => {
    const collectionLists = collection?.lists;
    if (!collectionLists || collectionLists.length === 0) {
        throw new Error("No lists found");
    }
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

export const updateCategory = async (category) => {
    return await updateObject('lists', category);
}

export const getSavedPriorityCategories = async (collection) => {
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
