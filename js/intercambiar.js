// js/intercambiar.js
import { obtenerColeccion, guardarColeccion } from './storage.js';
import { obtenerPokemonPorId } from './api.js';
import { conectarWebSocket, enviarCartas } from './websocket.js';

let rol = null;
let alias = null;
let codigoSala = null;
let cartasSeleccionadas = [];
let cartasRecibidas = [];

const cartasUsuario = document.getElementById('cartasUsuario');
const cartaAdversario = document.getElementById('cartaAdversario');
const btnIntercambiar = document.getElementById('btnIntercambiar');
const toast = document.getElementById('toast');

window.crearSala = () => {
  const aliasInput = document.getElementById('aliasCrear');
  alias = aliasInput.value.trim();
  if (!alias) return alert('Escribe un nombre para identificarte');

  codigoSala = generarCodigoSala();
  rol = 'host';
  localStorage.setItem('rol', rol);
  localStorage.setItem('alias', alias);
  localStorage.setItem('codigoSala', codigoSala);

  conectarWebSocket(codigoSala, alias, (cartas) => {
    const evento = new CustomEvent('cartasRecibidas', { detail: cartas });
    window.dispatchEvent(evento);
  });

  document.getElementById('codigoSalaInfo').textContent = codigoSala;
  document.querySelector('.panel-crear-unirse').style.display = 'none';
  document.querySelector('.zona-intercambio').classList.remove('hidden');
  btnIntercambiar.classList.remove('hidden');
  cargarCartasUsuario();
};

window.unirseSala = () => {
  const aliasInput = document.getElementById('aliasUnirse');
  const codigoInput = document.getElementById('codigoUnirse');
  alias = aliasInput.value.trim();
  codigoSala = codigoInput.value.trim();
  if (!alias || !codigoSala) return alert('Debes ingresar nombre y código de sala');

  rol = 'guest';
  localStorage.setItem('rol', rol);
  localStorage.setItem('alias', alias);
  localStorage.setItem('codigoSala', codigoSala);

  conectarWebSocket(codigoSala, alias, (cartas) => {
    const evento = new CustomEvent('cartasRecibidas', { detail: cartas });
    window.dispatchEvent(evento);
  });

  document.getElementById('codigoSalaInfo').textContent = codigoSala;
  document.querySelector('.panel-crear-unirse').style.display = 'none';
  document.querySelector('.zona-intercambio').classList.remove('hidden');
  btnIntercambiar.classList.remove('hidden');
  cargarCartasUsuario();
};

function generarCodigoSala() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function cargarCartasUsuario() {
  const ids = obtenerColeccion();
  for (const id of ids) {
    const datos = await obtenerPokemonPorId(id);
    if (!datos) continue;

    const carta = document.createElement('div');
    carta.className = 'carta-seleccionable';
    carta.innerHTML = `<img src="${datos.sprites.other['official-artwork'].front_default}" alt="${datos.name}">`;
    carta.addEventListener('click', () => alternarSeleccion(id, datos, carta));
    cartasUsuario.appendChild(carta);
  }
}

function alternarSeleccion(id, datos, elementoCarta) {
  const index = cartasSeleccionadas.findIndex(c => c.id === id);
  if (index !== -1) {
    cartasSeleccionadas.splice(index, 1);
    elementoCarta.classList.remove('carta-seleccionada');
  } else {
    if (cartasSeleccionadas.length >= 5) {
      mostrarToast('Máximo 5 cartas por intercambio');
      return;
    }
    const nuevaCarta = {
      id,
      nombre: datos.name,
      imagen: datos.sprites.other['official-artwork'].front_default
    };
    cartasSeleccionadas.push(nuevaCarta);
    elementoCarta.classList.add('carta-seleccionada');
  }

  enviarCartas(alias, cartasSeleccionadas);
  verificarIntercambioListo();
}

<<<<<<< HEAD
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
=======
window.addEventListener('cartasRecibidas', (evento) => {
  cartasRecibidas = evento.detail;
  actualizarCartasAdversario(cartasRecibidas);
  mostrarToast(`El otro jugador ofreció ${cartasRecibidas.length} carta(s)`);
  verificarIntercambioListo();
>>>>>>> d98569f71b66de5917d532b5a5844db812205f35
});

function actualizarCartasAdversario(cartas) {
  cartaAdversario.innerHTML = '';

  if (cartas.length === 0) {
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-espera';
    mensaje.textContent = 'Esperando selección...';
    cartaAdversario.appendChild(mensaje);
  } else {
    for (const carta of cartas) {
      const div = document.createElement('div');
      div.className = 'carta-seleccionable';
      div.innerHTML = `<img src="${carta.imagen}" alt="${carta.nombre}" />`;
      cartaAdversario.appendChild(div);
    }
  }
}

function verificarIntercambioListo() {
  const listo = cartasSeleccionadas.length >= 1 && cartasSeleccionadas.length <= 5 &&
                cartasRecibidas.length >= 1 && cartasRecibidas.length <= 5;
  btnIntercambiar.disabled = !listo;
}

btnIntercambiar.addEventListener('click', () => {
  const coleccion = obtenerColeccion();
  const nuevaColeccion = coleccion.filter(id => !cartasSeleccionadas.some(c => c.id === id));

  for (const carta of cartasRecibidas) {
    if (!nuevaColeccion.includes(carta.id)) {
      nuevaColeccion.push(carta.id);
    }
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




