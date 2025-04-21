import axios from 'axios';

const apiKey = process.env.EXPO_PUBLIC_API_KEY;
const serverLocation = process.env.EXPO_PUBLIC_API_URL;
const options = {
    headers: {
        'ACCOUNT_ID': apiKey
    }
}

export const listObjects = async (type) => {
    try {
        const uri = `${serverLocation}/api/${type}`;
        const response =  await axios.get(uri, options);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const loadObject = async (type, id) => {
    try {
        const uri = `${serverLocation}/api/${type}/${id}`;
        const response =  await axios.get(uri, options);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const createObject = async (type, object) => {
    try {
        const uri = `${serverLocation}/api/${type}`;
        const response = await axios.post(uri, object, options);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const updateObject = async (type, object) => {
    try {
        const uri = `${serverLocation}/api/${type}/${object.id}`;
        const response = await axios.put(uri, object, options);
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
        const response = await axios.delete(uri, options);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const executeAction = async (actionId, body) => {
    const uri = `${serverLocation}/api/actions/${actionId}`;
    try {
        const response = await axios.post(uri, body, options);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const executeAdHocAction = async (actionId, body) => {
    const uri = `${serverLocation}/api/actions/ad-hoc/${actionId}`;
    try {
        const response = await axios.post(uri, body, options);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}

export const listCollectionItems = async (id) => {
    const uri = `${serverLocation}/api/collections/${id}/listItems`;
    try {
        const response = await axios.get(uri, options);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
}
