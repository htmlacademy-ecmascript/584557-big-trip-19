import { FilterType } from '../constants.js';
import {
  isPastPointTime,
  isPresentPointTime,
  isFuturePointTime
} from './date.js';

const filters = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePointTime(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentPointTime(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPointTime(point.dateFrom)),
};

export { filters };
