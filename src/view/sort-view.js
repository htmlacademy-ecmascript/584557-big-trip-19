import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils/string.js';

function createSortingItemTemplate(sortingName, isEnabled, checked) {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sortingName}">
      <input id="sort-${sortingName}" class="trip-sort__input js-sort-input visually-hidden" type="radio" name="trip-sort" value="${sortingName}" ${isEnabled ? '' : 'disabled'} ${checked ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${sortingName}">${capitalize(sortingName)}</label>
    </div>`
  );
}

function createSortingTemplate(sortings) {
  const sortingItemsTemplate = Object.entries(sortings)
    .map(([name, sortFn], idx) => createSortingItemTemplate(name, Boolean(sortFn), idx === 0))
    .join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortingItemsTemplate}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #sortings = null;
  #handleSortTypeChange = null;

  constructor({sortings, onSortTypeChange}) {
    super();

    this.#sortings = sortings;
    this.#handleSortTypeChange = onSortTypeChange;

    [...this.element.querySelectorAll('.js-sort-input')].forEach((sortInput) => {
      sortInput.addEventListener('change', this.#sortTypeChangeHandler);
    });
  }

  get template() {
    return createSortingTemplate(this.#sortings);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.value);
  };
}
