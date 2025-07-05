import { obtenerPokemonPorId } from './api.js';
import { obtenerColeccion, guardarColeccion } from './storage.js';

const btnAbrir = document.getElementById('btnAbrirSobre');
const sobreImg = document.getElementById('sobre-imagen');
const cartasDiv = document.getElementById('cartas-reveladas');
const cartasAnimadas = document.getElementById('cartas-animadas');
const destello = document.getElementById('destello');

btnAbrir.addEventListener('click', async () => {
  // Animar sobre
  sobreImg.classList.add('bajando');
  sobreImg.style.transform = 'scale(0.8) rotateY(180deg)';

  // Activar destello
  destello.classList.remove('activo');
  void destello.offsetWidth;
  destello.classList.add('activo');

  // Esperar animación
  await new Promise(resolve => setTimeout(resolve, 1000));
  sobreImg.src = 'assets/img/SobreAbiertoPokemon (2).png'; // Usa el PNG correcto del sobre abierto

  // Obtener nuevas cartas
  let coleccion = obtenerColeccion();
  const nuevasCartas = [];
  while (nuevasCartas.length < 5) {
    const id = Math.floor(Math.random() * 150) + 1;
    if (!nuevasCartas.includes(id)) {
      nuevasCartas.push(id);
    }
  }
  guardarColeccion([...new Set([...coleccion, ...nuevasCartas])]);

  // Mostrar cartas animadas en acordeón
  cartasAnimadas.innerHTML = '';
  for (let i = 0; i < nuevasCartas.length; i++) {
    const id = nuevasCartas[i];
    const pokemon = await obtenerPokemonPorId(id);
    const img = document.createElement('img');
    img.src = pokemon.sprites.other['official-artwork'].front_default;
    img.alt = pokemon.name;
    cartasAnimadas.appendChild(img);
  }

  // Esperar animación de vuelo
  await new Promise(resolve => setTimeout(resolve, 1600));

  // Mostrar en galería
  cartasDiv.innerHTML = '';
  cartasDiv.classList.remove('oculto');
  for (const id of nuevasCartas) {
    const pokemon = await obtenerPokemonPorId(id);
    const img = document.createElement('img');
    img.src = pokemon.sprites.other['official-artwork'].front_default;
    img.alt = pokemon.name;
    cartasDiv.appendChild(img);
  }

  btnAbrir.disabled = true;
  btnAbrir.textContent = "¡Sobre abierto!";
});
