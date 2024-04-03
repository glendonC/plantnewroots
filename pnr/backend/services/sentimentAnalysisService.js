const language = require('@google-cloud/language');

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

// analyzeSentiment("This is a test sentence!!").then(sentiment => {
//   console.log(sentiment);
// }).catch(console.error);


module.exports = { analyzeSentiment };
