import flatpickr from 'flatpickr';
import * as moment from 'moment';

import {Color} from './const';

import getChart from './get-chart';


const CurrentWeek = {
  FIRST_DAY: moment().startOf(`isoWeek`).valueOf(),
  LAST_DAY: moment().endOf(`isoWeek`).valueOf()
};

const MAX_DATA_IN_STAT = Object.keys(Color).length;


const statistic = document.querySelector(`.statistic`);

const periodInput = statistic.querySelector(`.statistic__period-input`);
const results = statistic.querySelector(`.statistic__task-found`);

const tagsCtxWrapper = statistic.querySelector(`.statistic__tags-wrap`);
const tagsCtx = statistic.querySelector(`.statistic__tags`);

const colorsCtxWrapper = statistic.querySelector(`.statistic__colors-wrap`);
const colorsCtx = statistic.querySelector(`.statistic__colors`);


tagsCtxWrapper.classList.remove(`visually-hidden`);
colorsCtxWrapper.classList.remove(`visually-hidden`);


let rangePicker;
let tagsChart;
let colorsChart;


const countItemsEntry = (items) => items.reduce((acc, item) => {
  acc[item] = acc[item] + 1 || 1;
  return acc;
}, {});

const arrangeItems = (items) => Object.entries(items).sort((left, right) => right[1] - left[1]);

const getMostFrequentItems = (items, count) => {
  const countedItems = countItemsEntry(items);
  const arrangedItems = arrangeItems(countedItems);

  return arrangedItems.splice(0, count);
};


const getTasksFromPeriod = (tasks, start, end) => tasks.filter((task) => {
  const taskDuedate = moment(task.dueDate).startOf(`day`).valueOf();

  return taskDuedate >= start && taskDuedate <= end;
});


const getStatFromPeriod = (tasks, start, end) => {
  const rangedTasks = getTasksFromPeriod(tasks, start, end);

  const tags = [];
  const colors = [];

  for (const taskData of rangedTasks) {
    tags.push(...taskData.tags);
    colors.push(taskData.color);
  }

  results.textContent = rangedTasks.length;

  return {
    tags: getMostFrequentItems(tags, MAX_DATA_IN_STAT),
    colors: getMostFrequentItems(colors, MAX_DATA_IN_STAT)
  };
};


const setChartData = (newData) => ({
  labels: newData.map((it) => `#${it[0]}`),
  datasets: [{
    data: newData.map((it) => it[1]),
    backgroundColor: newData.map((it, i) => Color[it[0]] || Object.values(Color)[i])
  }]
});

const updateChart = (chart, newData) => {
  chart.data = setChartData(newData);
  chart.update();
};


const renderStatistic = (data) => {
  let stat = getStatFromPeriod(data, CurrentWeek.FIRST_DAY, CurrentWeek.LAST_DAY);


  rangePicker = flatpickr(periodInput, {
    mode: `range`,
    dateFormat: `j F`,
    defaultDate: [CurrentWeek.FIRST_DAY, CurrentWeek.LAST_DAY],
    onClose(selectedDates) {
      stat = getStatFromPeriod(data, moment(selectedDates[0]).valueOf(), moment(selectedDates[1]).valueOf());

      updateChart(tagsChart, stat.tags);
      updateChart(colorsChart, stat.colors);
    }
  });


  const tagsChartOptions = {
    canvas: tagsCtx,
    data: setChartData(stat.tags),
    name: `tags`
  };

  const colorsChartOptions = {
    canvas: colorsCtx,
    data: setChartData(stat.colors),
    name: `color`
  };


  tagsChart = getChart(tagsChartOptions);
  colorsChart = getChart(colorsChartOptions);
};

const destroyStatisticComponents = () => {
  if (rangePicker) {
    rangePicker.destroy();
  }

  if (tagsChart) {
    tagsChart.destroy();
  }

  if (colorsChart) {
    colorsChart.destroy();
  }
};


export {renderStatistic, destroyStatisticComponents};
