export const getRandomItemsFromArray = (array: any, count: any) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
