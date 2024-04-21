const ListeningSession = require('../models/ListeningSession');
const ListeningAnalysis = require('../models/ListeningAnalysis');

exports.getListeningAnalysisDetails = async (req, res) => {
  try {
    const session = await ListeningSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Listening session not found' });
    }

    const feedback = session.feedback || "No feedback available";

    res.json({
      text: session.content.text,
      feedback
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch listening analysis details', error: error.message });
  }
};

exports.saveListeningAnalysis = async (req, res) => {
  console.log(req.body);
  const { conversationId, text, analysis } = req.body;

  if (!conversationId || !text || !analysis) {
    console.error("Validation Error: Top-level fields missing", { conversationId, text, analysis });
    return res.status(400).json({ message: "Required fields are missing or incomplete." });
  }

  try {
    let savedAnalysis;
    const existingAnalysis = await ListeningAnalysis.findOne({ conversationId });
    if (existingAnalysis) {
      existingAnalysis.text = text;
      existingAnalysis.analysis = analysis;
      savedAnalysis = await existingAnalysis.save();
    } else {
      const newAnalysis = new ListeningAnalysis({
        conversationId,
        text,
        analysis
      });
      savedAnalysis = await newAnalysis.save();
    }
    res.status(201).json({ message: 'Listening analysis saved successfully', analysis: savedAnalysis });
  } catch (error) {
    console.error("Error saving listening analysis:", error);
    res.status(500).json({ message: "Failed to save listening analysis", details: error.message });
  }
};

exports.fetchListeningAnalysis = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const analysis = await ListeningAnalysis.findOne({ conversationId });
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analysis', error: error.message });
  }
};
