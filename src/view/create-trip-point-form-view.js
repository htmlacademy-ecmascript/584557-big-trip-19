import he from 'he';
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
    `<datalist id="destination-list">
      ${destinations.map(getEventDestinationsDataListItemTemplate).join('')}
    </datalist>`
  );
}

function getAvailableOfferTemplate(offersData, isActive) {
  const {price, title, id} = offersData;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${id}" ${isActive ? 'checked' : ''}>
      <label class="event__offer-label" for="${id}">
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

function createCreateTripPointFormTemplate(state, allOffers, destinations) {
  const {
    type,
    dateFrom,
    dateTo,
    activeDestination,
    basePrice,
    offers
  } = state;

  const eventTimeStart = getFormTimeString(dateFrom);
  const eventTimeEnd = getFormTimeString(dateTo);
  const offersByCurrentPointType = allOffers[type];

  let name, description, pictures;
  if(activeDestination) {
    name = he.encode(activeDestination.name);
    description = activeDestination.description;
    pictures = activeDestination.pictures;
  }

  const offersTypesListTemplate = getEventTypeListTemplate(Object.keys(allOffers));
  const destinationsDataListTemplate = getEventDestinationsDataListTemplate(destinations);
  const availableOffersTemplate = getAvailableOffersTemplate(offersByCurrentPointType, offers);
  const eventPhotosTemplate = getEventPhotosTemplate(pictures || []);

  const allowsDestinationsNames = destinations.map((destination) => destination.name);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">

            ${offersTypesListTemplate}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination">
              ${type}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination"
              type="text"
              name="event-destination" value="${name || ''}"
              list="destination-list"
              aoutocmplete="off"
              pattern="^(${allowsDestinationsNames.join('|')})$"
            >
            ${destinationsDataListTemplate}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time">From</label>
            <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="${eventTimeStart}">
            &mdash;
            <label class="visually-hidden" for="event-end-time">To</label>
            <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="${eventTimeEnd}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price" type="number" name="event-price" value="${basePrice || 0}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
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

export default class CreateTripPointFormView extends AbstractStatefulView {
  #allOffers;
  #destinations;
  #handleFormSubmit;
  #handleFormReset;

  constructor({ allOffers, destinations, onFormSubmit, onFormReset }) {
    super();

    this.#allOffers = allOffers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormReset = onFormReset;

    const initState = {
      type: 'taxi',
      dateFrom: null,
      dateTo: null,
      destination: null,
      activeDestination: null,
      basePrice: null,
      offers: []
    };

    this._setState(this.parsePointToState(initState));

    this._restoreHandlers();
  }

  get template() {
    return createCreateTripPointFormTemplate(
      this._state,
      this.#allOffers,
      this.#destinations
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event')
      .addEventListener('reset', this.#formResetHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#pointDestinationChangeHandler);

    this.element.querySelectorAll('.event__type-input').forEach((typeInputElement) => {
      typeInputElement.addEventListener('change', this.#pointTypeChangeHandler);
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    this.#handleFormSubmit(this.parseStateToPoint(this._state));
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();

    this.#handleFormReset();
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
