const request = require("request");
const USERS = [];
class Quiz {
  static async startQuiz(id, area = "toeic") {
    const quiz = new Quiz();
    quiz.area = area;
    USERS[id] = quiz;
    quiz.quizs = [];
    await quiz.startQuiz();
    quiz.quizs = await quiz.getQuiz(quiz.cookie);
    return quiz;
  }
  static async getID(id) {
    if (USERS[id] == undefined) {
      await Quiz.startQuiz(id);
    }
    return USERS[id];
  }
  async startQuiz() {
    return new Promise((resolve) => {
      request.get(
        "https://www.twinword.com/exam/leveltest.php?area=" + this.area,
        function (error, response, body) {
          const cookies = response.headers["set-cookie"][0];
          this.cookie = cookies;
          resolve(cookies);
        }
      );
    });
  }
  async nextQuiz() {
    if (this.quizs.length == 0) {
      return null;
    }
    const quiz = this.quizs.shift();
    return quiz;
  }
  async getQuiz(cookie) {
    return new Promise((resolve) => {
      request.post(
        {
          url: "https://www.twinword.com/exam/api/v1/leveltest/",
          headers: {
            Cookie: cookie,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          json: true,
          body: "area=toeic&act=start",
        },
        function (error, response, body) {
          if (body && body.quizList) {
            resolve(body.quizList);
          } else {
            resolve([]);
          }
        }
      );
    });
  }
}

module.exports = Quiz;
