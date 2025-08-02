// Netlify Function for AI Chat
const https = require('https');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Parse the request body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  const { message, conversationHistory = [] } = body;

  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Message is required' })
    };
  }

  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'AI service not configured' })
    };
  }

  // Prepare the system prompt
  const systemPrompt = `You are HerbCraft's AI Herbal Advisor, a knowledgeable and helpful assistant specializing in herbs, natural remedies, and wellness. 

Your role is to:
1. Provide accurate information about herbs, their properties, and traditional uses
2. Suggest herbal remedies for common health concerns
3. Share recipes for herbal teas, tinctures, and other preparations
4. Explain the benefits and potential risks of different herbs
5. Always remind users to consult healthcare professionals for serious conditions

Important guidelines:
- Be informative but always include appropriate disclaimers
- Never diagnose medical conditions or replace professional medical advice
- Focus on educational information about traditional and evidence-based uses
- Be friendly, supportive, and encouraging about natural wellness
- If asked about serious medical conditions, strongly recommend consulting a healthcare provider
- Mention potential interactions with medications when relevant`;

  // Build messages array for OpenAI
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    })),
    { role: 'user', content: message }
  ];

  // Prepare the request to OpenAI
  const requestData = JSON.stringify({
    model: 'gpt-4-turbo-preview',
    messages: messages,
    temperature: 0.7,
    max_tokens: 800,
    presence_penalty: 0.1,
    frequency_penalty: 0.1
  });

  const options = {
    hostname: 'api.openai.com',
    port: 443,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(requestData)
    }
  };

  try {
    // Make the API request
    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`OpenAI API error: ${res.statusCode} - ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(requestData);
      req.end();
    });

    // Extract the AI's response
    const aiResponse = response.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        response: aiResponse,
        usage: response.usage
      })
    };

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Return a fallback response if OpenAI fails
    const fallbackResponse = `I apologize, but I'm having trouble connecting to my knowledge base right now. 

In the meantime, here are some general tips:
- For calming herbs, consider chamomile, lavender, or lemon balm
- For digestive support, try peppermint, ginger, or fennel
- For immune support, look into echinacea, elderberry, or astragalus

Please try again in a moment, or explore our herb database for detailed information about specific herbs.`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        response: fallbackResponse,
        fallback: true
      })
    };
  }
};