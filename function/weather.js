const bot = require("../bot/bot");
const axios = require("axios");
const locations = [];
//OpenWeatherMap API key
const appID = "d1e0c071ba8995ec5a98e17c0952cb1c";

// OpenWeatherMap endpoint for getting weather by city name
const weatherEndpoint = (city) =>
  `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${appID}`;

// URL that provides icon according to the weather
const weatherIcon = (icon) => `http://openweathermap.org/img/w/${icon}.png`;

// Template for weather response
const weatherHtmlTemplate = (name, main, weather, wind, clouds) =>
  `The weather in <b>${name}</b>:
<b>${weather.main}</b> - ${weather.description}
Temperature: <b>${main.temp} °C</b>
Pressure: <b>${main.pressure} hPa</b>
Humidity: <b>${main.humidity} %</b>
Wind: <b>${wind.speed} meter/sec</b>
Clouds: <b>${clouds.all} %</b>
`;

// Function that gets the weather by the city name
const getWeather = (chatId, city) => {
  const endpoint = weatherEndpoint(city);

  axios.get(endpoint).then(
    (resp) => {
      const { name, main, weather, wind, clouds } = resp.data;

      bot.sendPhoto(chatId, weatherIcon(weather[0].icon));
      bot.sendMessage(
        chatId,
        weatherHtmlTemplate(name, main, weather[0], wind, clouds),
        {
          parse_mode: "HTML",
        }
      );
    },
    (error) => {
      console.log("error", error);
      bot.sendMessage(
        chatId,
        `Ooops...I couldn't be able to get weather for <b>${city}</b>`,
        {
          parse_mode: "HTML",
        }
      );
    }
  );
};

// Listener (handler) for telegram's /weather event
bot.onText(/\/weather/, (msg, match) => {
  const chatId = msg.chat.id;
  const [ms, ...city] = match.input.split(" ");
  if (city.length === 0) {
    bot.sendMessage(chatId, `Please provide city name`);
    return;
  }
  locations[chatId] = city.join(" ");
  getWeather(chatId, city.join(" "));
});
const mainWeather2Img = {
  Thunderstorm:
    "https://i.pinimg.com/564x/9f/54/17/9f5417b7e5edf5f0623d4d2a855bdf82.jpg",
  Drizzle:
    "https://i.pinimg.com/564x/92/5c/a8/925ca84275e981509b6457f4e84db4e9.jpg",
  Rain: "https://media.istockphoto.com/id/1473703329/vector/meme-flork-holding-an-umbrella-in-the-rain.jpg?s=170667a&w=0&k=20&c=arfa1nM6jwYlTAkh28KT_jiitvBbOV9eMynbzdiQJgk=",
  Snow: "https://i.pinimg.com/564x/4d/64/07/4d6407ead8283528797ec1ed1b218d1e.jpg",
  Clear:
    "https://i.pinimg.com/564x/e3/f5/5d/e3f55df608b252d06279664c6a658639.jpg",
  Clouds:
    "https://i.pinimg.com/564x/48/5e/18/485e181fbe2099cc0fb9d73d976cb4df.jpg",
  Fog: "https://i.pinimg.com/564x/9d/85/31/9d8531cbb8cde314edcffcc0d352e15c.jpg",
  Mist: "https://i.pinimg.com/564x/9d/85/31/9d8531cbb8cde314edcffcc0d352e15c.jpg",
  Haze: "https://i.pinimg.com/564x/9d/85/31/9d8531cbb8cde314edcffcc0d352e15c.jpg",
  Dust: "https://i.pinimg.com/564x/9d/85/31/9d8531cbb8cde314edcffcc0d352e15c.jpg",
  Sand: "https://i.pinimg.com/564x/9d/85/31/9d8531cbb8cde314edcffcc0d352e15c.jpg",
  Ash: "https://i.pinimg.com/564x/9d/85/31/9d8531cbb8cde314edcffcc0d352e15c.jpg",
  Squall: "http://openweathermap.org/img/wn/50d@2x.png",
  Tornado: "http://openweathermap.org/img/wn/50d@2x.png",
};
const mainWeather2Remind = {
  Thunderstorm: "Ở nhà thôi",
  Drizzle: "Cứ đem ô cho lành",
  Rain: "Mưa đấy đem ô đi",
  Snow: "Làm tí cafe cho ấm người",
  Clear: "Trời như thế này không đi chơi thì phí",
  Clouds: "Trời cũng đẹp",
  Fog: "Bảo vệ hô hấp thôi",
  Mist: "Bảo vệ hô hấp thôi",
  Haze: "Bảo vệ hô hấp thôi",
  Dust: "Bảo vệ hô hấp thôi",
  Sand: "Bảo vệ hô hấp thôi",
  Ash: "Bảo vệ hô hấp thôi",
  Squall: "Trời hôm nay có vẻ xấu",
  Tornado: "Kiểu này chắc ở nhà ngủ thôi",
};
bot.onText(/\/now/, (msg, match) => {
  const chatId = msg.chat.id;
  const endpoint = weatherEndpoint(locations[chatId]);
  axios.get(endpoint).then(
    (resp) => {
      const mainWeather = resp.data.weather[0].main;
      const image = mainWeather2Img[mainWeather];
      const remind = mainWeather2Remind[mainWeather];
      bot.sendPhoto(chatId, image, {
        caption: `${remind}`,
      });
    },
    (error) => {}
  );
});
bot.onText(/\/setlocation/, (msg, match) => {
  const chatId = msg.chat.id;
  const [ms, ...city] = match.input.split(" ");
  locations[chatId] = city.join(" ");
  bot.sendMessage(chatId, `Lưu vị trí mặc định ${city.join(" ")}`);
});
