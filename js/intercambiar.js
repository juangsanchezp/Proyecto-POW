import { obtenerColeccion, guardarColeccion } from './storage.js';
import { obtenerPokemonPorId } from './api.js';
import { conectarWebSocket, enviarCartaIntercambio } from './websocket.js';

let usuario = null;
let cartaSeleccionada = null;
let cartaRecibida = null;

window.addEventListener('DOMContentLoaded', () => {
  const cartasUsuario = document.getElementById('cartasUsuario');
  const cartaAdversario = document.getElementById('cartaAdversario');
  const btnIntercambiar = document.getElementById('btnIntercambiar');
  const toast = document.getElementById('toast');

  // Solicitar usuario (solo si no está en localStorage)
  let guardado = localStorage.getItem('usuarioActivo');
  if (!guardado) {
    const input = prompt("¿Eres el Usuario 1 o 2? (Escribe 1 o 2)");
    if (input === "1" || input === "2") {
      guardado = `usuario${input}`;
      localStorage.setItem('usuarioActivo', guardado);
    } else {
      alert("Debes escribir 1 o 2. Recarga la página para intentar de nuevo.");
      return;
    }
  }

  iniciarComo(guardado);

  function iniciarComo(nombre) {
    usuario = nombre;
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
      carta.innerHTML = `<img src="${datos.sprites.front_default}" alt="${datos.name}">`;
      carta.addEventListener('click', (e) => seleccionarCarta(id, datos, e));
      cartasUsuario.appendChild(carta);
    }
  }

  function seleccionarCarta(id, datos, evento) {
    cartaSeleccionada = { id, nombre: datos.name, imagen: datos.sprites.front_default };
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

  // === Activar automáticamente el botón de navegación correspondiente ===
  const currentPage = window.location.pathname.split('/').pop(); // intercambiar.html
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
});


