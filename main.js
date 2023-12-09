require("dotenv").config();
const parser = require('node-html-parser');
const { Telegraf } = require("telegraf");
const fs = require("fs");

const bot = new Telegraf(process.env.TOKEN);

const pollOptions = ["moi", "pas moi"];
const chatId = process.env.CHAT_ID;

async function fetchDate(url) {
  const response = await fetch(url);
  const data = await response.text();
  const root = parser.parse(data);

  let DateLys = parser.parse(root.querySelector("#7").nextElementSibling.getElementsByTagName("table"))

  DateLys.getElementsByTagName("tr").forEach(trElement => {
    if (trElement.classList.toString() != "old") {
        let info = parser.parse(trElement).getElementsByTagName("td").toString().replaceAll("<td>", "").replaceAll("</td>", "").split(",")

        if (info[1] != undefined && parser.parse(info[1]).querySelector("span").classList.toString() != "conge") {
            console.log(parser.parse(info[1]).querySelector("span").classList.toString());
            console.log(info[0]);

            let infoSecondary = ""

            console.log(info[1].split("<br>").length);

            if (info[1].split("<br>").length == 2) {
                infoSecondary = `(${parser.parse(info[1].split("<br>")[1]).text.toString()})`;
            }

            let messageText = `Qui sera présent à : ${parser.parse(info[1].split("<br>")[0]).text.toString()} ${infoSecondary} le ${info[0].replaceAll("<br>", ", ")}`;
            bot.telegram.sendPoll(parseInt(chatId), messageText, pollOptions); 
        }
    }
  });
  bot.launch();
}

fetchDate("https://www.lac-bleu.ch/programmes/#6");
