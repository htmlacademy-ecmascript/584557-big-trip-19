import { offers, offersTypes } from '../mock/offers.js';

export default class OffersModel {
  offers = offers.reduce((acc, offer) => {
    acc[offer.type] = offer.offers;

    return acc;
  }, {});

  offersTypes = offersTypes;
}
