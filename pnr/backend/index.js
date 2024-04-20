require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const dialogRoutes = require('./routes/dialogRoutes');
const conversationRoutes = require('./routes/writingConversationRoutes');
const writingAnalysisRoutes = require('./routes/writingAnalysisRoutes');
const textToSpeechRoutes = require('./routes/textToSpeechRoutes');
const speechToTextRoutes = require('./routes/speechToTextRoutes');
const readingSessionRoutes = require('./routes/readingSessionRoutes'); 
const readingAnalysisRoutes = require('./routes/readingAnalysisRoutes');

const app = express();

app.use(express.json());

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/users', userRoutes);
app.use('/api/dialog', dialogRoutes);
app.use('/api/writingConversations', conversationRoutes);
app.use('/api/analysis', writingAnalysisRoutes);
app.use('/api/text-to-speech', textToSpeechRoutes);
app.use('/api/speech-to-text', speechToTextRoutes);
app.use('/api/reading-sessions', readingSessionRoutes);
app.use('/api/reading-analysis', readingAnalysisRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
