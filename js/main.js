import { obtenerPokemonPorId } from './api.js';
// import { mostrarModalPokemon } from './modal.js';
import {
  obtenerColeccion,
  guardarColeccion
} from './storage.js';
import { crearVistaCarta } from './carta.js';

const grid = document.querySelector('.grid-cartas');
const inputBusqueda = document.getElementById("search-input");
const botonesTipo = document.querySelectorAll(".tipo-btn");
let filtroActivo = "all";

document.addEventListener('DOMContentLoaded', () => {
  let coleccion = obtenerColeccion();

  // Si está vacía, iniciar con 3 Pokémon iniciales
  if (coleccion.length === 0) {
    const iniciales = [6, 3, 9]; // Charizard, Venusaur, Blastoise
    guardarColeccion(iniciales);
    coleccion = iniciales;
  }

  cargarCartas(coleccion);
  actualizarProgreso(coleccion);
  marcarNavActiva(); // ⬅️ Aplica el estilo "active" al botón correspondiente
});

/**
 * Cargar cartas al grid
 */
function cargarCartas(coleccion) {
  for (let id = 1; id <= 150; id++) {
    const carta = document.createElement('div');
    carta.classList.add('carta');
    carta.style.position = 'relative'; // Para posicionar el número encima

    const img = document.createElement('img');

    if (coleccion.includes(id)) {
      obtenerPokemonPorId(id).then(pokemon => {
        if (!pokemon) return;

        // Número Pokédex
        const numero = document.createElement('div');
        numero.classList.add('numero-pokedex');
        numero.textContent = `#${pokemon.id}`;
        carta.appendChild(numero);

        img.src = pokemon.sprites.other['official-artwork'].front_default;
        img.alt = pokemon.name;

        carta.setAttribute("data-nombre", pokemon.name);
        carta.setAttribute("data-tipo", pokemon.types.map(t => t.type.name).join(" "));
        const tipoPrincipal = pokemon.types[0].type.name;
        carta.classList.add(`tipo-${tipoPrincipal}`);
        carta.appendChild(img);

        carta.addEventListener('click', () => {
          const overlay = document.getElementById('detalle-carta-personalizada');

          if (!overlay.classList.contains('hidden')) {
            overlay.classList.add('hidden');
            overlay.innerHTML = '';
            volverAplicarFiltro();
            return;
          }

          const nuevaCarta = crearVistaCarta(pokemon);
          overlay.innerHTML = '';
          overlay.appendChild(nuevaCarta);
          overlay.classList.remove('hidden');
        });
      });
    } else {
      carta.classList.add('bloqueada');

      obtenerPokemonPorId(id).then(pokemon => {
        if (!pokemon) return;

        // Número Pokédex con estilo especial para bloqueados
        const numero = document.createElement('div');
        numero.classList.add('numero-pokedex', 'bloqueado');
        numero.textContent = `#${pokemon.id}`;
        carta.appendChild(numero);

        img.src = pokemon.sprites.other['official-artwork'].front_default;
        img.alt = pokemon.name;
        img.classList.add('silueta');

        carta.setAttribute("data-tipo", pokemon.types.map(t => t.type.name).join(" "));
        carta.appendChild(img);
      });
    }

    grid.appendChild(carta);
  }
}


/**
 * Mostrar mensaje temporal
 */
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2500);
}

/**
 * Navegación inferior (botón "abrir")
 */
window.navegar = function (seccion) {
  if (seccion === 'abrir') {
    window.location.href = 'abrir.html';
  } else {
    mostrarToast(`Navegar a: ${seccion}`);
  }
};

/**
 * Filtro por nombre desde input
 */
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

/**
 * Filtro por tipo desde botones
 */
botonesTipo.forEach(btn => {
  btn.addEventListener("click", () => {
    filtroActivo = btn.dataset.tipo;

    botonesTipo.forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");

    document.querySelectorAll(".carta").forEach(carta => {
      const tipoCarta = carta.getAttribute("data-tipo");
      const estaBloqueada = carta.classList.contains("bloqueada");

      if (!tipoCarta) {
        carta.style.display = "none";
        return;
      }

      // 👉 Caso "Todos": mostrar todo
      if (filtroActivo === "all") {
        carta.style.display = "flex";
        return;
      }

      // 👉 Otros tipos: solo desbloqueados que coincidan con el tipo
      if (!estaBloqueada && tipoCarta.includes(filtroActivo)) {
        carta.style.display = "flex";
      } else {
        carta.style.display = "none";
      }
    });
  });
});

/**
 * Actualiza la barra de progreso y el texto
 */
function actualizarProgreso(coleccion) {
  const total = 150;
  const cantidad = coleccion.length;
  const porcentaje = Math.floor((cantidad / total) * 100);

  const progresoTexto = document.getElementById('progreso-texto');
  const barra = document.getElementById('barra-progreso-interna');

  if (progresoTexto && barra) {
    progresoTexto.textContent = `${cantidad}/150 Pokémon`;
    barra.style.width = `${porcentaje}%`;
  }
}

/**
 * Detecta la sección actual y marca el botón como activo
 */
function marcarNavActiva() {
  const ruta = window.location.pathname;
  const archivo = ruta.substring(ruta.lastIndexOf('/') + 1);
  const items = document.querySelectorAll(".nav-item");

  items.forEach(item => {
    const href = item.getAttribute("href");
    if (href && archivo === href) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}


