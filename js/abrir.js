import { obtenerPokemonPorId } from './api.js';
import { obtenerColeccion, guardarColeccion } from './storage.js';
import { crearVistaCarta } from './carta.js';

const btnAbrir = document.getElementById('btnAbrirSobre');
const sobreImg = document.getElementById('sobre-imagen');
const cartasAnimadas = document.getElementById('cartas-animadas');
const cartaEmergente = document.getElementById('carta-emergente');
const destelloCSS = document.getElementById('destello-css');

btnAbrir.addEventListener('click', async () => {
  // Animación inicial
  sobreImg.classList.add('bajando');
  destelloCSS.classList.remove('destello-css');
  void destelloCSS.offsetWidth;
  destelloCSS.classList.add('destello-css');

  await new Promise(resolve => setTimeout(resolve, 700));
  sobreImg.src = 'assets/img/SobreAbiertoPokemon (4).png';

  // Selección aleatoria
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

      // Mostrar todas en arco
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

  cartaEmergente.addEventListener('pointerdown', avanzar);
  await mostrarCarta();
});
