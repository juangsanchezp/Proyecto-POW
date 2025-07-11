import { obtenerPokemonPorId } from './api.js';
import { obtenerColeccion, guardarColeccion } from './storage.js';
import { crearVistaCarta } from './carta.js';

const btnAbrir = document.getElementById('btnAbrirSobre');
const sobreImg = document.getElementById('sobre-imagen');
const cartasAnimadas = document.getElementById('cartas-animadas');
const cartaEmergente = document.getElementById('carta-emergente');
const destelloCSS = document.getElementById('destello-css');

let nuevasCartas = [];
let btnOtro = null;

async function abrirSobre() {
  // RESET visual
  cartasAnimadas.classList.remove('animate');
  cartasAnimadas.innerHTML = '';
  cartaEmergente.innerHTML = '';
  cartaEmergente.classList.add('hidden');
  if (btnOtro) {
    btnOtro.remove();
    btnOtro = null;
  }

  // Animación inicial
  sobreImg.classList.add('bajando');
  destelloCSS.classList.remove('destello-css');
  void destelloCSS.offsetWidth;
  destelloCSS.classList.add('destello-css');

  await new Promise(resolve => setTimeout(resolve, 700));
  sobreImg.src = 'assets/img/SobreAbiertoPokemon (4).png';

  // Selección aleatoria
  let coleccion = obtenerColeccion();
  nuevasCartas = [];
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
    const carta = crearVistaCarta(pokemon);
    cartaEmergente.innerHTML = '';
    cartaEmergente.appendChild(carta);
    cartaEmergente.classList.remove('hidden');
  };

  const avanzar = async () => {
    indice++;
    if (indice < nuevasCartas.length) {
      await mostrarCarta();
    } else {
      cartaEmergente.classList.add('hidden');

            // Mostrar todas en arco con diseño de colección
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

        // Número de la Pokédex
        const numero = document.createElement('div');
        numero.classList.add('numero-pokedex');
        numero.textContent = `#${id}`;
        carta.appendChild(numero);

        // Imagen del Pokémon
        const img = document.createElement('img');
        img.src = pokemon.sprites.other['official-artwork'].front_default;
        img.alt = pokemon.name;
        carta.appendChild(img);

        cartasAnimadas.appendChild(carta);
      }


      setTimeout(() => {
        cartasAnimadas.classList.add('animate');
      }, 100);

      mostrarBotonOtro();
    }
  };

  cartaEmergente.onclick = avanzar;
  await mostrarCarta();
}

function mostrarBotonOtro() {
  btnOtro = document.createElement('button');
  btnOtro.textContent = "Abrir otro sobre";
  btnOtro.className = "boton-sobre tipo-btn tipo-electric borde-dorado";
  btnOtro.style.marginTop = "1rem";
  btnOtro.onclick = () => {
    abrirSobre();
  };

  const contenedor = document.getElementById('sobre-contenedor');
  contenedor.appendChild(btnOtro);
}

btnAbrir.addEventListener('click', () => {
  btnAbrir.remove(); // Quita el botón inicial
  abrirSobre();
});

// === Activar el botón de navbar dinámicamente ===
const currentPage = window.location.pathname.split('/').pop();
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
  const href = item.getAttribute('href');
  if (href === currentPage) {
    item.classList.add('active');
  } else {
    item.classList.remove('active');
  }
});
