const express = require('express');
const router = express.Router();
const multer = require('multer');
const { SpeechClient } = require('@google-cloud/speech');

const upload = multer({ storage: multer.memoryStorage() });
const speechClient = new SpeechClient();

router.post('/transcribe', upload.single('audio'), async (req, res) => {
    const audioBytes = req.file.buffer.toString('base64');

    const audio = {
        content: audioBytes,
    };
    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US', // need to later dynamically set to the target language
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
        res.send({ transcription });
    } catch (error) {
        console.error('Failed to transcribe audio:', error);
        res.status(500).send('Failed to transcribe audio');
    }
});

module.exports = router;
