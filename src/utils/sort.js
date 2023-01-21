import { SortType } from '../constants.js';

const sortings = {
  [SortType.DAY]: (points) => points.sort(
    (a, b) => new Date(a.date_from) - new Date(b.date_from)
  ),
  [SortType.EVENT]: null,
  [SortType.TIME]: (points) => points.sort(
    (a, b) => (
      (new Date(b.date_to) - new Date(b.date_from)) -
      (new Date(a.date_to) - new Date(a.date_from))
    )
  ),
  [SortType.PRICE]: (points) => points.sort((a, b) => b.price - a.price),
  [SortType.OFFERS]: null
};

export { sortings };
