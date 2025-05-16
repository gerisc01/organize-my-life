import axios from 'axios';
import {getSessionApiKey} from "../login/Auth";

const serverLocation = process.env.EXPO_PUBLIC_API_URL;

const defaultHeaders = async() => {
    const apiKey = await getSessionApiKey();
    return {
        headers: {
            'ACCOUNT_ID': apiKey
        }
    }
}

export const listObjects = async (type) => {
    try {
        const uri = `${serverLocation}/api/${type}`;
        const headers = await defaultHeaders();
        const response =  await axios.get(uri, headers);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const loadObject = async (type, id) => {
    try {
        const uri = `${serverLocation}/api/${type}/${id}`;
        const headers = await defaultHeaders();
        const response =  await axios.get(uri, headers);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const createObject = async (type, object) => {
    try {
        const uri = `${serverLocation}/api/${type}`;
        const headers = await defaultHeaders();
        const response = await axios.post(uri, object, headers);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const updateObject = async (type, object) => {
    try {
        const uri = `${serverLocation}/api/${type}/${object.id}`;
        const headers = await defaultHeaders();
        const response = await axios.put(uri, object, headers);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const deleteObject = async (type, object, subType, subObject) => {
    let uri;
    if (!subType && !subObject) {
        uri = `${serverLocation}/api/${type}/${object.id}`;
    } else if (subType && subObject) {
        uri = `${serverLocation}/api/${type}/${object.id}/${subType}/${subObject.id}`;
    } else {
        throw new Error('Invalid number of arguments');
    }

    try {
        const headers = await defaultHeaders();
        const response = await axios.delete(uri, headers);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const executeAction = async (actionId, body) => {
    const uri = `${serverLocation}/api/actions/${actionId}`;
    try {
        const headers = await defaultHeaders();
        const response = await axios.post(uri, body, headers);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const executeAdHocAction = async (actionId, body) => {
    const uri = `${serverLocation}/api/actions/ad-hoc/${actionId}`;
    try {
        const headers = await defaultHeaders();
        const response = await axios.post(uri, body, headers);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const listCollectionItems = async (id) => {
    const uri = `${serverLocation}/api/collections/${id}/listItems`;
    try {
        const headers = await defaultHeaders();
        const response = await axios.get(uri, headers);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}
