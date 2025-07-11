// js/storage.js
const CLAVE_COLECCION = 'coleccion';

export function obtenerColeccion() {
  const data = localStorage.getItem('coleccion');
  return data ? JSON.parse(data) : {};
}

export function guardarColeccion(coleccionObj) {
  localStorage.setItem('coleccion', JSON.stringify(coleccionObj));
}

export function desbloquearPokemon(id) {
  const coleccion = obtenerColeccion();
  if (!coleccion.includes(id)) {
    coleccion.push(id);
    guardarColeccion(coleccion);
  }
}

export function estaDesbloqueado(id) {
  return obtenerColeccion().includes(id);
}

export function reiniciarColeccion() {
  localStorage.removeItem(CLAVE_COLECCION);
}
