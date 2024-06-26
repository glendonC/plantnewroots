require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const updateProfileRoutes = require('./routes/updateProfileRoute');
const dialogRoutes = require('./routes/dialogRoutes');
const conversationRoutes = require('./routes/writingConversationRoutes');
const writingAnalysisRoutes = require('./routes/writingAnalysisRoutes');
const textToSpeechRoutes = require('./routes/textToSpeechRoutes');
const speechToTextRoutes = require('./routes/speechToTextRoutes');
const readingSessionRoutes = require('./routes/readingSessionRoutes'); 
const readingAnalysisRoutes = require('./routes/readingAnalysisRoutes');
const listeningSessionRoutes = require('./routes/listeningSessionRoutes');
const listeningAnalysisRoutes = require('./routes/listeningAnalysisRoutes');
const speakingSessionRoutes = require('./routes/speakingSessionRoutes');
const speakingAnalysisRoutes = require('./routes/speakingAnalysisRoutes');
const statsRoutes = require('./routes/statsRoutes');


const app = express();

app.use(express.json());

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/users', userRoutes);
app.use('/api/users', updateProfileRoutes);
app.use('/api/dialog', dialogRoutes);
app.use('/api/writingConversations', conversationRoutes);
app.use('/api/analysis', writingAnalysisRoutes);
app.use('/api/text-to-speech', textToSpeechRoutes);
app.use('/api/speech-to-text', speechToTextRoutes);
app.use('/api/reading-sessions', readingSessionRoutes);
app.use('/api/reading-analysis', readingAnalysisRoutes);
app.use('/api/listening-sessions', listeningSessionRoutes);
app.use('/api/listening-analysis', listeningAnalysisRoutes);
app.use('/api/speaking-sessions', speakingSessionRoutes);
app.use('/api/speaking-analysis', speakingAnalysisRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
