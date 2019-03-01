export const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const addContentToContainer = (content, container) => {
  container.innerHTML = content;
};
