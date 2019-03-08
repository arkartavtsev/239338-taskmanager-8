import data from './data';
import renderCards from './render-cards';
import renderFilters from './render-filters';


const filtersContainer = document.querySelector(`.main__filter`);
const cardsContainer = document.querySelector(`.board__tasks`);


// отрисовка фильтров на странице и добавление обработчиков


renderFilters(filtersContainer);


const filters = filtersContainer.querySelectorAll(`.filter__input`);


const onFilterClick = (evt) => {
  renderCards(evt.target.value, data, cardsContainer);
};


for (const filter of filters) {
  filter.addEventListener(`click`, onFilterClick);
}


// первоначальная отрисовка карточек на странице


const currentFilter = filtersContainer.querySelector(`.filter__input[checked]`);


renderCards(currentFilter.value, data, cardsContainer);
