import {CARD_COLORS} from './const';
import {getRandomNum, getRandomItem} from './util';


const TasksProperties = {
  TITLES: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ],
  TAGS: [
    `homework`,
    `theory`,
    `practice`,
    `intensive`,
    `keks`,
    `html academy`,
    `javascript`,
    `es6`
  ],
  COLORS: CARD_COLORS,

  DateTimeSpread: {
    DAYS: 7,
    HOURS: 6,
    MINUTES: 30
  }
};


const generateDate = (spread) => Date.now() + (getRandomNum(-spread.DAYS, spread.DAYS) * 24 * 60 + getRandomNum(-spread.HOURS, spread.HOURS) * 60 + getRandomNum(-spread.MINUTES, spread.MINUTES)) * 60 * 1000;

const generateTags = (possibleTags) => {
  const tags = new Set();

  for (let i = 0; i < getRandomNum(0, 3); i++) {
    tags.add(getRandomItem(possibleTags));
  }

  return tags;
};


const generateTask = (properties) => ({
  title: getRandomItem(properties.TITLES),
  dueDate: generateDate(properties.DateTimeSpread),
  tags: generateTags(properties.TAGS),
  picture: `http://picsum.photos/100/100?r=${Math.random()}`,
  color: getRandomItem(properties.COLORS),
  repeatingDays: {
    'mo': Boolean(getRandomNum(0, 1)),
    'tu': Boolean(getRandomNum(0, 1)),
    'we': Boolean(getRandomNum(0, 1)),
    'th': Boolean(getRandomNum(0, 1)),
    'fr': Boolean(getRandomNum(0, 1)),
    'sa': Boolean(getRandomNum(0, 1)),
    'su': Boolean(getRandomNum(0, 1))
  },
  isFavorite: Boolean(getRandomNum(0, 1)),
  isDone: Boolean(getRandomNum(0, 1))
});


export default (count) => {
  let tasks = [];

  for (let i = 0; i < count; i++) {
    tasks.push(generateTask(TasksProperties));
  }

  return tasks;
};
