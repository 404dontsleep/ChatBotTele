const bot = require("../bot/bot");
const Quiz = require("../assets/quiz");
const scores = [];
bot.onText(/\/quiz/, async (msg) => {
  const [command, ...args] = msg.text.split(" ");
  if (args.length > 0) {
    const area = args.join(" ").toLowerCase();
  }
  scores[msg.chat.id] = 0;
  await nextQuiz(msg.chat.id);
});
async function nextQuiz(id, last = "") {
  const quiz = await Quiz.getID(id);
  const nextQuiz = await quiz.nextQuiz();
  if (nextQuiz == null) {
    bot.sendMessage(id, "Hoàn thành điểm" + scores[id] + "/10");
    return;
  }
  const question =
    last +
    nextQuiz.assoc
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
      scores[chatId]++;
      await nextQuiz(chatId, "Chính xác\n\n");
    } else {
      await nextQuiz(chatId, "Sai rồi\n\n");
    }
    await bot.deleteMessage(chatId, msg.message.message_id);
  }
});

module.exports = nextQuiz;
