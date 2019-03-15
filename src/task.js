import {WEEK_DAYS} from './const';

import Component from './component';


export default class Task extends Component {
  constructor(data) {
    super();

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

    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
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
      </span>
    `).join(``);
  }

  get template() {
    return `
      <article class="card card--${this._color} ${this._state.isRepeated ? `card--repeat` : ``} ${this._state.isOverdue ? `card--deadline` : ``}">
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
            <label class="card__text">
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
                disabled
              >${this._title}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <fieldset class="card__date-deadline" ${this._dueDate ? `` : `disabled`}>
                  ${this._addDateTime()}
                </fieldset>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${this._addHashtags()}
                </div>
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
          </div>
        </div>
      </article>
    `.trim();
  }


  set onEdit(fn) {
    this._onEdit = fn;
  }

  _onEditButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }


  addListeners() {
    this._element.querySelector(`.card__btn--edit`)
      .addEventListener(`click`, this._onEditButtonClick);
  }

  removeListeners() {
    this._element.querySelector(`.card__btn--edit`)
      .removeEventListener(`click`, this._onEditButtonClick);
  }
}
