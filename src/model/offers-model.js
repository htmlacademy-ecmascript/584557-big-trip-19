export default class OffersModel {
  #offers;

  constructor(offersData) {
    this.#offers = offersData.reduce((acc, offer) => {
      acc[offer.type] = offer.offers;

      return acc;
    }, {});
  }

  set offers(offersData) {
    this.#offers = offersData;
  }

  get offers() {
    return this.#offers;
  }
}
