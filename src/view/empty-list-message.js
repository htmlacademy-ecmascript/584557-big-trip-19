import AbstractView from '../framework/view/abstract-view.js';

function emptyListMessageTemplate() {
  return (
    '<p class="trip-events__msg">Click New Event to create your first point</p>'
  );
}

export default class EmptyListMessage extends AbstractView {
  get template() {
    return emptyListMessageTemplate();
  }
}
