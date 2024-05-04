const bot = require("../bot/bot");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Hello, World!");
});
