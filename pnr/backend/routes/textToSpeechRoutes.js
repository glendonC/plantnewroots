const express = require('express');
const router = express.Router();
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const client = new TextToSpeechClient();

router.post('/synthesize', async (req, res) => {
    const { text, language } = req.body;

    const languageCodeMap = {
        'English': 'en-US',
        'Chinese (Mandarin, China)': 'zh-CN',
        'Chinese (Mandarin, Taiwan)': 'zh-TW',
    };
    
    const voiceLanguageCode = languageCodeMap[language] || 'en-US';

    const request = {
        input: { text },
        voice: { languageCode: voiceLanguageCode, ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        const [response] = await client.synthesizeSpeech(request);
        const audioContent = response.audioContent;
        const audioBase64 = audioContent.toString('base64');
        res.send({ audioBase64 });
    } catch (error) {
        console.error('Error at text-to-speech synthesis:', error);
        res.status(500).send('Failed to synthesize speech');
    }
});

module.exports = router;


module.exports = router;
