import AbstractView from '../framework/view/abstract-view.js';
import { getTimeDiffString, getEventDateString, getEventTimeString } from '../utils/date.js';

function createTripPointOffersListTemplate(offersData, offersIds) {
  const offersItems = offersIds.map(
    (offerId) => {
      const offerData = offersData.find(({id}) => id === offerId);
      const {title, price} = offerData;

      return `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`;
    })
    .join('');

  return (
    `<ul class="event__selected-offers">
      ${offersItems}
    </ul>`
  );
}

function createTripPointTemplate(pointData, offersData) {
  const {
    base_price: price,
    date_from: dateFrom,
    date_to: dateTo,
    destination,
    is_favorite: isFavorite,
    offers,
    type
  } = pointData;

  const offersListTemplate = createTripPointOffersListTemplate(offersData, offers);

  const favoriteClasses = `event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}`;

  const duration = getTimeDiffString(dateFrom, dateTo);
  const eventDate = getEventDateString(dateFrom);
  const eventStartTime = getEventTimeString(dateFrom);
  const eventEndTime = getEventTimeString(dateTo);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${eventDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${eventStartTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${eventEndTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${offersListTemplate}

        <button class="${favoriteClasses}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class TripPointView extends AbstractView {
  #point;
  #offers;
  #handleEditClick;

  constructor(point, offers, onRollupClick) {
    super();

    this.#point = point;
    this.#offers = offers;
    this.#handleEditClick = onRollupClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
  }

  get template() {
    return createTripPointTemplate(this.#point, this.#offers);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
