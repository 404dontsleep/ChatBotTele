const request = require("request");
const USERS = [];
class Quiz {
  static async startQuiz(id) {
    const quiz = new Quiz();
    USERS[id] = quiz;
    quiz.quizs = [];
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
        "https://www.twinword.com/exam/leveltest.php?area=toeic",
        function (error, response, body) {
          const cookies = response.headers["set-cookie"][0];
          resolve(cookies);
        }
      );
    });
  }
  async nextQuiz() {
    if (this.quizs.length == 0) {
      const cookie = await this.startQuiz();
      this.quizs = await this.getQuiz(cookie);
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
