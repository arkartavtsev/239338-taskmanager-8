import getData from './data';

import renderCards from './render-cards';
import renderFilters from './render-filters';


// отрисовка фильтров на странице и добавление обработчиков


const filtersContainer = document.querySelector(`.main__filter`);


renderFilters(filtersContainer);

const filters = filtersContainer.querySelectorAll(`.filter__input`);


const onFilterClick = (evt) => {
  renderCards(getData(evt.target.value));
};

for (const filter of filters) {
  filter.addEventListener(`click`, onFilterClick);
}


// первоначальная отрисовка карточек на странице


const currentFilter = filtersContainer.querySelector(`.filter__input[checked]`);

renderCards(getData(currentFilter.value));
