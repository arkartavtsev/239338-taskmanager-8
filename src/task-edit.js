import flatpickr from 'flatpickr';
import * as moment from 'moment';

import {WEEK_DAYS, CARD_COLORS} from './const';

import Component from './component';


export default class TaskEdit extends Component {
  constructor(data) {
    super();

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


    this._form = null;
    this._cardInner = null;
    this._submitBtn = null;
    this._deleteBtn = null;

    this._dateToggle = null;
    this._dateStatus = null;
    this._dateInputsGroup = null;
    this._dateInput = null;
    this._timeInput = null;
    this._datePicker = null;
    this._timePicker = null;

    this._repeatTogle = null;
    this._repeatStatus = null;
    this._repeatingDaysPickers = null;

    this._colorPickers = null;


    this._onSave = null;
    this._onDelete = null;


    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onDeleteBtnClick = this._onDeleteBtnClick.bind(this);

    this._onDateToggleClick = this._onDateToggleClick.bind(this);

    this._onRepeatToggleClick = this._onRepeatToggleClick.bind(this);

    this._onColorPickerClick = this._onColorPickerClick.bind(this);
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
              <button type="button" class="card__btn card__btn--archive card__btn--disabled">
                ${this._state.isDone ? `restore` : `archive`}
              </button>
              <button type="button" class="card__btn card__btn--favorites card__btn--disabled">
                ${this._state.isFavorite ? `unfavorite` : `favorite`}
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


  set onSave(fn) {
    this._onSave = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }


  update(data) {
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._state.isRepeated = this._isRepeated();
  }

  blockCard() {
    this._submitBtn.disabled = true;
    this._deleteBtn.disabled = true;
  }

  unblockCard() {
    this._submitBtn.textContent = `Save`;
    this._deleteBtn.textContent = `Delete`;

    this._submitBtn.disabled = false;
    this._deleteBtn.disabled = false;
  }

  showError() {
    const ANIMATION_TIMEOUT = 600;

    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    this._cardInner.style.borderColor = `red`;

    setTimeout(() => {
      this._element.style.animation = ``;
      this._cardInner.style.borderColor = `black`;

      this.unblockCard();
    }, ANIMATION_TIMEOUT);
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

  _onFormSubmit(evt) {
    evt.preventDefault();

    const formData = new FormData(this._element.querySelector(`.card__form`));
    const newData = this._processForm(formData);

    if (typeof this._onSave === `function`) {
      this._onSave(newData);
      this._submitBtn.textContent = `Saving...`;
    }

    this.update(newData);
  }


  _onDeleteBtnClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete(this._id);
      this._deleteBtn.textContent = `Deleting...`;
    }
  }


  _onDateToggleClick() {
    this._state.isDate = !this._state.isDate;

    if (this._state.isDate) {
      this._dateStatus.textContent = `yes`;
      this._dateInputsGroup.disabled = false;
    } else {
      this._dateStatus.textContent = `no`;
      this._dateInputsGroup.disabled = true;
    }
  }


  _onRepeatToggleClick() {
    this._state.isRepeated = !this._state.isRepeated;

    if (this._state.isRepeated) {
      this._element.classList.add(`card--repeat`);
      this._repeatStatus.textContent = `yes`;
      this._repeatingDaysPickers.disabled = false;
    } else {
      this._element.classList.remove(`card--repeat`);
      this._repeatStatus.textContent = `no`;
      this._repeatingDaysPickers.disabled = true;
    }
  }


  _onColorPickerClick(evt) {
    this._element.classList.remove(`card--${this._color}`);
    this._element.classList.add(`card--${evt.target.value}`);

    this._color = evt.target.value;
  }


  addElements() {
    this._form = this._element.querySelector(`.card__form`);
    this._cardInner = this._element.querySelector(`.card__inner`);
    this._submitBtn = this._element.querySelector(`.card__save`);
    this._deleteBtn = this._element.querySelector(`.card__delete`);

    this._dateToggle = this._element.querySelector(`.card__date-deadline-toggle`);
    this._dateStatus = this._element.querySelector(`.card__date-status`);
    this._dateInputsGroup = this._element.querySelector(`.card__date-deadline`);
    this._dateInput = this._element.querySelector(`.card__date`);
    this._timeInput = this._element.querySelector(`.card__time`);

    this._repeatTogle = this._element.querySelector(`.card__repeat-toggle`);
    this._repeatStatus = this._element.querySelector(`.card__repeat-status`);
    this._repeatingDaysPickers = this._element.querySelector(`.card__repeat-days`);

    this._colorPickers = this._element.querySelectorAll(`.card__color-input`);
  }

  addListeners() {
    this._form.addEventListener(`submit`, this._onFormSubmit);
    this._deleteBtn.addEventListener(`click`, this._onDeleteBtnClick);

    this._dateToggle.addEventListener(`click`, this._onDateToggleClick);

    this._repeatTogle.addEventListener(`click`, this._onRepeatToggleClick);

    for (const picker of this._colorPickers) {
      picker.addEventListener(`click`, this._onColorPickerClick);
    }

    this._datePicker = flatpickr(this._dateInput, {
      dateFormat: `j F`,
      minDate: `today`
    });

    this._timePicker = flatpickr(this._timeInput, {
      enableTime: true,
      noCalendar: true,
      dateFormat: `h:i K`
    });
  }


  removeElements() {
    this._form = null;
    this._cardInner = null;
    this._submitBtn = null;
    this._deleteBtn = null;

    this._dateToggle = null;
    this._dateStatus = null;
    this._dateInputsGroup = null;
    this._dateInput = null;
    this._timeInput = null;

    this._repeatTogle = null;
    this._repeatStatus = null;
    this._repeatingDaysPickers = null;

    this._colorPickers = null;
  }

  removeListeners() {
    this._form.removeEventListener(`submit`, this._onFormSubmit);
    this._deleteBtn.removeEventListener(`click`, this._onDeleteBtnClick);

    this._dateToggle.removeEventListener(`click`, this._onDateToggleClick);

    this._repeatTogle.removeEventListener(`click`, this._onRepeatToggleClick);

    for (const picker of this._colorPickers) {
      picker.removeEventListener(`click`, this._onColorPickerClick);
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
