import {getRandomNum, addContentToContainer} from './util.js';


const Filters = {
  NAMES: [
    `overdue`,
    `today`,
    `favorites`,
    `repeating`,
    `tags`,
    `archive`
  ],
  MAX_COUNT: 5
};


const createFilterInput = (name, count, isChecked, isDisabled) => `
  <input
    type="radio"
    id="filter__${name}"
    class="filter__input visually-hidden"
    name="filter"
    value="${count}"
    ${isChecked ? `checked` : ``}
    ${isDisabled ? `disabled` : ``}
  />
`;

const createFilterCounter = (name, count) => `
  <span class="filter__${name}-count">${count}</span>
`;

const createFilterLabel = (name, count) => `
  <label for="filter__${name}" class="filter__label">
    ${name.toUpperCase()} ${createFilterCounter(name, count)}
  </label>
`;

const createFilter = (name, count, isChecked = false) => `
  ${createFilterInput(name, count, isChecked, count === 0)}
  ${createFilterLabel(name, count)}
`;


export default (container) => {
  let allFiltersCounterValue = 0;
  let allFiltersMarkup = ``;

  for (const filterName of Filters.NAMES) {
    const filterCount = getRandomNum(0, Filters.MAX_COUNT);

    allFiltersCounterValue += filterCount;
    allFiltersMarkup += createFilter(filterName, filterCount);
  }

  const mainFilterMarkup = createFilter(`all`, allFiltersCounterValue, true);

  addContentToContainer(mainFilterMarkup + allFiltersMarkup, container);
};
