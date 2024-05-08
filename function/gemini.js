const GeminiChat = require("../assets/gemini");
const bot = require("../bot/bot");
bot.onText(/\/gemini/, async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.split(" ").slice(1).join(" ");
  bot.sendMessage(chatId, await GeminiChat(chatId, text));
});
