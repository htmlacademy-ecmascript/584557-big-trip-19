import { points } from '../mock/trip-points.js';

export default class TripPointsModel {
  _tripPoints = points;

  get points() {
    return this._tripPoints;
  }
}
