const request = require("request");
const bot = require("../bot/bot");
const history = [];
const dict = require("../assets/dict");
bot.onText(/\/noitu/, async (msg) => {
  if (history[msg.chat.id] == undefined) history[msg.chat.id] = [];
  const args = msg.text.split(" ");
  if (args.length !== 3) {
    bot.sendMessage(msg.chat.id, "Phải nhập từ có 2 tiếng");
    return;
  }
  const text = (args[1] + " " + args[2]).toLowerCase();
  if (history[msg.chat.id].length > 0) {
    if (check(history[msg.chat.id][0], text)) {
      if (history[msg.chat.id].indexOf(text) == -1) {
        if ((await TraCuu(text)).length > 0) {
          history[msg.chat.id].unshift(text);
        } else {
          bot.sendMessage(msg.chat.id, "Không hợp lệ, Bạn thua");
          history[msg.chat.id] = [];
          return;
        }
      } else {
        bot.sendMessage(msg.chat.id, "Đã tồn tại, Bạn thua");
        history[msg.chat.id] = [];
        return;
      }
    } else {
      bot.sendMessage(
        msg.chat.id,
        `Từ đầu tiên phải là ${history[msg.chat.id][0].split(" ")[1]}, Bạn thua`
      );
      history[msg.chat.id] = [];
      return;
    }
  } else {
    const res = await TraCuu(text);
    if (res.length > 0) {
      history[msg.chat.id] = [text];
    } else {
      return bot.sendMessage(msg.chat.id, "Không hợp lệ, Bạn thua");
    }
  }
  const lastText = history[msg.chat.id][0];
  const res = await TraCuu(lastText.split(" ")[1]);
  for (let i = 0; i < res.length; i++) {
    if (history[msg.chat.id].indexOf(res[i]) == -1) {
      bot.sendMessage(msg.chat.id, res[i]);
      history[msg.chat.id].unshift(res[i]);
      return;
    }
  }
  bot.sendMessage(msg.chat.id, "Bot Thua");
  history[msg.chat.id] = [];
});
function check(text1, text2) {
  return text1.split(" ")[1] == text2.split(" ")[0];
}
async function TraCuu(text) {
  const args = text.split(" ");
  if (args.length == 2) {
    if (dict[args[0]] && dict[args[0]].indexOf(args[1]) != -1) {
      return [text];
    }
  }
  if (args.length == 1) {
    if (dict[args[0]]) {
      const ret = [];
      dict[args[0]].forEach((x) => {
        ret.push(args[0] + " " + x);
      });
      return ret;
    }
  }
  return [];
}
