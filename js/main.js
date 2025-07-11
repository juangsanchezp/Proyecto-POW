// js/main.js
import { obtenerPokemonPorId } from './api.js';
import { mostrarModalPokemon } from './modal.js';
import {
  obtenerColeccion,
  guardarColeccion
} from './storage.js';

const grid = document.querySelector('.grid-cartas');
const inputBusqueda = document.getElementById("search-input");
const botonesTipo = document.querySelectorAll(".tipo-btn");

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
        carta.setAttribute("data-nombre", pokemon.name);
        carta.setAttribute("data-tipo", pokemon.types.map(t => t.type.name).join(" "));
        const tipoPrincipal = pokemon.types[0].type.name;
        carta.classList.add(`tipo-${tipoPrincipal}`);

        carta.appendChild(img);
        carta.addEventListener('click', () => mostrarModalPokemon(pokemon));
      });
    } else {
      carta.classList.add('bloqueada');

      obtenerPokemonPorId(id).then(pokemon => {
        if (!pokemon) return;

        img.src = pokemon.sprites.other['official-artwork'].front_default;
        img.alt = pokemon.name;
        img.classList.add('silueta');

        carta.appendChild(img);
      });
    }

    grid.appendChild(carta);
  }
}

// Botones inferiores
window.navegar = function (seccion) {
  if (seccion === 'abrir') {
    window.location.href = 'abrir.html';
  } else {
    mostrarToast(`Navegar a: ${seccion}`);
  }
};

function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2500);
}

// Filtro por nombre
if (inputBusqueda) {
  inputBusqueda.addEventListener("input", () => {
    const termino = inputBusqueda.value.toLowerCase();
    const cartas = document.querySelectorAll(".carta");

    cartas.forEach(carta => {
      const nombre = carta.getAttribute("data-nombre");
      if (nombre && nombre.toLowerCase().includes(termino)) {
        carta.style.display = "flex";
      } else if (!nombre && termino === "") {
        carta.style.display = "flex";
      } else {
        carta.style.display = "none";
      }
    });
  });
}

// Filtro por tipo
botonesTipo.forEach(btn => {
  btn.addEventListener("click", () => {
    const tipoSeleccionado = btn.dataset.tipo;

    botonesTipo.forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");

    document.querySelectorAll(".carta").forEach(carta => {
      const tipoCarta = carta.getAttribute("data-tipo");
      if (!tipoCarta) return;

      if (tipoSeleccionado === "all" || tipoCarta.includes(tipoSeleccionado)) {
        carta.style.display = "flex";
      } else {
        carta.style.display = "none";
      }
    });
  });
});
