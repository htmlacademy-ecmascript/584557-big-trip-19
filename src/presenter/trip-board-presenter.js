import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import EmptyListMessage from '../view/empty-list-message.js';
import { render, remove } from '../framework/render.js';
import { sortings } from '../utils/sort.js';
import { filters } from '../utils/filters.js';
import { SortType, UpdateType, UserAction, FilterType } from '../constants.js';

export default class TripBoardPresenter {
  #boardContainer;
  #pointsModel;
  #filterModel;
  #offers;
  #destinations;

  #tripListComponent = new TripListView();
  #noPointComponent = null;
  #pointsPresenters = new Map();
  #newPointPresenter = null;

  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor({ boardContainer, pointsModel, offersModel, destinationsModel, filterModel, onNewPointDestroy }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#offers = {...offersModel.offers};
    this.#destinations = [...destinationsModel.destinations];

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#tripListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
      allOffers: this.#offers,
      destinations: this.#destinations
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filters[this.#filterType](points);
    return filteredPoints.sort(sortings[this.#currentSortType]);
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderPoint(pointData) {
    const pointPresenter = new TripPointPresenter({
      offers: this.#offers,
      destinations: this.#destinations,
      tripListComponent: this.#tripListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(pointData);

    this.#pointsPresenters.set(pointData.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
    }
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      sortings,
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderPoints() {
    this.points.forEach(this.#renderPoint.bind(this));
  }

  #renderBoard() {
    if(this.points.length) {
      this.#renderSort();
      render(this.#tripListComponent, this.#boardContainer);

      this.#renderPoints();
    } else {
      this.#noPointComponent = new EmptyListMessage({
        filterType: this.#filterType
      });

      render(this.#noPointComponent, this.#boardContainer);
    }
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    remove(this.#sortComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
