// js/websocket.js
import * as Ably from 'https://cdn.ably.io/lib/ably.min-1.js'; // CDN si no lo has instalado vía npm

// 🔐 Reemplaza esta clave por la tuya real de Ably (desde ably.com)
const ABLY_API_KEY = 'AQUI_TU_API_KEY_REAL'; // <-- cambia esto

let ably = null;
let canal = null;

/**
 * Conecta al canal WebSocket e inicia escucha de mensajes.
 * @param {string} nombreUsuario - "usuario1" o "usuario2"
 */
export function conectarWebSocket(nombreUsuario) {
  if (!ABLY_API_KEY || ABLY_API_KEY.includes('TU_API_KEY')) {
    console.error('❌ Ably API Key no configurada.');
    return;
  }

  ably = new Ably.Realtime(ABLY_API_KEY);
  canal = ably.channels.get('intercambio-cartas');

  canal.subscribe('intercambio', (mensaje) => {
    const { desde, carta } = mensaje.data;
    // No mostramos nuestro propio mensaje
    if (desde !== nombreUsuario) {
      mostrarToast(`¡${desde} te ofreció la carta ${carta.nombre}!`);
      const evento = new CustomEvent('cartaRecibida', { detail: carta });
      window.dispatchEvent(evento); // notifica al resto del sistema
    }
  });

  console.log(`✅ Conectado a WebSocket como ${nombreUsuario}`);
}

/**
 * Envía una carta seleccionada al canal WebSocket.
 * @param {string} desde - quién envía
 * @param {object} carta - objeto { id, nombre, imagen }
 */
export function enviarCartaIntercambio(desde, carta) {
  if (canal) {
    canal.publish('intercambio', { desde, carta });
  }
}

/**
 * Muestra un mensaje flotante (toast)
 * @param {string} mensaje
 */
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}
