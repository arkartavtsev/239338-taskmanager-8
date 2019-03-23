import Component from './component';


export default class Filter extends Component {
  constructor(name) {
    super();

    this._name = name;

    this._state = {
      isChecked: false,
      isDisabled: false
    };

    this._filterInput = null;

    this._onFilter = null;

    this._onFilterInputClick = this._onFilterInputClick.bind(this);
  }


  get template() {
    return `
      <div>
        <input
          type="radio"
          id="filter__${this._name}"
          class="filter__input visually-hidden"
          name="filter"
          ${this._state.isChecked ? `checked` : ``}
          ${this._state.isDisabled ? `disabled` : ``}
        />
        <label for="filter__${this._name}" class="filter__label">
          ${this._name.toUpperCase()}
          <span class="filter__${name}-count"></span>
        </label>
      </div>
    `.trim();
  }


  set isChecked(state) {
    this._state.isChecked = state;
  }


  set onFilter(fn) {
    this._onFilter = fn;
  }


  _onFilterInputClick() {
    if (typeof this._onFilter === `function`) {
      this._onFilter(this._name);
    }
  }


  addElements() {
    this._filterInput = this._element.querySelector(`.filter__input`);
  }

  addListeners() {
    this._filterInput.addEventListener(`click`, this._onFilterInputClick);
  }


  removeElements() {
    this._filterInput = null;
  }

  removeListeners() {
    this._filterInput.removeEventListener(`click`, this._onFilterInputClick);
  }
}
