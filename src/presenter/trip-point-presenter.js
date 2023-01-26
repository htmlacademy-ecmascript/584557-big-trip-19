import { render, replace, remove } from '../framework/render.js';
import TripPointView from '../view/trip-point-view.js';
import EditTripPointFormView from '../view/edit-trip-point-form-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPointPresenter {
  #tripListComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #tripPointComponent = null;
  #tripPointEditComponent = null;

  #point = null;
  #offers = null;
  #offersTypes = null;
  #destinations = null;
  #mode = Mode.DEFAULT;

  constructor({ tripListComponent, offers, offersTypes, destinations, onDataChange, onModeChange }) {
    this.#tripListComponent = tripListComponent;
    this.#offers = offers;
    this.#offersTypes = offersTypes;
    this.#destinations = destinations;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevPointEditComponent = this.#tripPointEditComponent;

    const offers = this.#offers[point.type];
    this.#tripPointComponent = new TripPointView(
      this.#point,
      offers,
      this.#handleEditClick,
      this.#handleFavoriteClick
    );
    this.#tripPointEditComponent = new EditTripPointFormView(
      point,
      offers,
      this.#offersTypes,
      this.#destinations,
      this.#replaceFormToCard
    );

    if (prevTripPointComponent === null || prevPointEditComponent === null) {
      render(this.#tripPointComponent, this.#tripListComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripPointEditComponent, prevPointEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  #replaceFormToCard = () => {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #replaceCardToForm() {
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToCard();
  };
}
