import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import CreateTripPointFormView from '../view/create-trip-point-form-view.js';
import EditTripPointFormView from '../view/edit-trip-point-form-view.js';
import { render } from '../render.js';

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
    render(new SortView(), this.#boardContainer);
    render(this.#tripListComponent, this.#boardContainer);
    render(new CreateTripPointFormView(), this.#tripListComponent.element);

    this.#points.forEach(this.#renderPoint.bind(this));
  }

  #renderPoint(pointData) {
    const offers = this.#offers[pointData.type];
    const point = new TripPointView(pointData, offers);
    const poinRollupBtnElement = point.element.querySelector('.event__rollup-btn');

    const pointEditForm = new EditTripPointFormView(
      pointData,
      this.#offers[pointData.type],
      this.#offersTypes,
      this.#destinations
    );

    poinRollupBtnElement.addEventListener('click', (evt) => {
      evt.preventDefault();

      point.element.replaceWith(pointEditForm.element);
      document.addEventListener('keydown', escKeyDownHandler);
    });

    const editFormElement = pointEditForm.element.querySelector('.event');
    const editFormRollupBtnElement = pointEditForm.element.querySelector('.event__rollup-btn');

    function closeEditForm(evt) {
      evt.preventDefault();

      pointEditForm.element.replaceWith(point.element);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function escKeyDownHandler(evt) {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closeEditForm(evt);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    }

    editFormElement.addEventListener('submit', closeEditForm);
    editFormRollupBtnElement.addEventListener('click', closeEditForm);

    render(point, this.#tripListComponent.element);
  }
}
