import { obtenerPokemonPorId } from './api.js';
import { estaDesbloqueado, guardarPokemon } from './storage.js';
import { mostrarModalPokemon } from './modal.js';

// Selección de botones
const btnIndice = document.getElementById('btn-indice');
const btnSobre = document.getElementById('btn-sobre');
const btnIntercambio = document.getElementById('btn-intercambio');
const mainView = document.getElementById('main-view');

// Listeners para la navegación
btnIndice.addEventListener('click', mostrarIndice);
btnSobre.addEventListener('click', mostrarSobre);
btnIntercambio.addEventListener('click', mostrarIntercambio);

// Mostrar índice al cargar por defecto
document.addEventListener('DOMContentLoaded', mostrarIndice);

// ------------------------------
// Función para mostrar el índice
// ------------------------------
async function mostrarIndice() {
  mainView.innerHTML = '<h2>Índice de Cartas</h2><div class="grid-cartas" id="grid-cartas"></div>';
  const grid = document.getElementById('grid-cartas');

  for (let id = 1; id <= 150; id++) {
    const img = document.createElement('img');
    img.classList.add('carta');

    if (estaDesbloqueado(id)) {
      img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    } else {
      img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
      img.classList.add('bloqueada');
    }

    img.addEventListener('click', async () => {
      if (estaDesbloqueado(id)) {
        const pokemon = await obtenerPokemonPorId(id);
        mostrarModalPokemon(pokemon);
      }
    });

    grid.appendChild(img);
  }
}

// ------------------------------
// Abrir sobre (por implementar)
// ------------------------------
function mostrarSobre() {
  mainView.innerHTML = '<h2>Abrir un Sobre</h2><p>Función en desarrollo...</p>';
}

// ------------------------------
// Intercambiar cartas (por implementar)
// ------------------------------
function mostrarIntercambio() {
  mainView.innerHTML = '<h2>Intercambiar Cartas</h2><p>Función en desarrollo...</p>';
}
