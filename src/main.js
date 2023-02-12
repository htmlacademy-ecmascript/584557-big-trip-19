import TripBoardPresenter from './presenter/trip-board-presenter.js';
import TripPointsModel from './model/trip-points-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './api-sevices/points-api-service.js';
import DestinationsApiService from './api-sevices/destinations-api-service.js';
import OffersApiService from './api-sevices/offers-api-service.js';

const AUTHORIZATION = 'Basic fA3mfS44wcl1sa7q';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip';

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripBoardContainerElement = document.querySelector('.trip-events');
const headerMainElement = document.querySelector('.trip-main');


const pointsModel = new TripPointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const offersModel = new OffersModel({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)
});
const destinationsModel = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainerElement,
  filterModel,
  pointsModel
});

const tripBoardPresenter = new TripBoardPresenter({
  boardContainer: tripBoardContainerElement,
  headerMainElement: headerMainElement,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
});

tripBoardPresenter.init();
filterPresenter.init();
