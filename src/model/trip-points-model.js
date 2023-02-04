import Observable from '../framework/observable.js';
import { keysToCamel } from '../utils/common.js';

export default class TripPointsModel extends Observable {
  #tripPoints;

  constructor(tripPoints) {
    super();

    this.points = tripPoints;
  }

  set points(tripPoints) {
    this.#tripPoints = tripPoints.map(keysToCamel);
  }

  get points() {
    return this.#tripPoints;
  }

  addPoint(updateType, newPoint) {
    this.#tripPoints = [
      newPoint,
      ...this.#tripPoints
    ];

    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, pointData) {
    const index = this.#tripPoints.findIndex((point) => point.id === pointData.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#tripPoints = [
      ...this.#tripPoints.slice(0, index),
      ...this.#tripPoints.slice(index + 1),
    ];

    this._notify(updateType);
  }

  updatePoint(updateType, updatedPoint) {
    const index = this.#tripPoints.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#tripPoints = [
      ...this.#tripPoints.slice(0, index),
      updatedPoint,
      ...this.#tripPoints.slice(index + 1),
    ];

    this._notify(updateType, updatedPoint);
  }
}
