import {FILTERS} from './const';

import Filter from './filter';

import api from './backend';
import {showMsg, showTasks} from './cards-board';
import {renderStatistic, destroyStatisticComponents} from './statistic';


const filtersContainer = document.querySelector(`.main__filter`);
const statisticContainer = document.querySelector(`.statistic`);

const cardsContainer = document.querySelector(`.board`);
const boardMsg = cardsContainer.querySelector(`.board__no-tasks`);
const boardTasks = document.querySelector(`.board__tasks`);

const showStatisticBtn = document.querySelector(`#control__statistic`);
const showTasksBtn = document.querySelector(`#control__task`);


const createFilters = (container) => {
  const fragment = document.createDocumentFragment();

  container.innerHTML = ``;

  for (const filter of FILTERS) {
    const filterComponent = new Filter(filter);

    filterComponent.isChecked = filter === `all`;

    filterComponent.onFilter = () => {
      loadTasks()
        .then((tasks) => {
          showTasks(tasks);
        });
    };

    fragment.appendChild(filterComponent.render());
  }

  container.appendChild(fragment);
};


const loadTasks = () => {
  showMsg(`Loading tasks...`);

  return api.getTasks()
    .catch(() => {
      showMsg(`Something went wrong while loading your tasks. Check your connection or try again later`);
    });
};


createFilters(filtersContainer);

loadTasks()
  .then((tasks) => {
    showTasks(tasks);
  });


const onShowStatisticBtnClick = () => {
  filtersContainer.classList.add(`visually-hidden`);
  boardTasks.classList.add(`visually-hidden`);

  loadTasks()
    .then((tasks) => {
      destroyStatisticComponents();
      renderStatistic(tasks);
      boardMsg.classList.add(`visually-hidden`);
    });

  statisticContainer.classList.remove(`visually-hidden`);
};

const onShowTasksBtnClick = () => {
  filtersContainer.classList.remove(`visually-hidden`);
  boardTasks.classList.remove(`visually-hidden`);

  destroyStatisticComponents();

  statisticContainer.classList.add(`visually-hidden`);
};


showStatisticBtn.addEventListener(`click`, onShowStatisticBtnClick);
showTasksBtn.addEventListener(`click`, onShowTasksBtnClick);
