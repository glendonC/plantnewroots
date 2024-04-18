require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS module
const userRoutes = require('./routes/userRoutes');
const dialogRoutes = require('./routes/dialogRoutes');
const writingConversationRoutes = require('./routes/writingConversationRoutes');
const writingAnalysisRoutes = require('./routes/writingAnalysisRoutes');
const readingAnalysisRoutes = require('./routes/readingAnalysisRoutes');
const textToSpeechRoutes = require('./routes/textToSpeechRoutes');
const speechToTextRoutes = require('./routes/speechToTextRoutes');
const readingSessionRoutes = require('./routes/readingSessionRoutes');

const app = express();

app.use(cors()); // Use CORS middleware
app.use(express.json());


// MongoDB connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/users', userRoutes);
app.use('/api/dialog', dialogRoutes);
app.use('/api/writingConversations', writingConversationRoutes);
app.use('/api/writingAnalysis', writingAnalysisRoutes);
app.use('/api/readingAnalysis', readingAnalysisRoutes);
app.use('/api/readingSessions', readingSessionRoutes);
app.use('/api/text-to-speech', textToSpeechRoutes);
app.use('/api/speech-to-text', speechToTextRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
