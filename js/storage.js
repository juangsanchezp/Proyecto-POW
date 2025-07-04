// js/storage.js
const CLAVE_COLECCION = 'coleccion';

export function obtenerColeccion() {
  const datos = localStorage.getItem(CLAVE_COLECCION);
  return datos ? JSON.parse(datos) : [];
}

export function guardarColeccion(nuevaColeccion) {
  localStorage.setItem(CLAVE_COLECCION, JSON.stringify(nuevaColeccion));
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
