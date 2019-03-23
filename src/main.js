import * as moment from 'moment';

import {FILTERS, CardsCount} from './const';
import {getRandomNum} from './util';

import Filter from './filter';

import getData from './data';
import renderCards from './render-cards';


const filtersContainer = document.querySelector(`.main__filter`);


const data = getData(getRandomNum(CardsCount.MIN, CardsCount.MAX));


const filterTasks = (tasks, filtrationType) => {
  switch (filtrationType) {
    case `overdue`:
      return tasks.filter((task) => task.dueDate && task.dueDate < Date.now());

    case `today`:
      return tasks.filter((task) => task.dueDate && moment(task.dueDate).startOf(`day`).valueOf() === moment().startOf(`day`).valueOf());

    case `repeating`:
      return tasks.filter((task) => [...Object.entries(task.repeatingDays)]
          .some((day) => day[1]));

    case `tags`:
      return tasks.filter((task) => task.tags.size);

    case `favorites`:
      return tasks.filter((task) => task.isFavorite);

    case `archive`:
      return tasks.filter((task) => task.isDone);

    default:
      return tasks;
  }
};


const renderFilters = (container) => {
  const fragment = document.createDocumentFragment();

  container.innerHTML = ``;

  for (const filter of FILTERS) {
    const filterComponent = new Filter(filter);

    filterComponent.isChecked = filter === `all`;

    filterComponent.onFilter = (filterName) => {
      const filteredTasks = filterTasks(data, filterName);

      renderCards(filteredTasks);
    };

    fragment.appendChild(filterComponent.render());
  }

  container.appendChild(fragment);
};


renderFilters(filtersContainer);
renderCards(data);
