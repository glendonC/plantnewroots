const SpeakingAnalysis = require('../models/SpeakingAnalysis');

exports.getSpeakingAnalyses = async (req, res) => {
  try {
    const analyses = await SpeakingAnalysis.find({}).populate('conversationId');
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch speaking analyses', error: error.message });
  }
};

exports.getSpeakingAnalysisDetails = async (req, res) => {
  try {
    const analysis = await SpeakingAnalysis.findById(req.params.id).populate('conversationId');
    if (!analysis) {
      return res.status(404).json({ message: 'Speaking analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch speaking analysis details', error: error.message });
  }
};

exports.saveSpeakingAnalysis = async (req, res) => {
  try {
    const { conversationId, transcript, response, analysis } = req.body;
    const newAnalysis = new SpeakingAnalysis({
      conversationId,
      transcript,
      response,
      analysis
    });

    await newAnalysis.save();
    res.status(201).json({ message: 'Speaking analysis saved successfully', analysis: newAnalysis });
  } catch (error) {
    console.error('Error saving speaking analysis:', error);
    res.status(500).json({ error: 'Failed to save speaking analysis' });
  }
};

exports.getAnalysesByConversationId = async (req, res) => {
  try {
    const analyses = await SpeakingAnalysis.find({ conversationId: req.params.conversationId }).populate('conversationId');
    if (!analyses.length) {
      return res.status(404).json({ message: 'No analyses found for this conversation' });
    }
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analyses', error: error.message });
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
    res.status(500).json({ message: 'Failed to fetch analysis', error: error.message });
  }
};


exports.analyzeSpeechQuality = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const session = await SpeakingSession.findById(conversationId);

    if (!session) {
      return res.status(404).json({ message: 'Speaking session not found' });
    }

    const analysisResults = session.messages.map(message => {
      return analyzeSpeech(message.text);
    });

    res.json({ detailedAnalysis: analysisResults });
  } catch (error) {
    console.error("Error analyzing speech:", error);
    res.status(500).json({ error: 'Failed to analyze speech' });
  }
};
