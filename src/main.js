import renderCards from './render-cards.js';
import renderFilters from './render-filters.js';


const filtersContainer = document.querySelector(`.main__filter`);
const cardsContainer = document.querySelector(`.board__tasks`);


// отрисовка фильтров на странице и добавление обработчиков


renderFilters(filtersContainer);


const filtersLabels = filtersContainer.querySelectorAll(`.filter__label`);


const onFilterLabelClick = (evt) => {
  let target = evt.target;

  while (target.parentElement !== filtersContainer) {
    target = target.parentElement;
  }

  const filter = filtersContainer.querySelector(`#${target.getAttribute(`for`)}`);

  if (!filter.disabled) {
    renderCards(filter.value, cardsContainer);
  }
};


for (const label of filtersLabels) {
  label.addEventListener(`click`, onFilterLabelClick);
}


// первоначальная отрисовка карточек на странице


const currentFilter = filtersContainer.querySelector(`.filter__input[checked]`);


renderCards(currentFilter.value, cardsContainer);
