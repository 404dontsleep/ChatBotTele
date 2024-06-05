const bot = require("../bot/bot");
const { checkWord } = require("../assets/wordle");

bot.onText(/\/wordle/, async (msg) => {
  const spiltWord = msg.text.split(" ")[1];
  const word = await checkWord(spiltWord);
  bot.sendMessage(msg.chat.id, word, { parse_mode: "HTML" });
});
