import Task from './task';
import TaskEdit from './task-edit';


const cardsContainer = document.querySelector(`.board__tasks`);


export default (data) => {
  const fragment = document.createDocumentFragment();

  cardsContainer.innerHTML = ``;

  for (const taskData of data) {
    const taskComponent = new Task(taskData);
    const editTaskComponent = new TaskEdit(taskData);

    fragment.appendChild(taskComponent.render());

    taskComponent.onEdit = () => {
      editTaskComponent.render();
      cardsContainer.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    editTaskComponent.onSubmit = () => {
      taskComponent.render();
      cardsContainer.replaceChild(taskComponent.element, editTaskComponent.element);
      editTaskComponent.unrender();
    };
  }

  cardsContainer.appendChild(fragment);
};
