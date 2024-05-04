const TelegramBot = require("node-telegram-bot-api");
const token = "6339637247:AAEvSZ49GMw3Aqex39M_Yec7zdG_5CVQOnQ";
const bot = new TelegramBot(token, { polling: true });

module.exports = bot;
