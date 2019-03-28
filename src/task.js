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

    this._cardInner = null;
    this._editBtn = null;
    this._archiveBtn = null;
    this._favoritesBtn = null;

    this._onEdit = null;
    this._onAddToArchive = null;
    this._onAddToFavorites = null;

    this._onEditBtnClick = this._onEditBtnClick.bind(this);
    this._archiveBtnClick = this._archiveBtnClick.bind(this);
    this._favoritesBtnClick = this._favoritesBtnClick.bind(this);
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
              ${this._state.isDone ? `unarch` : `archive`}
            </button>
            <button type="button" class="card__btn card__btn--favorites">
              ${this._state.isFavorite ? `unfavorite` : `favorite`}
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


  get archiveBtn() {
    return this._archiveBtn;
  }

  get favoriteBtn() {
    return this._favoriteBtn;
  }


  set onEdit(fn) {
    this._onEdit = fn;
  }

  set onAddToArchive(fn) {
    this._onAddToArchive = fn;
  }

  set onAddToFavorites(fn) {
    this._onAddToFavorites = fn;
  }


  update(data) {
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
  }


  blockCard() {
    this._editBtn.disabled = true;
    this._archiveBtn.disabled = true;
    this._favoritesBtn.disabled = true;
  }

  unblockCard() {
    this._editBtn.disabled = false;
    this._archiveBtn.disabled = false;
    this._favoritesBtn.disabled = false;
  }

  showError() {
    const ANIMATION_TIMEOUT = 600;

    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    this._cardInner.style.border = `1px solid red`;

    setTimeout(() => {
      this._element.style.animation = ``;
      this._cardInner.style.border = ``;

      this.unblockCard();
    }, ANIMATION_TIMEOUT);
  }


  _onEditBtnClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  _archiveBtnClick() {
    if (typeof this._onAddToArchive === `function`) {
      this._onAddToArchive(this._state.isDone);
    }
  }

  _favoritesBtnClick() {
    if (typeof this._onAddToFavorites === `function`) {
      this._onAddToFavorites(this._state.isFavorite);
    }
  }


  addElements() {
    this._cardInner = this._element.querySelector(`.card__inner`);
    this._editBtn = this._element.querySelector(`.card__btn--edit`);
    this._archiveBtn = this._element.querySelector(`.card__btn--archive`);
    this._favoritesBtn = this._element.querySelector(`.card__btn--favorites`);
  }

  addListeners() {
    this._editBtn.addEventListener(`click`, this._onEditBtnClick);
    this._archiveBtn.addEventListener(`click`, this._archiveBtnClick);
    this._favoritesBtn.addEventListener(`click`, this._favoritesBtnClick);
  }


  removeElements() {
    this._cardInner = null;
    this._editBtn = null;
    this._archiveBtn = null;
    this._favoritesBtn = null;
  }

  removeListeners() {
    this._editBtn.removeEventListener(`click`, this._onEditBtnClick);
    this._archiveBtn.removeEventListener(`click`, this._archiveBtnClick);
    this._favoritesBtn.removeEventListener(`click`, this._favoritesBtnClick);
  }
}
