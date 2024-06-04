const bot = require("../bot/bot");
const Quiz = require("../assets/quiz");

bot.onText(/\/quiz/, async (msg) => {
  const quiz = await Quiz.startQuiz(msg.chat.id);
  await nextQuiz(msg.chat.id);
});
async function nextQuiz(id) {
  const quiz = await Quiz.startQuiz(id);
  const nextQuiz = await quiz.nextQuiz();
  const question = nextQuiz.assoc
    .split(" ")
    .map((x, i) => i + 1 + ". " + x.trim())
    .join("\n");
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "A. " + nextQuiz.answer1,
            callback_data:
              nextQuiz.answer_num == "1" ? "quiz_true" : "quiz_false",
          },
        ],
        [
          {
            text: "B. " + nextQuiz.answer2,
            callback_data:
              nextQuiz.answer_num == "2" ? "quiz_true" : "quiz_false",
          },
        ],
      ],
    },
  };
  bot.sendMessage(id, question, options);
}
bot.on("callback_query", async (msg) => {
  const chatId = msg.message.chat.id;
  const callback_data = msg.data;
  if (callback_data == "quiz_true" || callback_data == "quiz_false") {
    if (callback_data == "quiz_true") {
      await bot.sendMessage(chatId, "Chính xác");
    } else {
      await bot.sendMessage(chatId, "Sai rồi");
    }
    await bot.deleteMessage(chatId, msg.message.message_id);

    await nextQuiz(chatId);
  }
});

module.exports = nextQuiz;
