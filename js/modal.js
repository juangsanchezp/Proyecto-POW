// js/modal.js
const modal = document.getElementById('modal-carta');
const modalContent = document.querySelector('.modal-content');
const detalleCarta = document.getElementById('detalle-carta');
const cerrarBtn = document.querySelector('.close-modal');

cerrarBtn.addEventListener('click', cerrarModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) cerrarModal();
});

export function mostrarModalPokemon(pokemon) {
  if (!pokemon) return;

  const nombre = capitalizar(pokemon.name);
  const tipos = pokemon.types.map(t => capitalizar(t.type.name)).join(', ');
  const imagen = pokemon.sprites.other['official-artwork'].front_default;
  const stats = pokemon.stats.map(stat => `
    <li><strong>${traducirStat(stat.stat.name)}:</strong> ${stat.base_stat}</li>
  `).join('');

  detalleCarta.innerHTML = `
    <h2>${nombre}</h2>
    <img src="${imagen}" alt="${nombre}" class="carta" style="width: 120px; margin: 0 auto;">
    <p><strong>Tipo:</strong> ${tipos}</p>
    <ul>${stats}</ul>
  `;

  modal.classList.remove('hidden');
}

function cerrarModal() {
  modal.classList.add('hidden');
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function traducirStat(nombre) {
  const mapa = {
    'hp': 'Salud',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'Ataque Esp.',
    'special-defense': 'Defensa Esp.',
    'speed': 'Velocidad'
  };
  return mapa[nombre] || nombre;
}
