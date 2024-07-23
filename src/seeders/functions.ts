export function getRandomDateInLastWeek() {
  const today = new Date();

  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  const randomTime =
    lastWeek.getTime() + Math.random() * (today.getTime() - lastWeek.getTime());

  return new Date(randomTime);
}
