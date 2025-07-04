// js/api.js
const API_BASE = 'https://pokeapi.co/api/v2';

export async function obtenerPokemonPorId(id) {
  try {
    const respuesta = await fetch(`${API_BASE}/pokemon/${id}`);
    if (!respuesta.ok) {
      throw new Error('No se pudo obtener el Pokémon');
    }
    return await respuesta.json();
  } catch (error) {
    console.error('Error al obtener Pokémon:', error);
    return null;
  }
}

