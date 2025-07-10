// websocket.js
import { EVENTOS_ABLY } from './constantes.js';

const API_KEY = 'MWXZ8A.Rb8fxg:JsF3dAa7mrzTJ2XPtxTDIiNt7Lvw2PHnjrdOlzBXtqY';
let canal = null;

/**
 * Conecta al canal de Ably usando un código de sala y alias de usuario
 * @param {string} nombreSala - Código único de la sala (ej: 'A1B2C3')
 * @param {string} aliasUsuario - Alias único del jugador (ej: 'Juan')
 * @param {function} onMensajeRecibido - Función que se ejecuta al recibir carta del otro jugador
 */
export function conectarWebSocket(nombreSala, aliasUsuario, onMensajeRecibido) {
  const ably = new Ably.Realtime(API_KEY);
  const nombreCanal = `sala-${nombreSala}`;
  canal = ably.channels.get(nombreCanal);

  canal.subscribe(EVENTOS_ABLY.CARTA_ENVIADA, (mensaje) => {
    const carta = mensaje.data;

    // Ignorar mensajes del mismo usuario
    if (carta.alias !== aliasUsuario) {
      onMensajeRecibido(carta);
    }
  });
}

/**
 * Envía una carta al canal actual con alias incluido
 * @param {string} alias - Alias del jugador que envía la carta
 * @param {object} carta - Objeto con datos de la carta
 */
export function enviarCarta(alias, carta) {
  if (canal) {
    canal.publish(EVENTOS_ABLY.CARTA_ENVIADA, { ...carta, alias });
  }
}


