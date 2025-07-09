import { obtenerColeccion, guardarColeccion } from './storage.js';
import { obtenerPokemonPorId } from './api.js';
import { conectarWebSocket, enviarCartaIntercambio } from './websocket.js';

let usuario = 'usuario1'; // ← Establecido por defecto
let cartaSeleccionada = null;
let cartaRecibida = null;

window.addEventListener('DOMContentLoaded', () => {
  const cartasUsuario = document.getElementById('cartasUsuario');
  const cartaAdversario = document.getElementById('cartaAdversario');
  const btnIntercambiar = document.getElementById('btnIntercambiar');
  const toast = document.getElementById('toast');

  // Guardar usuario predeterminado si no estaba ya
  if (!localStorage.getItem('usuarioActivo')) {
    localStorage.setItem('usuarioActivo', usuario);
  }

  iniciarComo(usuario);

  function iniciarComo(nombre) {
    conectarWebSocket(nombre);
    cargarCartasUsuario();
  }

  async function cargarCartasUsuario() {
    const ids = obtenerColeccion();
    for (const id of ids) {
      const datos = await obtenerPokemonPorId(id);
      if (!datos) continue;

      const carta = document.createElement('div');
      carta.className = 'carta-seleccionable';
      carta.innerHTML = `<img src="${datos.sprites.other['official-artwork'].front_default}" alt="${datos.name}">`;
      carta.addEventListener('click', (e) => seleccionarCarta(id, datos, e));
      cartasUsuario.appendChild(carta);
    }
  }

  function seleccionarCarta(id, datos, evento) {
    cartaSeleccionada = { id, nombre: datos.name, imagen: datos.sprites.other['official-artwork'].front_default };
    document.querySelectorAll('.carta-seleccionable').forEach(c => c.classList.remove('carta-seleccionada'));
    evento.currentTarget.classList.add('carta-seleccionada');
    enviarCartaIntercambio(usuario, cartaSeleccionada);
    verificarIntercambioListo();
  }

  window.addEventListener('cartaRecibida', (evento) => {
    cartaRecibida = evento.detail;
    actualizarCartaAdversario(cartaRecibida);
    mostrarToast(`El otro jugador ofreció: ${cartaRecibida.nombre}`);
    verificarIntercambioListo();
  });

  function actualizarCartaAdversario(carta) {
    cartaAdversario.innerHTML = `
      <img src="${carta.imagen}" alt="${carta.nombre}" />
      <p>${carta.nombre}</p>
    `;
  }

  function verificarIntercambioListo() {
    btnIntercambiar.disabled = !(cartaSeleccionada && cartaRecibida);
  }

  btnIntercambiar.addEventListener('click', () => {
    const coleccion = obtenerColeccion();
    const nuevaColeccion = coleccion.filter(id => id !== cartaSeleccionada.id);
    if (!nuevaColeccion.includes(cartaRecibida.id)) {
      nuevaColeccion.push(cartaRecibida.id);
    }
    guardarColeccion(nuevaColeccion);
    mostrarToast("¡Intercambio realizado!");
    btnIntercambiar.disabled = true;
    setTimeout(() => window.location.href = 'index.html', 2000);
  });

  function mostrarToast(mensaje) {
    toast.textContent = mensaje;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  }
});



