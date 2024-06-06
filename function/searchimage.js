const axios = require("axios");
const bot = require("../bot/bot");

// Store image state
const imageState = {};

bot.onText(/\/searchimage/, async (msg) => {
  const [command, ...args] = msg.text.split(" ");
  let query = args.join(" ");
  let numImages = 1; // default value

  // Check if the last argument is a number
  if (!isNaN(args[args.length - 1])) {
    numImages = Math.min(Math.max(parseInt(args[args.length - 1]), 1), 10);
    query = args.slice(0, -1).join(" ");
  }

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: query,
        order_by: "relevant",
        client_id: "IVBel-DU8UFv5_pBExpCqlOha94GkQ3RwCh9E9T-aT0",
      },
    });

    const images = response.data.results.map((result) => ({
      type: "photo",
      media: result.urls.small,
    }));

    if (images.length > 0) {
      // Store images and current index
      imageState[msg.chat.id] = {
        images,
        index: 0,
      };

      sendImage(msg.chat.id, images[0]); // send the first image
    } else {
      bot.sendMessage(msg.chat.id, "Không tìm thấy hình ảnh nào.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(msg.chat.id, "Có lỗi xảy ra khi tìm kiếm hình ảnh.");
  }
});

bot.on("callback_query", (callbackQuery) => {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const state = imageState[msg.chat.id];

  if (state) {
    if (action === "1" && state.index > 0) {
      state.index--;

      sendImage(msg.chat.id, state.images[state.index]);
    }

    if (action === "2" && state.index < state.images.length - 1) {
      state.index++;

      sendImage(msg.chat.id, state.images[state.index]);
    }
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

function sendImage(chatId, image) {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "<<", callback_data: "1" },
          { text: ">>", callback_data: "2" },
        ],
      ],
    },
  };

  bot.sendPhoto(chatId, image.media, opts);
}
