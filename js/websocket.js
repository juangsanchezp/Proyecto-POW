import { EVENTOS_ABLY } from './constantes.js';

const API_KEY = 'MWXZ8A.Rb8fxg:JsF3dAa7mrzTJ2XPtxTDIiNt7Lvw2PHnjrdOlzBXtqY';
const canalNombre = 'canal-intercambio';

let canal;

export function conectarWebSocket(nombreUsuario) {
  const ably = new Ably.Realtime(API_KEY);
  canal = ably.channels.get(canalNombre);

  // Escuchar mensajes del canal
  canal.subscribe(EVENTOS_ABLY.CARTA_ENVIADA, (mensaje) => {
    const carta = mensaje.data;
    // Solo mostrar si es del otro jugador
    if (carta.usuario !== nombreUsuario) {
      const evento = new CustomEvent('cartaRecibida', { detail: carta });
      window.dispatchEvent(evento);
    }
  });
}

export function enviarCartaIntercambio(usuario, carta) {
  canal.publish(EVENTOS_ABLY.CARTA_ENVIADA, { ...carta, usuario });
}
