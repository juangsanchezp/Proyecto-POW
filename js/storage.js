const STORAGE_KEY = 'cartasDesbloqueadas';

/**
 * Devuelve un array con los IDs de cartas desbloqueadas.
 * @returns {number[]}
 */
export function obtenerCartasDesbloqueadas() {
  const datos = localStorage.getItem(STORAGE_KEY);
  return datos ? JSON.parse(datos) : [];
}

/**
 * Verifica si un Pokémon está desbloqueado.
 * @param {number} id - El ID del Pokémon.
 * @returns {boolean}
 */
export function estaDesbloqueado(id) {
  const cartas = obtenerCartasDesbloqueadas();
  return cartas.includes(id);
}

/**
 * Agrega un nuevo ID a las cartas desbloqueadas y guarda en localStorage.
 * @param {number} id - ID del Pokémon a guardar.
 */
export function guardarPokemon(id) {
  const cartas = obtenerCartasDesbloqueadas();
  if (!cartas.includes(id)) {
    cartas.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartas));
  }
}

/**
 * Borra todas las cartas desbloqueadas (solo para pruebas o reinicio).
 */
export function reiniciarColeccion() {
  localStorage.removeItem(STORAGE_KEY);
}
