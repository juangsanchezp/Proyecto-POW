// websocket.js
import { EVENTOS_ABLY } from './constantes.js';

const API_KEY = 'MWXZ8A.Rb8fxg:JsF3dAa7mrzTJ2XPtxTDIiNt7Lvw2PHnjrdOlzBXtqY';
let canal = null;

/**
 * Conecta al canal de Ably usando un código de sala y alias de usuario
 * @param {string} nombreSala - Código único de la sala (ej: 'A1B2C3')
 * @param {string} aliasUsuario - Alias único del jugador (ej: 'Juan')
 * @param {function} onCartasRecibidas - Función que se ejecuta al recibir cartas del otro jugador
 */
export function conectarWebSocket(nombreSala, aliasUsuario, onCartasRecibidas) {
  const ably = new Ably.Realtime(API_KEY);
  const nombreCanal = `sala-${nombreSala}`;
  canal = ably.channels.get(nombreCanal);

  canal.subscribe(EVENTOS_ABLY.CARTA_ENVIADA, (mensaje) => {
    const datos = mensaje.data;

    // Ignorar mensajes propios
    if (datos.alias !== aliasUsuario) {
      const cartas = datos.cartas || [];
      onCartasRecibidas(cartas);
    }
  });
}

/**
 * Envía un arreglo de cartas al canal con alias incluido
 * @param {string} alias - Alias del jugador que envía las cartas
 * @param {Array<object>} cartas - Arreglo con cartas seleccionadas
 */
export function enviarCartas(alias, cartas) {
  if (canal) {
    canal.publish(EVENTOS_ABLY.CARTA_ENVIADA, { alias, cartas });
  }
}



