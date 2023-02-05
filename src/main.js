import TripBoardPresenter from './presenter/trip-board-presenter.js';
import TripPointsModel from './model/trip-points-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { points } from './mock/trip-points.js';
import { offers } from './mock/offers.js';
import { destinations } from './mock/destinations.js';
import { render } from './framework/render.js';

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripBoardContainerElement = document.querySelector('.trip-events');
const headerMainElement = document.querySelector('.trip-main');

const pointsModel = new TripPointsModel(points);
const offersModel = new OffersModel(offers);
const destinationsModel = new DestinationsModel(destinations);
const filterModel = new FilterModel(destinations);

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainerElement,
  filterModel,
  pointsModel
});

const tripBoardPresenter = new TripBoardPresenter({
  boardContainer: tripBoardContainerElement,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

tripBoardPresenter.init();
filterPresenter.init();

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripBoardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, headerMainElement);
