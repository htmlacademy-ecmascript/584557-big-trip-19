import { destinations } from '../mock/destinations.js';

export default class DestinationsModel {
  _destinations = destinations;

  get destinations() {
    return this._destinations;
  }
}
