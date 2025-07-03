// Elementos del DOM necesarios
const modal = document.getElementById('modal-carta');
const modalContent = document.querySelector('.modal-content');
const detalleCarta = document.getElementById('detalle-carta');
const cerrarBtn = document.querySelector('.close-modal');

// Evento para cerrar al hacer clic en el botón
cerrarBtn.addEventListener('click', cerrarModal);

// Evento para cerrar al hacer clic fuera del contenido
modal.addEventListener('click', (e) => {
  if (e.target === modal) cerrarModal();
});

/**
 * Muestra el modal con la información del Pokémon.
 * @param {Object} pokemon - Objeto del Pokémon desde la API.
 */
export function mostrarModalPokemon(pokemon) {
  if (!pokemon) return;

  const nombre = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const tipos = pokemon.types.map(t => t.type.name).join(', ');
  const imagen = pokemon.sprites.front_default;
  const stats = pokemon.stats.map(stat => `
    <li>${stat.stat.name}: ${stat.base_stat}</li>
  `).join('');

  detalleCarta.innerHTML = `
    <h2>${nombre}</h2>
    <img src="${imagen}" alt="${nombre}" class="carta" style="width: 120px">
    <p><strong>Tipo:</strong> ${tipos}</p>
    <ul>${stats}</ul>
  `;

  modal.classList.remove('hidden');
}

/**
 * Cierra el modal.
 */
function cerrarModal() {
  modal.classList.add('hidden');
}
