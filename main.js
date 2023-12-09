require("dotenv").config();
import { parse } from "node-html-parser";
const { Telegraf } = require("telegraf");
const fs = require("fs");

const bot = new Telegraf(process.env.TOKEN);

const pollOptions = ["oui", "non"];
const messageText = "?";
const chatId = process.env.CHAT_ID;

async function fetchDate(url) {
  const response = await fetch(url);
  const data = await response.text();

  console.log(data);
}

fetchDate("https://www.lac-bleu.ch/programmes/#6");

async function telegram() {
  bot.telegram.sendPoll(parseInt(chatId), messageText, pollOptions);
  bot.launch();
}

//telegram();
