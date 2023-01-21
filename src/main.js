import { render } from './framework/render.js';
import TripBoardPresenter from './presenter/trip-board-presenter.js';
import TripPointsModel from './model/trip-points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FiltersView from './view/filters-view.js';
import { filters } from './utils/filters.js';

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripBoardContainerElement = document.querySelector('.trip-events');

const pointsModel = new TripPointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const tripBoardPresenter = new TripBoardPresenter({
  boardContainer: tripBoardContainerElement,
  pointsModel,
  offersModel,
  destinationsModel
});

render(new FiltersView(filters), filtersContainerElement);

tripBoardPresenter.init();
