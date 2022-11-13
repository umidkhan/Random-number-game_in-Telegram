const TelegraApi = require("node-telegram-bot-api");

require("dotenv").config()

const token = process.env.TOKEN;

const bot = new TelegraApi(token, { polling: true });

const chats = {};
const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "1", callback_data: "1" },
        { text: "2", callback_data: "2" },
        { text: "3", callback_data: "3" },
      ],
      [
        { text: "4", callback_data: "4" },
        { text: "5", callback_data: "5" },
        { text: "6", callback_data: "6" },
      ],
      [
        { text: "7", callback_data: "7" },
        { text: "8", callback_data: "8" },
        { text: "9", callback_data: "9" },
      ],
      [{ text: "0", callback_data: "0" }],
    ],
  }),
};

const againOption = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: "Restart the game", callback_data: "/again" }]],
  }),
};

bot.setMyCommands([
  { command: "/start", description: "Start the bot" },
  { command: "/myinfo", description: "You info" },
  { command: "/play", description: "Start the game" },
]);

const startGame = async (chatId) => {
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  return await bot.sendMessage(
    chatId,
    `I thought of a number from 0 to 9\nFind number`,
    gameOptions
  );
};

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return await bot.sendMessage(
        chatId,
        `Hello ${msg.chat.first_name}\nHow are you😊`
      );
    } else if (text === "/myinfo") {
      return await bot.sendMessage(
        chatId,
        `Sizning ismingiz: ${msg.chat.first_name}\nSizdagi username: @${msg.chat.username}`
      );
    } else if (text === "/play") {
      return startGame(chatId);
    }
    return await bot.sendMessage(
      chatId,
      `${msg.chat.first_name} you send the wrong command🤔 \nPlease check and try again`
    );
  });
  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Congratulations.\nYou found the number I thought. You have an IQ of 100+\nI was thinking number ${chats[chatId]}`
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Unfortunetely\nyou didn't find the I was thinking of\nI was thinking number ${chats[chatId]} `,
        againOption
      );
    }

    return bot.sendMessage(chatId, `You selected ${data}`);
  });
};
start();
