// js/websockets.js
const ABLY_API_KEY = 'TU_ABLY_API_KEY';

let ably = null;
let canal = null;

export function conectarWebSocket(nombreUsuario) {
  ably = new Ably.Realtime(ABLY_API_KEY);
  canal = ably.channels.get('intercambio-cartas');

  canal.subscribe('intercambio', (mensaje) => {
    const { desde, carta } = mensaje.data;
    mostrarToast(`¡${desde} te ofreció la carta ${carta.nombre}!`);
  });

  console.log(`Conectado a WebSocket como ${nombreUsuario}`);
}

export function enviarCartaIntercambio(desde, carta) {
  if (canal) {
    canal.publish('intercambio', { desde, carta });
  }
}

function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

