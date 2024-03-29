import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { FLATPICKR_DATE_FORMAT } from '../constants.js';
import { capitalize } from '../utils/string.js';
import { getFormTimeString } from '../utils/date.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

function getEventTypeListItemTemplate(offersType, idx, isDisabled) {
  return (
    `<div class="event__type-item">
      <input id="event-type-${offersType}-${idx}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${offersType}" ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${offersType}" for="event-type-${offersType}-${idx}">${capitalize(offersType)}</label>
    </div>`
  );
}

function getEventTypeListTemplate(offersTypes, isDisabled) {
  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>

        ${offersTypes.map((offerType) => getEventTypeListItemTemplate(offerType, isDisabled)).join('')}
      </fieldset>
    </div>`
  );
}

function getEventDestinationsDataListItemTemplate({ name: destinationName }) {
  return (`<option value="${destinationName}"></option>`);
}

function getEventDestinationsDataListTemplate(destinations) {
  return (
    `<datalist id="destination-list-1">
      ${destinations.map(getEventDestinationsDataListItemTemplate).join('')}
    </datalist>`
  );
}

function getAvailableOfferTemplate(offersData, isActive, isDisabled) {
  const { price, title, id } = offersData;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${id}-1" type="checkbox" name="${id}" value=${id} ${isActive ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="${id}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
}

function getAvailableOffersTemplate(offersData, pointActiveOffers, isDisabled) {
  return (
    `<div class="event__available-offers">
      ${offersData.map((offerData) => {
      const isAtiveOffer = pointActiveOffers.includes(offerData.id);

      return getAvailableOfferTemplate(offerData, isAtiveOffer, isDisabled);
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

function getEventPhotoTemplate({ src, description }) {
  return (`<img class="event__photo" src="${src}" alt="${description}">`);
}

function createEditTripPointFormTemplate(pointData, allOffers, destinations) {
  const {
    basePrice,
    dateFrom,
    dateTo,
    activeDestination,
    destination,
    offers,
    type,
    isDisabled,
    isSaving,
    isDeleting
  } = pointData;

  const { name, description, pictures } = activeDestination;

  const eventTimeStart = getFormTimeString(dateFrom);
  const eventTimeEnd = getFormTimeString(dateTo);
  const offersByCurrentPointType = allOffers[type];

  const offersTypesListTemplate = getEventTypeListTemplate(Object.keys(allOffers), isDisabled);
  const destinationsDataListTemplate = getEventDestinationsDataListTemplate(destinations);
  const availableOffersTemplate = getAvailableOffersTemplate(offersByCurrentPointType, offers, isDisabled);
  const eventPhotosTemplate = getEventPhotosTemplate(pictures);

  const allowsDestinationsNames = destinations.map((destinationData) => destinationData.name);
  const isSubmitDisabled = !basePrice || !dateFrom || !dateTo || !type || !destination;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            ${offersTypesListTemplate}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
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
              ${isDisabled ? 'disabled' : ''}
            >
            ${destinationsDataListTemplate}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventTimeStart || ''}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventTimeEnd || ''}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="0" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button
            class="event__save-btn  btn  btn--blue"
            type="submit"
            ${isSubmitDisabled || isDisabled ? 'disabled' : ''}
          >
            ${isSaving ? '...Saving' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset">
            ${isDeleting ? '...Deleting' : 'Delete'}
          </button>
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
  #point;
  #allOffers;
  #destinations;
  #handleSubmit;
  #handleDeleteClick;
  #handleRollupBtnClick;
  #datepickers = [];

  constructor({ point, allOffers, destinations, onFormSubmit, onFormReset, onRollupBtnClick }) {
    super();

    this.#point = point;
    this.#allOffers = allOffers;
    this.#destinations = destinations;
    this.#handleSubmit = onFormSubmit;
    this.#handleDeleteClick = onFormReset;
    this.#handleRollupBtnClick = onRollupBtnClick;

    this._setState(this.parsePointToState(this.#point));

    this._restoreHandlers();
  }

  get template() {
    return createEditTripPointFormTemplate(
      this._state,
      this.#allOffers,
      this.#destinations
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickers) {
      this.#datepickers.forEach((datepicker) => {
        datepicker.destroy();
      });
      this.#datepickers = [];
    }
  }

  _restoreHandlers() {
    this.element.querySelector('.event')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event')
      .addEventListener('reset', this.#formDeleteClickHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupBtnClickHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#pointDestinationChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#pointPriceChangeHandler);

    this.element.querySelectorAll('.event__type-input').forEach((typeInputElement) => {
      typeInputElement.addEventListener('change', this.#pointTypeChangeHandler);
    });

    this.element.querySelectorAll('.event__offer-checkbox').forEach((offerInputElement) => {
      offerInputElement.addEventListener('change', this.#pointOfferChangeHandler);
    });

    this.#setDateFromPickers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(this.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this.parseStateToPoint(this._state));
  };

  #rollupBtnClickHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      ...this.parsePointToState(this.#point)
    });

    this.#handleRollupBtnClick();
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

  #pointOfferChangeHandler = (evt) => {
    evt.preventDefault();

    const newOffer = Number(evt.target.value);
    const newOffers = this._state.offers.includes(newOffer) ?
      this._state.offers.filter((offer) => offer !== newOffer) :
      [...this._state.offers, newOffer];

    this.updateElement({
      offers: newOffers,
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();

    const newDestinationName = evt.target.value;
    const newDestination = this.#destinations.find(({ name }) => name === newDestinationName);

    if(newDestination) {
      this.updateElement({
        destination: newDestination.id,
        activeDestination: newDestination
      });
    } else {
      evt.target.value = this._state.activeDestination.name;
    }
  };

  #pointPriceChangeHandler = (evt) => {
    evt.preventDefault();

    const newPrice = Number(evt.target.value) < 0 ? 0 : Number(evt.target.value);

    this.updateElement({
      basePrice: newPrice,
    });
  };

  #setDateFromPickers() {
    this.#setDateFromPicker();
    this.#setDateToPicker();
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDateFromPicker() {
    this.#datepickers.push(
      flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          dateFormat: FLATPICKR_DATE_FORMAT,
          maxDate: this._state.dateTo,
          maxTime: this._state.dateTo,
          enableTime: true,
          // eslint-disable-next-line
          time_24hr: true,
          onClose: this.#dateFromChangeHandler,
        },
      )
    );
  }

  #setDateToPicker() {
    this.#datepickers.push(
      flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          dateFormat: FLATPICKR_DATE_FORMAT,
          minDate: this._state.dateFrom,
          minTime: this._state.dateFrom,
          enableTime: true,
          // eslint-disable-next-line
          time_24hr: true,
          onClose: this.#dateToChangeHandler,
        },
      )
    );
  }

  parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
      activeDestination: this.#destinations.find(({id}) => id === point.destination)
    };
  }

  parseStateToPoint(state) {
    const point = { ...state };

    delete point.activeDestination;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return {
      ...point,
    };
  }
}
