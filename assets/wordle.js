const request = require("request");
var todayword = {
  date: null,
  word: null,
};
const options = {
  method: "POST",
  url: "https://wordle-game-api1.p.rapidapi.com/word",
  headers: {
    "content-type": "application/json",
    "X-RapidAPI-Key": process.env.WORDLE_API_KEY,
    "X-RapidAPI-Host": "wordle-game-api1.p.rapidapi.com",
  },
  body: {
    timezone: "UTC + 7",
  },
  json: true,
};

async function getWord() {
  return new Promise((resolve) => {
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      todayword.word = body.word;
      todayword.date = new Date().getDate();
      resolve(body);
    });
  });
}

async function checkWord(word) {
  if (todayword == null || todayword.date != new Date().getDate()) {
    await getWord();
  }
  return word
    .split("")
    .map((item, index) =>
      todayword.word.includes(item)
        ? todayword.word[index] == item
          ? "🟩"
          : "🟨"
        : "🟥"
    )
    .slice(0, 5)
    .join("");
}
module.exports = { checkWord };
