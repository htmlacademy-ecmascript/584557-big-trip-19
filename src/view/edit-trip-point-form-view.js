import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { capitalize } from '../utils/string.js';
import { getFormTimeString } from '../utils/date.js';

function getEventTypeListItemTemplate(offersType, idx) {
  return (
    `<div class="event__type-item">
      <input id="event-type-${offersType}-${idx}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${offersType}">
      <label class="event__type-label  event__type-label--${offersType}" for="event-type-${offersType}-${idx}">${capitalize(offersType)}</label>
    </div>`
  );
}

function getEventTypeListTemplate(offersTypes) {
  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>

        ${offersTypes.map(getEventTypeListItemTemplate).join('')}
      </fieldset>
    </div>`
  );
}

function getEventDestinationsDataListItemTemplate({name: destinationName}) {
  return (`<option value="${destinationName}"></option>`);
}

function getEventDestinationsDataListTemplate(destinations) {
  return (
    `<datalist id="destination-list-1">
      ${destinations.map(getEventDestinationsDataListItemTemplate).join('')}
    </datalist>`
  );
}

function getAvailableOfferTemplate(offersData, isActive) {
  const {price, title, id} = offersData;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${id}-1" type="checkbox" name="${id}" ${isActive ? 'checked' : ''}>
      <label class="event__offer-label" for="${id}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
}

function getAvailableOffersTemplate(offersData, pointActiveOffers) {

  return (
    `<div class="event__available-offers">
      ${offersData.map((offerData) => {
      const isAtiveOffer = pointActiveOffers.includes(offerData.id);

      return getAvailableOfferTemplate(offerData, isAtiveOffer);
    })
      .join('')}
    </div>`
  );
}

function getEventPhotosTemplate(pictures) {
  return(
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures.map(getEventPhotoTemplate).join('')}
      </div>
    </div>`
  );
}

function getEventPhotoTemplate({src, description}) {
  return (`<img class="event__photo" src="${src}" alt="${description}">`);
}

function createEditTripPointFormTemplate(pointData, allOffers, destinations) {
  const {
    basePrice,
    dateFrom,
    dateTo,
    activeDestination,
    offers,
    type
  } = pointData;

  const { name, description, pictures } = activeDestination;

  const eventTimeStart = getFormTimeString(dateFrom);
  const eventTimeEnd = getFormTimeString(dateTo);
  const offersByCurrentPointType = allOffers[type];

  const offersTypesListTemplate = getEventTypeListTemplate(Object.keys(allOffers));
  const destinationsDataListTemplate = getEventDestinationsDataListTemplate(destinations);
  const availableOffersTemplate = getAvailableOffersTemplate(offersByCurrentPointType, offers);
  const eventPhotosTemplate = getEventPhotosTemplate(pictures);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            ${offersTypesListTemplate}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
            ${destinationsDataListTemplate}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventTimeStart}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventTimeEnd}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersByCurrentPointType.length ? `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            ${availableOffersTemplate}
          </section>` : ''}

         ${activeDestination ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            ${eventPhotosTemplate}
          </section>` : ''}
        </section>
      </form>
    </li>`
  );
}

export default class EditTripPointFormView extends AbstractStatefulView {
  #allOffers;
  #destinations;
  #handleSubmit;

  constructor({ point, allOffers, destinations, onFormSubmit }) {
    super();

    this.#allOffers = allOffers;
    this.#destinations = destinations;
    this.#handleSubmit = onFormSubmit;

    this._setState(this.parsePointToState(point));

    this._restoreHandlers();
  }

  get template() {
    return createEditTripPointFormTemplate(
      this._state,
      this.#allOffers,
      this.#destinations
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event')
      .addEventListener('submit', this.#formSubmit);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formSubmit);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#pointDestinationChangeHandler);

    [...this.element.querySelectorAll('.event__type-input')].forEach((typeInputElement) => {
      typeInputElement.addEventListener('change', this.#pointTypeChangeHandler);
    });
  }

  #formSubmit = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(this.parseStateToPoint(this._state));
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();

    const newType = evt.target.value;
    if(this._state.type !== newType) {
      this.updateElement({
        type: evt.target.value,
        offers: []
      });
    }
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();

    const newDestinationName = evt.target.value;
    const newDestination = this.#destinations.find(({ name }) => name === newDestinationName);

    this.updateElement({
      destination: newDestination.id,
      activeDestination: newDestination
    });
  };

  parsePointToState(point) {
    return {
      ...point,
      activeDestination: this.#destinations.find(({id}) => id === point.destination)
    };
  }

  parseStateToPoint(state) {
    const point = { ...state };

    delete point.activeDestination;

    return {
      ...point
    };
  }
}
