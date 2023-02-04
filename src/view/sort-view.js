import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils/string.js';

function createSortingItemTemplate(sortingName, isEnabled, currentSortType) {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sortingName}">
      <input id="sort-${sortingName}" class="trip-sort__input js-sort-input visually-hidden" type="radio" name="trip-sort" value="${sortingName}" ${isEnabled ? '' : 'disabled'} ${currentSortType === sortingName ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${sortingName}">${capitalize(sortingName)}</label>
    </div>`
  );
}

function createSortingTemplate(sortings, currentSortType) {
  const sortingItemsTemplate = Object.entries(sortings)
    .map(([name, sortFn]) => createSortingItemTemplate(name, Boolean(sortFn), currentSortType))
    .join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortingItemsTemplate}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #sortings = null;
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({ sortings, onSortTypeChange, currentSortType }) {
    super();

    this.#sortings = sortings;
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.querySelectorAll('.js-sort-input').forEach((sortInput) => {
      sortInput.addEventListener('change', this.#sortTypeChangeHandler);
    });
  }

  get template() {
    return createSortingTemplate(this.#sortings, this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.value);
  };
}
