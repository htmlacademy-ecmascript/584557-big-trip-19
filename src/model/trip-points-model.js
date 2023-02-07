import Observable from '../framework/observable.js';
import { keysToCamel } from '../utils/common.js';

export default class TripPointsModel extends Observable {
  #pointsApiService = null;
  #tripPoints = [];

  constructor({ pointsApiService }) {
    super();

    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#tripPoints;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;

      this.#tripPoints = points.map(this.#adaptToClient);
    } catch(err) {
      this.#tripPoints = [];
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);

      this.#tripPoints = [newPoint, ...this.#tripPoints];

      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#tripPoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#tripPoints = [
        ...this.#tripPoints.slice(0, index),
        ...this.#tripPoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error(err);
    }
  }

  async updatePoint(updateType, update) {
    const index = this.#tripPoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#tripPoints = [
        ...this.#tripPoints.slice(0, index),
        updatedPoint,
        ...this.#tripPoints.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  #adaptToClient(point) {
    return keysToCamel(point);
  }
}
