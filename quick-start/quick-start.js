const fs = require('fs').promises;
const path = require('path');

const BASE_URL = 'https://lists-app.com/api';
const ACCOUNT_NAME = 'Organize My Life - Scott Gerike'

async function makeRequest(url, method, body, accountId = null) {
    const headers = {
        'Content-Type': 'application/json',
        ...(accountId && { 'ACCOUNT_ID': accountId })
    };

    const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body)
    });

    return response.json();
}

async function processDirectory(dirName, accountId) {
    const directoryPath = path.join(__dirname, dirName);
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
        if (file.endsWith('.json')) {
            const fileContent = await fs.readFile(path.join(directoryPath, file), 'utf8');
            const jsonContent = JSON.parse(fileContent);

            await makeRequest(
                `${BASE_URL}/${dirName}`,
                'POST',
                jsonContent,
                accountId
            );
        }
    }
}

async function quickStart() {
    try {
        // Create account
        const accountResponse = await makeRequest(
            `${BASE_URL}/accounts`,
            'POST',
            { name: ACCOUNT_NAME }
        );

        const accountId = accountResponse.id;
        console.log("New account created with ID:", accountId);

        // Process each directory
        const directories = ['templates', 'lists', 'collections'];
        for (const dir of directories) {
            await processDirectory(dir, accountId);
        }

        console.log('Quick start completed successfully');
        console.log('Make sure everything works by making the final update call to the server\n');

        console.log('PUT ' + `${BASE_URL}/accounts/${accountId}`);
        console.log('Headers: {"Content-Type": "application/json", "ACCOUNT_ID": "' + accountId + '"}');
        console.log('Body: {"collections": ["65d6e46f-da97-4db4-a547-76fa4c927c48"]}');
    } catch (error) {
        console.error('Error during quick start:', error);
    }
}

quickStart();
