export const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const addContentToContainer = (content, container) => {
  container.innerHTML = content;
};
