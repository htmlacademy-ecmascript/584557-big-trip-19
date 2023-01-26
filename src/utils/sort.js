import { SortType } from '../constants.js';

const sortings = {
  [SortType.DAY]: (points) => points.sort(
    (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
  ),
  [SortType.EVENT]: null,
  [SortType.TIME]: (points) => points.sort(
    (a, b) => (
      (new Date(b.dateTo) - new Date(b.dateFrom)) -
      (new Date(a.dateTo) - new Date(a.dateFrom))
    )
  ),
  [SortType.PRICE]: (points) => points.sort((a, b) => b.price - a.price),
  [SortType.OFFERS]: null
};

export { sortings };
