import { FilterType } from '../constants.js';
import {
  isPastPointTime,
  isPresentPointTime,
  isFuturePointTime
} from './date.js';

const filters = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePointTime(point.date_from)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentPointTime(point.date_from, point.date_to)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPointTime(point.date_from)),
};

export { filters };
