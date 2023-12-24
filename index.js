require('dotenv').config(); // Load environment variables from .env file

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Create an instance of the Telegram Bot using your Telegram Bot Token
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Trigger to list what the bot can do from the BrainShop
bot.onText(/\/list/, (msg) => {
  const chatId = msg.chat.id;
  const message = 'I can do the following\n1. Chat with you using the BrainShop endpoint\n2. Respond to messages starting with "!".';
  bot.sendMessage(chatId, message);
});

// Listen for messages starting with "!"
bot.onText(/^!/, async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text.slice(1); // Remove the "!" prefix

  try {
    const response = await axios.get(`http://api.brainshop.ai/get?bid=${process.env.BRAINSHOP_BOT_ID}&key=${process.env.BRAINSHOP_API_KEY}&uid=${chatId}&msg=${encodeURIComponent(message)}`);
    bot.sendMessage(chatId, response.data.cnt);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Oops! Something went wrong. Please try again later.');
  }
});