import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import CreateTripPointFormView from '../view/create-trip-point-form-view.js';
import EmptyListMessage from '../view/empty-list-message.js';
import { render } from '../framework/render.js';
import { sortings } from '../utils/sort.js';
import { updateItemByID } from '../utils/common.js';
import { SortType } from '../constants.js';

export default class TripBoardPresenter {
  #boardContainer;
  #points;
  #sourcedPoints;
  #offers;
  #offersTypes;
  #destinations;

  #tripListComponent = new TripListView();
  #pointsPresenters = new Map();

  #sortComponent = null;
  #currentSortType = SortType.DAY;

  constructor({ boardContainer, pointsModel, offersModel, destinationsModel }) {
    this.#boardContainer = boardContainer;
    this.#points = [...pointsModel.points];
    this.#sourcedPoints = [...pointsModel.points];
    this.#offers = {...offersModel.offers};
    this.#offersTypes = [...offersModel.offersTypes];
    this.#destinations = [...destinationsModel.destinations];
  }

  init() {
    if(this.#points.length) {
      this.#renderSort();
      render(this.#tripListComponent, this.#boardContainer);
      render(new CreateTripPointFormView(), this.#tripListComponent.element);

      this.#points.forEach(this.#renderPoint.bind(this));
    } else {
      render(new EmptyListMessage(), this.#boardContainer);
    }
  }

  #renderPoint(pointData) {
    const pointPresenter = new TripPointPresenter({
      offers: this.#offers,
      offersTypes: this.#offersTypes,
      destinations: this.#destinations,
      tripListComponent: this.#tripListComponent.element,
      onDataChange: this.#handleTaskChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(pointData);

    this.#pointsPresenters.set(pointData.id, pointPresenter);
  }

  #handleTaskChange = (updatedPoint) => {
    this.#points = updateItemByID(this.#points, updatedPoint);
    this.#sourcedPoints = updateItemByID(this.#sourcedPoints, updatedPoint);
    this.#pointsPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      sortings,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer);
  }

  #sortPoints(sortType) {
    this.#points.sort(sortings[sortType]);

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderPoints();
  };

  #clearPoints() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  }

  #renderPoints() {
    this.#points.forEach(this.#renderPoint.bind(this));
  }
}
