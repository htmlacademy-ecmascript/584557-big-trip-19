import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import CreateTripPointFormView from '../view/create-trip-point-form-view.js';
import EditTripPointFormView from '../view/edit-trip-point-form-view.js';
import EmptyListMessage from '../view/empty-list-message.js';
import { render, replace } from '../framework/render.js';
import { sortings } from '../utils/sort.js';

export default class TripBoardPresenter {
  #boardContainer;
  #points;
  #offers;
  #offersTypes;
  #destinations;
  #tripListComponent = new TripListView();

  constructor({ boardContainer, pointsModel, offersModel, destinationsModel }) {
    this.#boardContainer = boardContainer;
    this.#points = [...pointsModel.points];
    this.#offers = {...offersModel.offers};
    this.#offersTypes = [...offersModel.offersTypes];
    this.#destinations = [...destinationsModel.destinations];
  }

  init() {
    if(this.#points.length) {
      render(new SortView(sortings), this.#boardContainer);
      render(this.#tripListComponent, this.#boardContainer);
      render(new CreateTripPointFormView(), this.#tripListComponent.element);

      this.#points.forEach(this.#renderPoint.bind(this));
    } else {
      render(new EmptyListMessage(), this.#boardContainer);
    }
  }

  #renderPoint(pointData) {
    const offers = this.#offers[pointData.type];

    const pointEditForm = new EditTripPointFormView(
      pointData,
      this.#offers[pointData.type],
      this.#offersTypes,
      this.#destinations,
      closeEditForm
    );

    const point = new TripPointView(pointData, offers, () => {
      replace(pointEditForm, point);
      document.addEventListener('keydown', escKeyDownHandler);
    });

    function escKeyDownHandler(evt) {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();

        closeEditForm(evt);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    }

    function closeEditForm() {
      replace(point, pointEditForm);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(point, this.#tripListComponent.element);
  }
}
