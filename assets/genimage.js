const request = require("request");
const setting = {
  userKey: null,
};
async function newUserkey() {
  return new Promise((resolve) => {
    request.get(
      {
        url: `https://image-generation.perchance.org/api/verifyUser?thread=1&__cacheBust=${Math.random()}`,
        json: true,
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200 && body?.userKey) {
          resolve(body.userKey);
        } else resolve(null);
      }
    );
  });
}
async function generate(prompt) {
  if (!setting.userKey) setting.userKey = await newUserkey();
  return new Promise((resolve) => {
    request.post(
      {
        url: `https://image-generation.perchance.org/api/generate?prompt=(anime art of ${prompt}:1.2), masterpiece, 4k, best quality, anime art&seed=-1&resolution=768x512&guidanceScale=7&negativePrompt=&channel=ai-text-to-image-generator&subChannel=public&userKey=${
          setting.userKey
        }&adAccessCode=&requestId=${Math.random()}&__cacheBust=${Math.random()}`,
        json: true,
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200 && body?.status == "success") {
          const url = `https://image-generation.perchance.org/api/downloadTemporaryImage?imageId=${body.imageId}`;
          request.get(
            {
              url,
              encoding: null,
            },
            function (error, response, body2) {
              resolve({
                ...body,
                buff: new Buffer(body2),
              });
            }
          );
        } else resolve(null);
      }
    );
  });
}

module.exports = generate;
