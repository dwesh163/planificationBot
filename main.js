require('dotenv').config();
const parser = require('node-html-parser');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);

const pollOptions = ['moi', 'pas moi'];
const chatId = process.env.CHAT_ID;

function isInTime(dateString, number) {
	var parts = dateString.split('.');

	var day = parseInt(parts[0], 10);
	var month = parseInt(parts[1], 10) - 1;
	var year = parseInt(parts[2], 10);

	var inputDate = new Date(year, month, day);

	var currentDateWithoutTime = new Date();
	currentDateWithoutTime.setHours(0, 0, 0, 0);

	currentDateWithoutTime.setDate(currentDateWithoutTime.getDate() + number);
	return inputDate.getTime() === currentDateWithoutTime.getTime();
}

async function fetchDate(url) {
	const response = await fetch(url);
	const data = await response.text();
	const root = parser.parse(data);

	let DateLys = parser.parse(root.querySelector('#7').nextElementSibling.getElementsByTagName('table'));

	DateLys.getElementsByTagName('tr').forEach((trElement) => {
		if (trElement.classList.toString() != 'old') {
			let info = parser.parse(trElement).getElementsByTagName('td').toString().replaceAll('<td>', '').replaceAll('</td>', '').split(',');
			if (info != [''] && info[1] != undefined) {
				if (isInTime(info[0].split('<br>')[0].replaceAll('A', '').replaceAll('S', '').replaceAll('[', '').replaceAll(']', ''), 14)) {
					if ((parser.parse(info[1]).querySelector('span') != null && parser.parse(info[1]).querySelector('span').classList.toString() != 'conge') || parser.parse(info[1]).querySelector('span') == null) {
						let infoSecondary = '';

						if (info[1].split('<br>').length == 2) {
							infoSecondary = `(${parser.parse(info[1].split('<br>')[1]).text.toString()})`;
						}

						let messageText = `Qui sera présent à : ${parser.parse(info[1].split('<br>')[0]).text.toString()} ${infoSecondary} le ${info[0].replaceAll('<br>', ', ')}`;
						bot.telegram.sendPoll(parseInt(chatId), messageText, pollOptions);
						bot.telegram.sendMessage(parseInt(process.env.TEST_CHAT_ID), `Send : done, ${new Date().toLocaleString()}`);
					}
				}
			}
		}
	});
	bot.telegram.sendMessage(parseInt(process.env.TEST_CHAT_ID), `Test : done, ${new Date().toLocaleString('FR')}`);
}

fetchDate('https://www.lac-bleu.ch/programmes/#6');
