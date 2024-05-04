const TelegramBot = require("node-telegram-bot-api");
const token = "7139382111:AAH7kfELGfOGmw-9aK6cFjjKe9GDooEMs_E";
const bot = new TelegramBot(token, { polling: true });

module.exports = bot;
