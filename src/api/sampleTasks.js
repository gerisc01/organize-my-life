import axios from "axios";
import {loadObject, listCollectionItems, createObject, updateObject} from "./ListsApi";

const tasks = {
    '1': {'id': '1', 'name': 'One', 'completed': false},
    '2': {'id': '2', 'name': 'Two', 'completed': false},
    '3': {'id': '3', 'name': 'Three', 'completed': false},
    '4': {'id': '4', 'name': 'Four', 'completed': false},
    '5': {'id': '5', 'name': 'Five', 'completed': false},
    '6': {'id': '6', 'name': 'Six', 'completed': false},
    '7': {'id': '7', 'name': 'Seven', 'completed': false},
    '8': {'id': '8', 'name': 'Eight', 'completed': false},
    '9': {'id': '9', 'name': 'Nine', 'completed': false},
    '10': {'id': '10', 'name': 'Ten', 'completed': false},
    '11': {'id': '11', 'name': 'Eleven', 'completed': false},
    '12': {'id': '12', 'name': 'Twelve', 'completed': false},
    '13': {'id': '13', 'name': 'Thirteen', 'completed': false},
    '14': {'id': '14', 'name': 'Fourteen', 'completed': false},
    '15': {'id': '15', 'name': 'Fifteen', 'completed': false},
    '16': {'id': '16', 'name': 'Sixteen', 'completed': false},
    '17': {'id': '17', 'name': 'Seventeen', 'completed': false},
    '18': {'id': '18', 'name': 'Eighteen', 'completed': false},
    '19': {'id': '19', 'name': 'Nineteen', 'completed': false},
    '20': {'id': '20', 'name': 'Twenty', 'completed': false},
    '21': {'id': '21', 'name': 'Twenty One', 'completed': false},
    '22': {'id': '22', 'name': 'Twenty Two', 'completed': false},
    '23': {'id': '23', 'name': 'Twenty Three', 'completed': false},
    '24': {'id': '24', 'name': 'Twenty Four', 'completed': false},
    '25': {'id': '25', 'name': 'Twenty Five', 'completed': false},
    '26': {'id': '26', 'name': 'Twenty Six', 'completed': false},
    '27': {'id': '27', 'name': 'Twenty Seven', 'completed': false},
    '28': {'id': '28', 'name': 'Twenty Eight', 'completed': false},
    '29': {'id': '29', 'name': 'Twenty Nine', 'completed': false},
};

const categories = {
    '1': {'id': '1', 'name': 'C1', 'items': Object.keys(tasks)},
    '2': {'id': '2', 'name': 'C2', 'items': []},
    '3': {'id': '3', 'name': 'C3', 'items': []},
    '4': {'id': '4', 'name': 'C4', 'items': []},
    '5': {'id': '5', 'name': 'C5', 'items': []},
};

export const getCollection = async () => {
    // Fake a promise so that the downstream code can be tested
    return new Promise((resolve) => {
        resolve({id: 'fake'});
    });
}

export const getTasks = async (collection) => {
    // Fake a promise so that the downstream code can be tested
    return new Promise((resolve) => {
        resolve(tasks);
    });
}

export const createTask = async (task) => {
    console.log("Creating task", task);
}

export const updateTask = async (task) => {
    console.log("Updating task", task);
}

export const getCategories = async (collection) => {
    // Fake a promise so that the downstream code can be tested
    return new Promise((resolve) => {
        resolve(categories);
    });
}

export const updateCategory = async (category) => {
    console.log("Updating list", category);
}

export const getSavedPriorityCategories = async (collection) => {
    // Fake a promise so that the downstream code can be tested
    return new Promise((resolve) => {
        resolve(['1','3','5']);
    });
}
