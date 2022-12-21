import { points } from '../mock/trip-points.js';

export default class TripPointsModel {
  #tripPoints = points;

  get points() {
    return this.#tripPoints;
  }
}
