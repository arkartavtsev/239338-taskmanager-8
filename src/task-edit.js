import flatpickr from 'flatpickr';
import * as moment from 'moment';

import {WEEK_DAYS, CARD_COLORS} from './const';

import Component from './component';


export default class TaskEdit extends Component {
  constructor(data) {
    super(data);

    this._id = data.id;

    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._picture = data.picture;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;

    this._state = {
      isDate: this._dueDate ? true : false,
      isRepeated: WEEK_DAYS.some((day) => this._repeatingDays[day]),

      isFavorite: data.isFavorite,
      isDone: data.isDone,
    };

    this._datePicker = null;
    this._timePicker = null;

    this._onSubmit = null;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);
    this._onChangeColor = this._onChangeColor.bind(this);
  }


  _isRepeated() {
    return WEEK_DAYS.some((day) => this._repeatingDays[day]);
  }


  _addRepeatingDays() {
    return WEEK_DAYS.map((day) => `
      <input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${this._id}"
        name="repeat"
        value="${day}"
        ${this._repeatingDays[day] ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}-${this._id}">${day}</label>
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
        <button type="button" class="card__hashtag-delete">delete</button>
      </span>
    `).join(``);
  }

  _addColorPickers() {
    return CARD_COLORS.map((color) => `
      <input
        type="radio"
        id="color-${color}-${this._id}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${color === this._color ? `checked` : ``}
      />
      <label for="color-${color}-${this._id}" class="card__color card__color--${color}">${color}</label>
    `).join(``);
  }

  get template() {
    return `
      <article class="card card--edit card--${this._color} ${this._isRepeated() ? `card--repeat` : ``} ${this._dueDate && this._dueDate <= Date.now() ? `card--deadline` : ``}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--edit card__btn--disabled">
                edit
              </button>
              <button type="button" class="card__btn card__btn--archive">
                archive
              </button>
              <button type="button" class="card__btn card__btn--favorites card__btn--disabled">
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
                    date: <span class="card__date-status">${this._state.isDate ? `yes` : `no`}</span>
                  </button>

                  <fieldset class="card__date-deadline" ${this._state.isDate ? `` : `disabled`}>
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        name="date"
                        value="${this._dueDate ? moment(this._dueDate).format(`D MMMM`) : moment().format(`D MMMM`)}"
                      />
                    </label>
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__time"
                        type="text"
                        name="time"
                        value="${this._dueDate ? moment(this._dueDate).format(`h:mm A`) : moment().format(`h:mm A`)}"
                      />
                    </label>
                  </fieldset>

                  <button class="card__repeat-toggle" type="button">
                    repeat:<span class="card__repeat-status">${this._isRepeated() ? `yes` : `no`}</span>
                  </button>

                  <fieldset class="card__repeat-days" ${this._isRepeated() ? `` : `disabled`}>
                    <div class="card__repeat-days-inner">
                      ${this._addRepeatingDays()}
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
                  ${this._addColorPickers()}
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


  set onSubmit(fn) {
    this._onSubmit = fn;
  }


  update(data) {
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._state.isRepeated = this._isRepeated();
  }


  static createMapper(target) {
    return {
      hashtag: (value) => {
        target.tags.add(value);
      },
      text: (value) => {
        target.title = value;
      },
      color: (value) => {
        target.color = value;
      },
      repeat: (value) => {
        target.repeatingDays[value] = true;
      },
      date: (value) => {
        target.dueDate = moment(value, `DD MMMM`).valueOf();
      },
      time: (value) => {
        target.dueDate += moment(value, `hh:mm a`).valueOf() - moment(value, `hh:mm a`).startOf(`day`).valueOf();
      }
    };
  }

  _processForm(formData) {
    const entry = {
      title: ``,
      dueDate: 0,
      tags: new Set(),
      color: ``,
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      }
    };

    const taskEditMapper = TaskEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;

      if (taskEditMapper[property]) {
        taskEditMapper[property](value);
      }
    }

    return entry;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();

    const formData = new FormData(this._element.querySelector(`.card__form`));
    const newData = this._processForm(formData);

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }


  _onChangeDate() {
    this._state.isDate = !this._state.isDate;

    const dateStatus = this._element.querySelector(`.card__date-status`);
    const dateInputs = this._element.querySelector(`.card__date-deadline`);

    if (this._state.isDate) {
      dateStatus.textContent = `yes`;
      dateInputs.disabled = false;
    } else {
      dateStatus.textContent = `no`;
      dateInputs.disabled = true;
    }
  }

  _onChangeRepeated() {
    this._state.isRepeated = !this._state.isRepeated;

    const repeatStatus = this._element.querySelector(`.card__repeat-status`);
    const daysPickers = this._element.querySelector(`.card__repeat-days`);

    if (this._state.isRepeated) {
      this._element.classList.add(`card--repeat`);
      repeatStatus.textContent = `yes`;
      daysPickers.disabled = false;
    } else {
      this._element.classList.remove(`card--repeat`);
      repeatStatus.textContent = `no`;
      daysPickers.disabled = true;
    }
  }

  _onChangeColor(evt) {
    this._element.classList.remove(`card--${this._color}`);
    this._element.classList.add(`card--${evt.target.value}`);

    this._color = evt.target.value;
  }


  addListeners() {
    this._element.querySelector(`.card__form`)
      .addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, this._onChangeRepeated);


    const colorPickers = this._element.querySelectorAll(`.card__color-input`);

    for (const picker of colorPickers) {
      picker.addEventListener(`click`, this._onChangeColor);
    }


    this._datePicker = flatpickr(this._element.querySelector(`.card__date`), {
      dateFormat: `j F`,
      minDate: `today`
    });

    this._timePicker = flatpickr(this._element.querySelector(`.card__time`), {
      enableTime: true,
      noCalendar: true,
      dateFormat: `h:i K`
    });
  }

  removeListeners() {
    this._element.querySelector(`.card__form`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`)
      .removeEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`)
      .removeEventListener(`click`, this._onChangeRepeated);


    const colorPickers = this._element.querySelectorAll(`.card__color-input`);

    for (const picker of colorPickers) {
      picker.removeEventListener(`click`, this._onChangeColor);
    }


    if (this._datePicker) {
      this._datePicker.destroy();
      this._datePicker = null;
    }

    if (this._timePicker) {
      this._timePicker.destroy();
      this._timePicker = null;
    }
  }
}
