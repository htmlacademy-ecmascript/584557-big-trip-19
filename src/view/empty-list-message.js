import { createElement } from '../render.js';

function emptyListMessageTemplate() {
  return (
    '<p class="trip-events__msg">Click New Event to create your first point</p>'
  );
}

export default class EmptyListMessage {
  #element;

  #getTemplate() {
    return emptyListMessageTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.#getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
