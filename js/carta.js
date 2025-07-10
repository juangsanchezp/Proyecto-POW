// js/card.js

export function crearVistaCarta(pokemon) {
  const overlay = document.createElement('div');
  overlay.classList.add('carta-overlay');

  const contenedor = document.createElement('div');
  contenedor.classList.add('card-container', `tipo-${pokemon.types[0].type.name}`);

  const header = document.createElement('div');
  header.classList.add('card-header');

  const nombre = document.createElement('h2');
  nombre.textContent = capitalizar(pokemon.name);

  const hp = document.createElement('div');
  hp.classList.add('hp-indicator');
  hp.textContent = `HP: ${pokemon.stats.find(s => s.stat.name === 'hp').base_stat}`;

  header.appendChild(nombre);
  header.appendChild(hp);

  // Contenedor de imagen con número Pokédex
  const contenedorImg = document.createElement('div');
  contenedorImg.classList.add('imagen-con-numero');

  const numero = document.createElement('div');
  numero.classList.add('numero-pokedex', 'detallado');
  numero.textContent = `#${pokemon.id}`;

  const imagen = document.createElement('img');
  imagen.src = pokemon.sprites.other['official-artwork'].front_default;
  imagen.alt = pokemon.name;
  imagen.classList.add('pokemon-img');

  contenedorImg.appendChild(numero);
  contenedorImg.appendChild(imagen);

  const statsContainer = document.createElement('div');
  statsContainer.classList.add('stats');

  pokemon.stats.forEach(stat => {
    if (stat.stat.name === 'hp') return;

    const statDiv = document.createElement('div');
    statDiv.classList.add('stat');

    const label = document.createElement('div');
    label.classList.add('stat-label');
    label.textContent = `${traducirStat(stat.stat.name)}: ${stat.base_stat}`;

    const bar = document.createElement('div');
    bar.classList.add('stat-bar');

    const barInner = document.createElement('div');
    barInner.classList.add('stat-bar-inner');
    barInner.style.width = `${Math.min(stat.base_stat, 100)}%`;

    bar.appendChild(barInner);
    statDiv.appendChild(label);
    statDiv.appendChild(bar);
    statsContainer.appendChild(statDiv);
  });

  contenedor.appendChild(header);
  contenedor.appendChild(contenedorImg); // imagen con número
  contenedor.appendChild(statsContainer);
  overlay.appendChild(contenedor);

  // Solo ejecutar esta parte si estamos en index.html (colección)
  if (window.location.pathname.includes('index.html')) {
    overlay.addEventListener('click', (e) => {
      if (e.target === contenedor || overlay) {
        document.body.innerHTML = '';
        window.location.reload();
      }
    });
  }


  return overlay;
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

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
