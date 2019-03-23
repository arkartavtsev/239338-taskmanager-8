import Task from './task';
import TaskEdit from './task-edit';


const cardsContainer = document.querySelector(`.board__tasks`);


const updateTask = (tasks, currentTask, newTask) => {
  const index = tasks.findIndex((it) => it === currentTask);

  tasks[index] = Object.assign({}, currentTask, newTask);

  return tasks[index];
};

const deleteTask = (tasks, currentTask) => {
  const index = tasks.findIndex((it) => it === currentTask);

  tasks.splice(index, 1);

  return tasks;
};


export default (data) => {
  const fragment = document.createDocumentFragment();

  cardsContainer.innerHTML = ``;

  if (!data) {
    return;
  }

  for (const taskData of data) {
    const taskComponent = new Task(taskData);
    const taskEditComponent = new TaskEdit(taskData);

    fragment.appendChild(taskComponent.render());


    taskComponent.onEdit = () => {
      taskEditComponent.render();
      cardsContainer.replaceChild(taskEditComponent.element, taskComponent.element);
      taskComponent.unrender();
    };


    taskEditComponent.onSave = (newData) => {
      const updatedTask = updateTask(data, taskData, newData);

      taskComponent.update(updatedTask);

      taskComponent.render();
      cardsContainer.replaceChild(taskComponent.element, taskEditComponent.element);
      taskEditComponent.unrender();
    };


    taskEditComponent.onDelete = () => {
      taskEditComponent.unrender();
      deleteTask(data, taskData);
    };
  }

  cardsContainer.appendChild(fragment);
};
