import FiltersView from './view/filters-view.js';
import {render} from './render.js';
import TripBoardPresenter from './presenter/trip-board-presenter.js';

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripBoardContainerElement = document.querySelector('.trip-events');

const tripBoardPresenter = new TripBoardPresenter({boardContainer: tripBoardContainerElement});

render(new FiltersView(), filtersContainerElement);

tripBoardPresenter.init();
