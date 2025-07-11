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
  const coleccion = obtenerColeccion(); // ahora es un objeto: { "25": 3, "4": 1 }

  for (const idStr in coleccion) {
    const id = parseInt(idStr);
    const cantidad = coleccion[idStr];

    const datos = await obtenerPokemonPorId(id);
    if (!datos) continue;

    const carta = document.createElement('div');
    carta.className = 'carta-seleccionable';

    const tipo = datos.types[0].type.name;
    const numero = String(datos.id).padStart(3, '0');

    const cartaHTML = `
      <div class="card-container tipo-${tipo}">
        <div class="numero-pokedex">#${numero}</div>
        <div class="cantidad-copias">x${cantidad}</div>
        <div class="card-header">
          <img class="pokemon-img" src="${datos.sprites.other['official-artwork'].front_default}" alt="${datos.name}" />
        </div>
      </div>
    `;

    carta.innerHTML = cartaHTML;
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

window.addEventListener('cartasRecibidas', (evento) => {
  cartasRecibidas = evento.detail;
  actualizarCartasAdversario(cartasRecibidas);
  mostrarToast(`El otro jugador ofreció ${cartasRecibidas.length} carta(s)`);
  verificarIntercambioListo();
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

      const numero = String(carta.id).padStart(3, '0');
      const cartaHTML = `
        <div class="card-container tipo-normal">
          <div class="numero-pokedex">#${numero}</div>
          <div class="card-header">
            <img class="pokemon-img" src="${carta.imagen}" alt="${carta.nombre}" />
          </div>
        </div>
      `;
      div.innerHTML = cartaHTML;
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
  const nuevaColeccion = { ...coleccion };

  // Restar cantidad de las cartas seleccionadas
  for (const carta of cartasSeleccionadas) {
    const id = String(carta.id);
    if (nuevaColeccion[id]) {
      nuevaColeccion[id]--;
      if (nuevaColeccion[id] <= 0) {
        delete nuevaColeccion[id]; // Eliminar si ya no queda copia
      }
    }
  }

  // Sumar las cartas recibidas
  for (const carta of cartasRecibidas) {
    const id = String(carta.id);
    if (nuevaColeccion[id]) {
      nuevaColeccion[id]++;
    } else {
      nuevaColeccion[id] = 1;
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
