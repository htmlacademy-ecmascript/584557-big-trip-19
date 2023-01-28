import { points } from '../mock/trip-points.js';
import { keysToCamel } from '../utils/common.js';

export default class TripPointsModel {
  #tripPoints = points.map(keysToCamel);

  get points() {
    return this.#tripPoints;
  }
}
