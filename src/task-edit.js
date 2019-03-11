import {WEEK_DAYS, CARD_COLORS} from './const';
import {createElement} from './util';


export default class TaskEdit {
  constructor(data) {
    this._id = data.id;
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._picture = data.picture;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;

    this._state = {
      isRepeated: WEEK_DAYS.some((day) => this._repeatingDays[day]),
      isOverdue: this._dueDate < Date.now(),
      isFavorite: data.isFavorite,
      isDone: data.isDone
    };

    this._element = null;

    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
  }


  _addDateTime() {
    const dateTime = new Date(this._dueDate);

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
  }

  _addRepeatingDays(idCounter) {
    return WEEK_DAYS.map((day) => `
      <input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${idCounter}"
        name="repeat"
        value="${day}"
        ${this._repeatingDays[day] ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}-${idCounter}">${day}</label>
    `).join(``);
  }

  _addHashtags() {
    return Array.from(this._tags).map((tag) => `
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
  }

  _addColorPickers(idCounter) {
    return CARD_COLORS.map((color) => `
      <input
        type="radio"
        id="color-${color}-${idCounter}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${color === this._color ? `checked` : ``}
      />
      <label for="color-${color}-${idCounter}" class="card__color card__color--${color}">${color}</label>
    `).join(``);
  }

  get template() {
    return `
      <article class="card card--edit card--${this._color} ${this._state.isRepeated ? `card--repeat` : ``} ${this._state.isOverdue ? `card--deadline` : ``}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--edit card__btn--disabled">
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
                >${this._title}</textarea>
              </label>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <button class="card__date-deadline-toggle" type="button">
                    date: <span class="card__date-status">${this._dueDate ? `yes` : `no`}</span>
                  </button>

                  <fieldset class="card__date-deadline" ${this._dueDate ? `` : `disabled`}>
                    ${this._addDateTime()}
                  </fieldset>

                  <button class="card__repeat-toggle" type="button">
                    repeat:<span class="card__repeat-status">${this._state.isRepeated ? `yes` : `no`}</span>
                  </button>

                  <fieldset class="card__repeat-days" ${this._state.isRepeated ? `` : `disabled`}>
                    <div class="card__repeat-days-inner">
                      ${this._addRepeatingDays(this._id)}
                    </div>
                  </fieldset>
                </div>

                <div class="card__hashtag">
                  <div class="card__hashtag-list">
                    ${this._addHashtags()}
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
                  src="${this._picture}"
                  alt="task picture"
                  class="card__img"
                />
              </label>

              <div class="card__colors-inner">
                <h3 class="card__colors-title">Color</h3>
                <div class="card__colors-wrap">
                  ${this._addColorPickers(this._id)}
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
    `.trim();
  }


  get element() {
    return this._element;
  }


  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();

    if (typeof this._onSubmit === `function`) {
      this._onSubmit();
    }
  }

  bind() {
    this._element.querySelector(`.card__form`)
      .addEventListener(`submit`, this._onSubmitButtonClick);
  }

  unbind() {
    this._element.querySelector(`.card__form`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
  }


  render() {
    this._element = createElement(this.template);
    this.bind();

    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}
