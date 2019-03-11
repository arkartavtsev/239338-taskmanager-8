export const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomBoolean = () => Boolean(getRandomNum(0, 1));

export const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];


export const createElement = (template) => {
  const newElement = document.createElement(`div`);

  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const addContentToContainer = (content, container) => {
  container.innerHTML = content;
};
