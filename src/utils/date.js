
import dayjs from 'dayjs';
import { DATE_FORMAT, TIME_FORMAT, FORM_INPUT_TIME_FORMAT } from '../constants.js';

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
      acc += `${String(value).padStart(2, '0') + key } `;
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
  if(!date) {
    return null;
  }

  return dayjs(date).format(FORM_INPUT_TIME_FORMAT);
}

function isSameDateDay(date) {
  return dayjs().isSame(date, 'D');
}

function isPastPointTime(pointStartDate) {
  return dayjs().isAfter(pointStartDate, 'D');
}

function isPresentPointTime(pointStartDate, pointEndDate) {
  return (
    isPastPointTime(pointStartDate) || isSameDateDay(pointStartDate)
  ) && (
    isFuturePointTime(pointEndDate) || isSameDateDay(pointEndDate)
  );
}

function isFuturePointTime(pointStartDate) {
  return dayjs().isBefore(pointStartDate, 'D');
}

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

export {getTimeDiffString,
  getEventDateString,
  getEventTimeString,
  getFormTimeString,
  isFuturePointTime,
  isPastPointTime,
  isPresentPointTime,
  isDatesEqual
};
