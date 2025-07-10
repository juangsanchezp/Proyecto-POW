import { obtenerPokemonPorId } from './api.js';
import { obtenerColeccion, guardarColeccion } from './storage.js';

const btnAbrir = document.getElementById('btnAbrirSobre');
const sobreImg = document.getElementById('sobre-imagen');
const cartasAnimadas = document.getElementById('cartas-animadas');
const cartaIndividual = document.getElementById('carta-individual');
const imgCarta = document.getElementById('img-carta');
const destelloCSS = document.getElementById('destello-css'); // NUEVO

btnAbrir.addEventListener('click', async () => {
  // Bajada del sobre
  sobreImg.classList.add('bajando');

  // Activar destello visual
  destelloCSS.classList.remove('destello-css'); // reinicia animación
  void destelloCSS.offsetWidth; // fuerza reflujo
  destelloCSS.classList.add('destello-css'); // reaplica clase

  // Esperar antes de cambiar imagen
  await new Promise(resolve => setTimeout(resolve, 700));
  sobreImg.src = 'assets/img/SobreAbiertoPokemon (4).png';

  // Obtener colección actual
  let coleccion = obtenerColeccion();
  const nuevasCartas = [];
  while (nuevasCartas.length < 5) {
    const id = Math.floor(Math.random() * 150) + 1;
    if (!nuevasCartas.includes(id)) {
      nuevasCartas.push(id);
    }
  }

  guardarColeccion([...new Set([...coleccion, ...nuevasCartas])]);

  let indice = 0;

  const mostrarCarta = async () => {
    const id = nuevasCartas[indice];
    const pokemon = await obtenerPokemonPorId(id);

    imgCarta.src = pokemon.sprites.other['official-artwork'].front_default;
    imgCarta.alt = pokemon.name;

    cartaIndividual.className = 'carta-individual oculto';
    void cartaIndividual.offsetWidth;
    cartaIndividual.classList.remove('oculto');
    cartaIndividual.classList.add('tipo-' + pokemon.types[0].type.name);
    cartaIndividual.classList.add('mostrar');
  };

  const avanzar = async () => {
    indice++;
    if (indice < nuevasCartas.length) {
      await mostrarCarta();
    } else {
      cartaIndividual.classList.add('oculto');

      // Mostrar cartas en arco
      const angulos = [-25, -12, 0, 12, 25];
      const desplazamientosY = [30, 15, 0, 15, 30];

      cartasAnimadas.innerHTML = '';
      for (let i = 0; i < nuevasCartas.length; i++) {
        const id = nuevasCartas[i];
        const pokemon = await obtenerPokemonPorId(id);
        const carta = document.createElement('div');
        carta.classList.add('carta', `tipo-${pokemon.types[0].type.name}`);
        carta.style.setProperty('--rot', `${angulos[i]}deg`);
        carta.style.setProperty('--desplazamientoY', `${desplazamientosY[i]}px`);

        const img = document.createElement('img');
        img.src = pokemon.sprites.other['official-artwork'].front_default;
        img.alt = pokemon.name;
        carta.appendChild(img);
        cartasAnimadas.appendChild(carta);
      }

      setTimeout(() => {
        cartasAnimadas.classList.add('animate');
      }, 100);

      btnAbrir.disabled = true;
      btnAbrir.textContent = "¡Sobre abierto!";
    }
  };

  cartaIndividual.addEventListener('click', avanzar);
  cartaIndividual.addEventListener('touchstart', avanzar);

  await mostrarCarta();
});

// === Activar automáticamente el botón de navegación correspondiente ===
const currentPage = window.location.pathname.split('/').pop(); // abrir.html
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
  const href = item.getAttribute('href');
  if (href === currentPage) {
    item.classList.add('active');
  } else {
    item.classList.remove('active');
  }
});
