import {CARD_COLORS} from './const';
import {addContentToContainer} from './util';


const isCardRepeating = (repeatingDays) => {
  for (const day in repeatingDays) {
    if (repeatingDays[day] === true) {
      return true;
    }
  }

  return false;
};


const addDateTime = (milliseconds) => {
  const dateTime = new Date(milliseconds);

  const dateOptions = {
    day: `numeric`,
    month: `long`
  };

  const timeOptions = {
    hour: `numeric`,
    minute: `numeric`
  };

  const date = dateTime.toLocaleString(`en-GB`, dateOptions);
  const time = dateTime.toLocaleString(`en-US`, timeOptions);

  return `
    <label class="card__input-deadline-wrap">
      <input
        class="card__date"
        type="text"
        placeholder="${date}"
        name="date"
        value="${date}"
      />
    </label>
    <label class="card__input-deadline-wrap">
      <input
        class="card__time"
        type="text"
        placeholder="${time}"
        name="time"
        value="${time}"
      />
    </label>
  `;
};

const addRepeatingDays = (repeatingDays, idCounter) => {
  let markupFragment = ``;

  for (const day in repeatingDays) {
    if (day) {
      markupFragment += `
      <input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${idCounter}"
        name="repeat"
        value="${day}"
        ${repeatingDays[day] ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}-${idCounter}">${day}</label>
      `;
    }
  }

  return markupFragment;
};

const addHashtags = (tags) => Array.from(tags).map((tag) => `
  <span class="card__hashtag-inner">
   <input
     type="hidden"
     name="hashtag"
     value="${tag}"
     class="card__hashtag-hidden-input"
   />
   <button type="button" class="card__hashtag-name">
     #${tag}
   </button>
   <button type="button" class="card__hashtag-delete">
     delete
   </button>
  </span>
`).join(``);

const addColorPickers = (possibleColors, currentColor, idCounter) => possibleColors.map((color) => `
  <input
    type="radio"
    id="color-${color}-${idCounter}"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${color === currentColor ? `checked` : ``}
  />
  <label for="color-${color}-${idCounter}" class="card__color card__color--${color}">${color}</label>
`).join(``);


const createCard = (cardData, idCounter) => `
  <article class="card card--${cardData.color} ${isCardRepeating(cardData.repeatingDays) ? `card--repeat` : ``} ${cardData.dueDate < Date.now() ? `card--deadline` : ``}">
    <form class="card__form" method="get">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--edit">
            edit
          </button>
          <button type="button" class="card__btn card__btn--archive">
            archive
          </button>
          <button
            type="button"
            class="card__btn card__btn--favorites card__btn--disabled"
          >
            favorites
          </button>
        </div>

        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
          <label>
            <textarea
              class="card__text"
              placeholder="Start typing your text here..."
              name="text"
            >${cardData.title}</textarea>
          </label>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <button class="card__date-deadline-toggle" type="button">
                date: <span class="card__date-status">${cardData.dueDate ? `yes` : `no`}</span>
              </button>

              <fieldset class="card__date-deadline" ${cardData.dueDate ? `` : `disabled`}>
                ${addDateTime(cardData.dueDate)}
              </fieldset>

              <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">${isCardRepeating(cardData.repeatingDays) ? `yes` : `no`}</span>
              </button>

              <fieldset class="card__repeat-days" ${isCardRepeating(cardData.repeatingDays) ? `` : `disabled`}>
                <div class="card__repeat-days-inner">
                  ${addRepeatingDays(cardData.repeatingDays, idCounter)}
                </div>
              </fieldset>
            </div>

            <div class="card__hashtag">
              <div class="card__hashtag-list">
                ${addHashtags(cardData.tags)}
              </div>

              <label>
                <input
                  type="text"
                  class="card__hashtag-input"
                  name="hashtag-input"
                  placeholder="Type new hashtag here"
                />
              </label>
            </div>
          </div>

          <label class="card__img-wrap">
            <input
              type="file"
              class="card__img-input visually-hidden"
              name="img"
            />
            <img
              src="${cardData.picture}"
              alt="task picture"
              class="card__img"
            />
          </label>

          <div class="card__colors-inner">
            <h3 class="card__colors-title">Color</h3>
            <div class="card__colors-wrap">
              ${addColorPickers(CARD_COLORS, cardData.color, idCounter)}
            </div>
          </div>
        </div>

        <div class="card__status-btns">
          <button class="card__save" type="submit">save</button>
          <button class="card__delete" type="button">delete</button>
        </div>
      </div>
    </form>
  </article>
`;


export default (count, data, container) => {
  let cardsMarkup = ``;

  for (let i = 0; i < count; i++) {
    cardsMarkup += createCard(data[i], i);
  }

  addContentToContainer(cardsMarkup, container);
};
