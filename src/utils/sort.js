import { SortType } from '../constants.js';

const sortings = {
  [SortType.DAY]:
    (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom),
  [SortType.EVENT]: null,
  [SortType.TIME]:
    (a, b) => (
      (new Date(b.dateTo) - new Date(b.dateFrom)) -
      (new Date(a.dateTo) - new Date(a.dateFrom))
    ),
  [SortType.PRICE]: (a, b) => b.basePrice - a.basePrice,
  [SortType.OFFERS]: null
};

export { sortings };
