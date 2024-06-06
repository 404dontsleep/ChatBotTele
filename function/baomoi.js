const bot = require("../bot/bot");
const request = require("request");
const news = {
  items: [],
  lastCron: 0,
};
async function getNew() {
  if (Date.now() - news.lastCron < 10000) {
    return news.items;
  }
  const url = "https://baomoi.com/";
  return new Promise((resolve) => {
    request(url, function (error, response, body) {
      const regex =
        /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/gm;
      const match = regex.exec(body);
      if (match) {
        const json = JSON.parse(match[1]);
        const res = [];
        json["props"]["pageProps"]["resp"]["data"]["content"][
          "sections"
        ].forEach((item) => {
          if (item["items"]) {
            item["items"].forEach((item2) => {
              if (item2["url"])
                res.push({
                  description: item2["description"],
                  title: item2["title"],
                  url: item2["url"],
                  thumb: item2["thumb"],
                });
            });
          }
        });
        news.items = res;
        news.lastCron = Date.now();
        resolve(res);
      } else {
        resolve([]);
      }
    });
  });
}

bot.onText(/\/baomoi/, (msg) => {
  getNew().then((res) => {
    sendNews(msg.chat.id, res);
  });
});
bot.on("callback_query", async (msg) => {
  const args = msg.data.split("_");
  if (args[0] == "next") {
    getNew().then((res) => {
      const random = res[Math.floor(Math.random() * res.length)];
      sendNews(msg.message.chat.id, [random], msg.message.message_id);
    });
  }
});
function sendNews(chatId, newsArticles, messageId = null) {
  if (messageId) {
    bot.deleteMessage(chatId, messageId);
  }
  {
    bot.sendPhoto(chatId, newsArticles[0].thumb, {
      caption: `<b>${newsArticles[0].title}</b>\n<a href="https://baomoi.com${newsArticles[0].url}">Read More</a>`,
      parse_mode: "HTML",
      reply_markup: JSON.stringify({
        inline_keyboard: [[{ text: "Next", callback_data: `next_${1}` }]],
      }),
    });
  }
}
