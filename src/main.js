import createTasks from './data';
import renderCards from './render-cards';
import renderFilters from './render-filters';


const filtersContainer = document.querySelector(`.main__filter`);
const cardsContainer = document.querySelector(`.board__tasks`);


// отрисовка фильтров на странице и добавление обработчиков


renderFilters(filtersContainer);


const filters = filtersContainer.querySelectorAll(`.filter__input`);


const onFilterClick = (evt) => {
  renderCards(createTasks(evt.target.value), cardsContainer);
};


for (const filter of filters) {
  filter.addEventListener(`click`, onFilterClick);
}


// первоначальная отрисовка карточек на странице


const currentFilter = filtersContainer.querySelector(`.filter__input[checked]`);


renderCards(createTasks(currentFilter.value), cardsContainer);
