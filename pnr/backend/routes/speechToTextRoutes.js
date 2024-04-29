const express = require('express');
const router = express.Router();
const multer = require('multer');
const { SpeechClient } = require('@google-cloud/speech');

const upload = multer({ storage: multer.memoryStorage() });
const speechClient = new SpeechClient();

router.post('/transcribe', upload.single('audio'), async (req, res) => {
    //console.log('Received language code:', req.body.language);
    const audioBytes = req.file.buffer.toString('base64');
    const languageCode = req.body.language || 'en-US';

    const audio = {
        content: audioBytes,
    };
    const config = {
        languageCode: languageCode,
    };
    const request = {
        audio: audio,
        config: config,
    };

    try {
        const [response] = await speechClient.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        res.json({ transcription });
    } catch (error) {
        console.error('Failed to transcribe audio:', error);
        res.status(500).json({ error: 'Failed to transcribe audio', details: error.message });
    }
});


module.exports = router;
