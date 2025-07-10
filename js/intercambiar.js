// js/intercambiar.js
import { obtenerColeccion, guardarColeccion } from './storage.js';
import { obtenerPokemonPorId } from './api.js';
import { conectarWebSocket, enviarCarta } from './websocket.js';

let rol = null;
let alias = null;
let codigoSala = null;
let cartaSeleccionada = null;
let cartaRecibida = null;

const cartasUsuario = document.getElementById('cartasUsuario');
const cartaAdversario = document.getElementById('cartaAdversario');
const btnIntercambiar = document.getElementById('btnIntercambiar');
const toast = document.getElementById('toast');

// Evento de crear sala
window.crearSala = () => {
  const aliasInput = document.getElementById('aliasCrear');
  alias = aliasInput.value.trim();
  if (!alias) return alert('Escribe un nombre para identificarte');

  codigoSala = generarCodigoSala();
  rol = 'host';
  localStorage.setItem('rol', rol);
  localStorage.setItem('alias', alias);
  localStorage.setItem('codigoSala', codigoSala);

  conectarWebSocket(codigoSala, alias, (carta) => {
    const evento = new CustomEvent('cartaRecibida', { detail: carta });
    window.dispatchEvent(evento);
  });

  document.getElementById('codigoSalaInfo').textContent = codigoSala;
  document.querySelector('.panel-crear-unirse').style.display = 'none';
  document.querySelector('.zona-intercambio').classList.remove('hidden');
  cargarCartasUsuario();
};

// Evento de unirse a sala
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

  conectarWebSocket(codigoSala, alias, (carta) => {
    const evento = new CustomEvent('cartaRecibida', { detail: carta });
    window.dispatchEvent(evento);
  });

  document.getElementById('codigoSalaInfo').textContent = codigoSala;
  document.querySelector('.panel-crear-unirse').style.display = 'none';
  document.querySelector('.zona-intercambio').classList.remove('hidden');
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
    carta.addEventListener('click', (e) => seleccionarCarta(id, datos, e));
    cartasUsuario.appendChild(carta);
  }
}

function seleccionarCarta(id, datos, evento) {
  cartaSeleccionada = {
    id,
    nombre: datos.name,
    imagen: datos.sprites.other['official-artwork'].front_default
  };
  document.querySelectorAll('.carta-seleccionable').forEach(c => c.classList.remove('carta-seleccionada'));
  evento.currentTarget.classList.add('carta-seleccionada');
  enviarCarta(alias, cartaSeleccionada);
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




