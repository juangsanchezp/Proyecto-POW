// js/main.js
import { obtenerPokemonPorId } from './api.js';
import { mostrarModalPokemon } from './modal.js';
import {
  obtenerColeccion,
  guardarColeccion
} from './storage.js';

const grid = document.querySelector('.grid-cartas'); // Asegúrate que coincide con tu CSS

document.addEventListener('DOMContentLoaded', () => {
  let coleccion = obtenerColeccion();

  // Si está vacío, agregar 3 iniciales
  if (coleccion.length === 0) {
    const iniciales = [6, 3, 9]; // Charizard, Venusaur, Blastoise
    guardarColeccion(iniciales);
    coleccion = iniciales;
  }

  cargarCartas(coleccion);
});

function cargarCartas(coleccion) {
  for (let id = 1; id <= 150; id++) {
    const carta = document.createElement('div');
    carta.classList.add('carta');

    const img = document.createElement('img');

    if (coleccion.includes(id)) {
      obtenerPokemonPorId(id).then(pokemon => {
        if (!pokemon) return;

        img.src = pokemon.sprites.other['official-artwork'].front_default;
        img.alt = pokemon.name;
        carta.appendChild(img);

        carta.addEventListener('click', () => mostrarModalPokemon(pokemon));
      });
    } else {
      carta.classList.add('bloqueada');
      img.src = './assets/oculto.png';
      img.alt = 'Bloqueado';
      carta.appendChild(img);
    }

    grid.appendChild(carta);
  }
}

// Botones inferiores
window.navegar = function (seccion) {
  mostrarToast(`Navegar a: ${seccion}`);
};

function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2500);
}


