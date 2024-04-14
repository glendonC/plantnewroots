const express = require('express');
const router = express.Router();
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const client = new TextToSpeechClient();

router.post('/synthesize', async (req, res) => {
    const { text, language } = req.body;

    const voiceSettings = {
        'English': { code: 'en-US', voice: 'en-US-Wavenet-F', gender: 'FEMALE', rate: 1.0, pitch: 0 },
        'Chinese (Mandarin, China)': { code: 'zh-CN', voice: 'zh-CN-Wavenet-A', gender: 'FEMALE', rate: 0.9, pitch: 0 },
        'Chinese (Mandarin, Taiwan)': { code: 'zh-TW', voice: 'zh-TW-Wavenet-A', gender: 'FEMALE', rate: 0.9, pitch: 0 },
        'Korean': { code: 'ko-KR', voice: 'ko-KR-Wavenet-A', gender: 'FEMALE', rate: 0.9, pitch: 0 },
    };

    const settings = voiceSettings[language] || voiceSettings['English'];

    const request = {
        input: { text },
        voice: {
            languageCode: settings.code,
            name: settings.voice,
            ssmlGender: settings.gender,
        },
        audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: settings.rate,
            pitch: settings.pitch,
        },
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
