const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

async function analyzeSentiment(text) {
  const client = new language.LanguageServiceClient();

  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  try {
    const [result] = await client.analyzeSentiment({document});
    const sentiment = result.documentSentiment;
    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
    return sentiment;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
}

async function analyzeText(text) {
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Sentiment analysis
  const sentiment = await client.analyzeSentiment({ document });

  // Entity analysis
  const entities = await client.analyzeEntities({ document });

  // Syntax analysis
  const syntax = await client.analyzeSyntax({ document });

  // Combine results
  return {
    sentiment: sentiment[0].documentSentiment,
    entities: entities[0].entities,
    syntax: syntax[0].tokens,
  };
}


module.exports = { analyzeSentiment, analyzeText };
