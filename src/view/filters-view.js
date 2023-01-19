import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils/string.js';

function createFiltersItemTemplate(filterName, isChecked) {
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName}" ${isChecked ? 'hecked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filterName}">${capitalize(filterName)}</label>
    </div>`
  );
}

function createFiltersTemplate(filters) {
  const filtersItemTemplate = Object.keys(filters)
    .map((filterName, idx) => createFiltersItemTemplate(filterName, idx === 0))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
        ${filtersItemTemplate}

        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
}

export default class FiltersView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();

    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
