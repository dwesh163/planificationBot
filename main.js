require("dotenv").config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);

const pollOptions = ['oui', 'non'];

async function telegram() {
    const messageText = "?"
    const chatId = process.env.CHAT_ID;

    bot.telegram.sendPoll(parseInt(chatId), messageText , pollOptions)

    bot.launch();
}

telegram();

