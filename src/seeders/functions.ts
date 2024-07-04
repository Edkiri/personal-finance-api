export function getRandomDateInLastWeek() {
  // Fecha actual
  const today = new Date();

  // Fecha de una semana atrás
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  // Generar un número aleatorio de milisegundos entre hoy y hace una semana
  const randomTime =
    lastWeek.getTime() + Math.random() * (today.getTime() - lastWeek.getTime());

  // Crear una nueva fecha usando el tiempo aleatorio generado
  return new Date(randomTime);
}
