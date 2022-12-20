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

    const pointForEditForm = this.#points[2];
    render(
      new EditTripPointFormView(
        pointForEditForm,
        this.#offers[pointForEditForm.type],
        this.#offersTypes,
        this.#destinations
      ),
      this.#tripListComponent.element
    );

    this.#points.forEach((point) => {
      const offers = this.#offers[point.type];
      render(new TripPointView(point, offers), this.#tripListComponent.element);
    });
  }
}
