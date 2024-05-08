const generate = require("../assets/genimage");
const bot = require("../bot/bot");

bot.onText(/\/genimage/, async (msg) => {
  const prompt = msg.text.split(" ").slice(1).join(" ") || "";
  const res = await generate(prompt);
  if (res) {
    if (res.maybeNsfw) {
      bot.sendMessage(msg.chat.id, "Không hợp lệ");
    } else {
      bot.sendPhoto(msg.chat.id, res.buff);
    }
  }
});
