import dayjs from 'dayjs';
import { DATE_FORMAT, TIME_FORMAT, FORM_INPUT_TIME_FORMAT } from './constants.js';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getZeroLeadingDigitString(digit) {
  return String(digit).padStart(2, '0');
}

function getTimeDiffString(dateFrom, dateTo) {
  const dayJsDateFrom = dayjs(dateTo);
  const dayJsDateTo = dayjs(dateFrom);
  const days = dayJsDateFrom.diff(dayJsDateTo, 'd');
  const hours = dayJsDateFrom.diff(dayJsDateTo, 'h') - 24 * days;
  const minutes = dayJsDateFrom.diff(dayJsDateTo, 'm') - (days * 24 * 60) - (hours * 60);

  return Object.entries({
    'D': days,
    'H': hours,
    'M': minutes,
  }).reduce((acc, [key, value]) => {
    if(value) {
      acc += `${getZeroLeadingDigitString(value) + key } `;
    }

    return acc;
  }, '');
}

function getEventDateString(date) {
  return dayjs(date).format(DATE_FORMAT);
}

function getEventTimeString(date) {
  return dayjs(date).format(TIME_FORMAT);
}

function getFormTimeString(date) {
  return dayjs(date).format(FORM_INPUT_TIME_FORMAT);
}

function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}


export { getRandomArrayElement, getTimeDiffString, getEventDateString, getEventTimeString, getFormTimeString,capitalize };
