const SpeakingSession = require('../models/SpeakingSession');
const SpeakingAnalysis = require('../models/SpeakingAnalysis');
const { analyzeSentiment, analyzeText } = require('../services/sentimentAnalysisService');

exports.getSpeakingAnalyses = async (req, res) => {
    try {
        const analyses = await SpeakingAnalysis.find({});
        res.json(analyses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch speaking analyses', message: error.message });
    }
};

exports.getSpeakingAnalysisDetails = async (req, res) => {
    try {
      const { conversationId } = req.params;
      console.log('Fetching speaking session details for conversationId:', conversationId);
      
      const session = await SpeakingSession.findOne({ conversationId });
      
      if (!session) {
        console.log('Speaking session not found for conversationId:', conversationId);
        return res.status(404).json({ message: 'Speaking session not found' });
      }
  
      console.log('Speaking session found:', session);
      res.json(session);
    } catch (error) {
      console.error('Error fetching speaking session details:', error);
      res.status(500).json({ error: 'Failed to fetch speaking session details', message: error.message });
    }
  };

exports.fetchSpeakingAnalysis = async (req, res) => {
    try {
        const analysis = await SpeakingAnalysis.findOne({ conversationId: req.params.conversationId });
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }
        res.json(analysis);
    } catch (error) {
        console.error('Failed to fetch analysis:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

exports.saveSpeakingAnalysis = async (req, res) => {
    try {
        const { conversationId, transcript, responseText, generatedText } = req.body;
        let existingAnalysis = await SpeakingAnalysis.findOne({ conversationId });
        if (!existingAnalysis) {
            existingAnalysis = new SpeakingAnalysis({ conversationId, transcript, response: responseText, generatedText });
        } else {
            existingAnalysis.transcript = transcript;
            existingAnalysis.response = responseText;
            existingAnalysis.generatedText = generatedText;
        }
        await existingAnalysis.save();
        res.json({ message: 'Speaking analysis saved successfully' });
    } catch (error) {
        console.error('Failed to save speaking analysis:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.saveGeneratedText = async (req, res) => {
    try {
        const { conversationId, generatedText } = req.body;
        let analysis = await SpeakingAnalysis.findOne({ conversationId });
        if (!analysis) {
            analysis = new SpeakingAnalysis({ conversationId, generatedText });
        } else {
            analysis.generatedText = generatedText;
        }
        await analysis.save();
        res.json({ message: 'Generated text saved successfully' });
    } catch (error) {
        console.error('Error saving generated text:', error);
        res.status(500).json({ error: 'Failed to save generated text', message: error.message });
    }
};

exports.getGeneralSpeakingReport = async (req, res) => {
    try {
        const sessions = await SpeakingSession.find({ participants: req.user.id }).populate('participants messages.from');

        let sentimentScores = [];
        for (let session of sessions) {
            for (let message of session.messages) {
                const sentiment = await analyzeSentiment(message.text);
                sentimentScores.push(sentiment.score);
            }
        }

        const averageSentimentScore = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;

        res.json({
            sentimentScoreAverage: averageSentimentScore.toFixed(2),
            analysisCount: sentimentScores.length
        });
    } catch (error) {
        console.error('Error generating analysis report:', error);
        res.status(500).json({ error: 'Failed to generate analysis report' });
    }
};

exports.getSpecificSpeakingAnalysis = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const analysis = await SpeakingAnalysis.findOne({ conversationId });
        if (!analysis) {
            return res.status(404).json({ message: 'Speaking analysis not found' });
        }
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch specific speaking analysis', error: error.message });
    }
};

exports.analyzeSpeakingSession = async (req, res) => {
    try {
      const { conversationId } = req.body;
      const session = await SpeakingSession.findById(conversationId);
      if (!session) {
          return res.status(404).json({ message: 'Speaking session not found' });
      }

        const analysisPromises = session.messages.map(message =>
            analyzeText(message.text)
        );
        const analysisResults = await Promise.all(analysisPromises);

        res.json({ detailedAnalysis: analysisResults });
    } catch (error) {
      console.error("Error analyzing speaking session:", error);
      res.status(500).json({ error: 'Failed to analyze speaking session', message: error.message });
    }
};
