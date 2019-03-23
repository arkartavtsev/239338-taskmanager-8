import * as moment from 'moment';

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
      isFavorite: data.isFavorite,
      isDone: data.isDone
    };

    this._editBtn = null;

    this._onEdit = null;

    this._onEditBtnClick = this._onEditBtnClick.bind(this);
  }


  _isRepeated() {
    return WEEK_DAYS.some((day) => this._repeatingDays[day]);
  }


  _addHashtags() {
    return Array.from(this._tags).map((tag) => `
      <span class="card__hashtag-inner">
        <button type="button" class="card__hashtag-name">
         #${tag}
        </button>
      </span>
    `).join(``);
  }

  get template() {
    return `
      <article class="card card--${this._color} ${this._isRepeated() ? `card--repeat` : ``} ${this._dueDate && this._dueDate <= Date.now() ? `card--deadline` : ``}">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
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
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      name="date"
                      value="${this._dueDate ? moment(this._dueDate).format(`D MMMM`) : ``}"
                      disabled
                    />
                  </label>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__time"
                      type="text"
                      name="time"
                      value="${this._dueDate ? moment(this._dueDate).format(`h:mm A`) : ``}"
                      disabled
                    />
                  </label>
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
                disabled
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


  update(data) {
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
  }


  _onEditBtnClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }


  addElements() {
    this._editBtn = this._element.querySelector(`.card__btn--edit`);
  }

  addListeners() {
    this._editBtn.addEventListener(`click`, this._onEditBtnClick);
  }


  removeElements() {
    this._editBtn = null;
  }

  removeListeners() {
    this._editBtn.removeEventListener(`click`, this._onEditBtnClick);
  }
}
