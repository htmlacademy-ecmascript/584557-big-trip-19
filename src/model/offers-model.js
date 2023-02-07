export default class OffersModel {
  #pointsApiService = null;
  #offers = [];

  constructor({ offersApiService }) {
    this.#pointsApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const offers = await this.#pointsApiService.offers;

      this.#offers = offers.reduce((acc, offer) => {
        acc[offer.type] = offer.offers;

        return acc;
      }, {});
    } catch(err) {
      this.#offers = [];
    }
  }
}
