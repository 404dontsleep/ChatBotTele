const bot = require("../bot/bot");
const axios = require("axios");

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
  getWeather(chatId, city.join(" "));
});
