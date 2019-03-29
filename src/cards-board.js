import * as moment from 'moment';

import Task from './task';
import TaskEdit from './task-edit';

import api from './backend';


const cardsContainer = document.querySelector(`.board`);
const boardMsg = cardsContainer.querySelector(`.board__no-tasks`);
const boardTasks = cardsContainer.querySelector(`.board__tasks`);


const showMsg = (text) => {
  boardMsg.textContent = text;
  boardMsg.classList.remove(`visually-hidden`);
  boardTasks.classList.add(`visually-hidden`);
};


const filterTasks = (tasks) => {
  const filters = document.querySelectorAll(`.filter__input`);
  const filtrationType = Array.from(filters).find((filter) => filter.checked === true).id;

  switch (filtrationType) {
    case `filter__overdue`:
      return tasks.filter((task) => !task.isDone && task.dueDate && task.dueDate < Date.now());

    case `filter__today`:
      return tasks.filter((task) => !task.isDone && task.dueDate && moment(task.dueDate).startOf(`day`).valueOf() === moment().startOf(`day`).valueOf());

    case `filter__repeating`:
      return tasks.filter((task) => !task.isDone && [...Object.entries(task.repeatingDays)]
          .some((day) => day[1]));

    case `filter__tags`:
      return tasks.filter((task) => !task.isDone && task.tags.size);

    case `filter__favorites`:
      return tasks.filter((task) => !task.isDone && task.isFavorite);

    case `filter__archive`:
      return tasks.filter((task) => task.isDone);

    default:
      return tasks.filter((task) => !task.isDone);
  }
};


const updateTaskData = (currentTask, newTask) => {
  Object.assign(currentTask, currentTask, newTask);
};

const updateBoardAfterChange = (component) => {
  api.getTasks()
  .then((tasks) => {
    component.unblockCard();
    showTasks(tasks);
  });
};


const renderCards = (data) => {
  const fragment = document.createDocumentFragment();

  boardTasks.innerHTML = ``;

  for (const taskData of data) {
    const taskComponent = new Task(taskData);
    const taskEditComponent = new TaskEdit(taskData);

    fragment.appendChild(taskComponent.render());


    taskComponent.onEdit = () => {
      taskEditComponent.render();
      boardTasks.replaceChild(taskEditComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    taskComponent.onAddToArchive = () => {
      taskData.isDone = !taskData.isDone;

      taskComponent.blockCard();

      api.updateTask(taskData.id, taskData.toRAW())
        .then(() => updateBoardAfterChange(taskComponent))
        .catch(() => {
          taskComponent.showError();
        });
    };

    taskComponent.onAddToFavorites = () => {
      taskData.isFavorite = !taskData.isFavorite;

      taskComponent.blockCard();

      api.updateTask(taskData.id, taskData.toRAW())
        .then(() => updateBoardAfterChange(taskComponent))
        .catch(() => {
          taskComponent.showError();
        });
    };

    taskEditComponent.onSave = (newData) => {
      updateTaskData(taskData, newData);

      taskEditComponent.blockCard();

      api.updateTask(taskData.id, taskData.toRAW())
        .then(() => updateBoardAfterChange(taskEditComponent))
        .catch(() => {
          taskEditComponent.showError();
        });
    };


    taskEditComponent.onDelete = (id) => {
      taskEditComponent.blockCard();

      api.deleteTask(id)
        .then(() => updateBoardAfterChange(taskEditComponent))
        .catch(() => {
          taskEditComponent.showError();
        });
    };
  }

  boardTasks.appendChild(fragment);
};


const showTasks = (data, filtrationType) => {
  const filteredTasks = filterTasks(data, filtrationType);

  if (filteredTasks.length) {
    const sortedTasks = filteredTasks.sort((left, right) => left.dueDate - right.dueDate);

    renderCards(sortedTasks);
    boardMsg.classList.add(`visually-hidden`);
    boardTasks.classList.remove(`visually-hidden`);
  } else {
    showMsg(`Congratulations, all tasks were completed! To create a new click on «add new task» button.`);
  }
};


export {showMsg, showTasks};
