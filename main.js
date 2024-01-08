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

function calculateDaysUntilNextDate(dates) {
	const dateObjects = dates.map((dateString) => {
		const [day, month, year] = dateString.split('.').map(Number);
		let date = new Date(year, month - 1, day);
		date.setDate(date.getDate() - 14);
		return date.setDate(date.getDate() - 14);
	});

	const currentDate = new Date();

	const futureDates = dateObjects.filter((date) => date > currentDate);
	futureDates.sort((a, b) => a - b);

	let daysUntilNextDate = Math.ceil((futureDates[0] - currentDate) / (1000 * 60 * 60 * 24));

	return daysUntilNextDate;
}

async function fetchDate(url) {
	const response = await fetch(url);
	const data = await response.text();
	const root = parser.parse(data);

	let timeList = [];
	let DateLys = parser.parse(root.querySelector('#7').nextElementSibling.getElementsByTagName('table'));

	DateLys.getElementsByTagName('tr').forEach((trElement) => {
		if (trElement.classList.toString() != 'old') {
			let info = parser.parse(trElement).getElementsByTagName('td').toString().replaceAll('<td>', '').replaceAll('</td>', '').split(',');
			if (info != [''] && info[1] != undefined) {
				timeList.push(info[0].split('<br>')[0].replaceAll('A', '').replaceAll('S', '').replaceAll('[', '').replaceAll(']', '').replaceAll('J', '').replaceAll(' ', ''));
				if (isInTime(info[0].split('<br>')[0].replaceAll('A', '').replaceAll('S', '').replaceAll('[', '').replaceAll(']', '').replaceAll('J', '').replaceAll(' ', ''), 14)) {
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

	if (calculateDaysUntilNextDate(timeList) != 0) {
		bot.telegram.sendMessage(parseInt(process.env.TEST_CHAT_ID), `Test : done - ${new Date().toLocaleString('FR')} - Days until : ${calculateDaysUntilNextDate(timeList)}`);
	}
}

fetchDate('https://www.lac-bleu.ch/programmes/#6');
