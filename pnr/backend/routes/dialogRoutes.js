const express = require('express');
const router = express.Router();
const { sendToDialogflow } = require('../dialogflowAgent');

router.post('/daily', async (req, res) => {
    try {
        const { message } = req.body;
        const dialogflowResponse = await sendToDialogflow(message);
        res.json({ reply: dialogflowResponse.fulfillmentText });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.error('Dialogflow route error: ', error);
    }
});


module.exports = router;
