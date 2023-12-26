require('dotenv').config(); // Load environment variables from .env file

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Validate environment variables
if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.BRAINSHOP_BOT_ID || !process.env.BRAINSHOP_API_KEY) {
  console.error('Missing required environment variables!');
  process.exit(1);
}

// Command handlers
bot.onText(/\/list/, (msg) => {
  const chatId = msg.chat.id;
  const message = 'I can do the following:\n1. Chat with you using the BrainShop endpoint\n2. Respond to messages starting with "!".';
  bot.sendMessage(chatId, message);
});

bot.onText(/^!/, async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text.slice(1); // Remove the "!" prefix

  try {
    const response = await axios.get(`http://api.brainshop.ai/get?bid=${process.env.BRAINSHOP_BOT_ID}&key=${process.env.BRAINSHOP_API_KEY}&uid=${chatId}&msg=${encodeURIComponent(message)}`);
    bot.sendMessage(chatId, formatResponse(response.data.cnt)); // Format response for readability
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Oops! Something went wrong. Please try again later.');
  }
});

// Handle potential rate limits
const rateLimiter = new Bottleneck({
  maxConcurrent: 1, // Adjust based on BrainShop API rate limits
  minTime: 1000 // Delay between requests in milliseconds
});

async function callBrainShopAPI(message) {
  return await rateLimiter.schedule(() => {
    return axios.get(`http://api.brainshop.ai/get?bid=${process.env.BRAINSHOP_BOT_ID}&key=${process.env.BRAINSHOP_API_KEY}&uid=${chatId}&msg=${encodeURIComponent(message)}`);
  });
}

// Helper function to format responses
function formatResponse(responseText) {
  // Implement formatting logic here (e.g., add line breaks, highlight keywords)
  return responseText;
}
