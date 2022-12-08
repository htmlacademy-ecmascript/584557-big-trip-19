import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import CreateTripPointFormView from '../view/create-trip-point-form-view.js';
import EditTripPointFormView from '../view/edit-trip-point-form-view.js';
import {render} from '../render.js';

export default class TripBoardPresenter {
  tripListComponent = new TripListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new SortView(), this.boardContainer);
    render(this.tripListComponent, this.boardContainer);
    render(new CreateTripPointFormView(), this.tripListComponent.getElement());
    render(new EditTripPointFormView(), this.tripListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new TripPointView(), this.tripListComponent.getElement());
    }
  }
}
