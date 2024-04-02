const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const projectId = process.env.GOOGLE_PROJECT_ID;
const sessionId = uuid.v4();
const languageCode = 'en-US';

const sessionClient = new dialogflow.SessionsClient({
    projectId: projectId,
});

async function sendToDialogflow(text) {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: text,
                languageCode: languageCode,
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        console.log(`Query: ${result.queryText}`);
        console.log(`Response: ${result.fulfillmentText}`);
        return result;
    } catch (error) {
        console.error('Dialogflow API error: ', error);
        throw error;
    }
}

module.exports = { sendToDialogflow };
