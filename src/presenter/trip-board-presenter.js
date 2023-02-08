
import Observable from '../framework/observable.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import LoadingView from '../view/loading-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import EmptyListMessage from '../view/empty-list-message.js';
import { render, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortings } from '../utils/sort.js';
import { filters } from '../utils/filters.js';
import { SortType, UpdateType, UserAction, FilterType } from '../constants.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripBoardPresenter extends Observable {
  #boardContainer;
  #headerMainElement;
  #pointsModel;
  #filterModel;
  #offersModel;
  #destinationsModel;

  #tripListComponent = new TripListView();
  #newPointButtonComponent = new NewPointButtonView({
    onClick: () => {
      this.createPoint();
      this.#newPointButtonComponent.element.disabled = true;
    }
  });

  #loadingComponent = new LoadingView();
  #noPointComponent = null;
  #pointsPresenters = new Map();
  #newPointPresenter = null;

  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ boardContainer, headerMainElement, pointsModel, offersModel, destinationsModel, filterModel }) {
    super();

    this.#boardContainer = boardContainer;
    this.#headerMainElement = headerMainElement;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.addObserver(this.#handleModelEvent);

    Promise.all([
      this.#pointsModel.init(),
      this.#offersModel.init(),
      this.#destinationsModel.init()]
    ).then(() => {
      this._notify(UpdateType.INIT);
    }).finally(() => {
      render(this.#newPointButtonComponent, this.#headerMainElement);
    });
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
      offers: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations,
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointsPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#newPointPresenter = new NewPointPresenter({
          pointListContainer: this.#tripListComponent.element,
          onDataChange: this.#handleViewAction,
          onDestroy: () => {
            this.#newPointButtonComponent.element.disabled = false;
          },
          allOffers: this.#offersModel.offers,
          destinations: this.#destinationsModel.destinations
        });
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer);
  }

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
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
