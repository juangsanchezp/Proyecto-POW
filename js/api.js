const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

/**
 * Obtiene la información detallada de un Pokémon desde la API por su ID.
 * @param {number} id - El ID del Pokémon (1 a 150).
 * @returns {Promise<Object>} - Objeto con los datos del Pokémon.
 */
export async function obtenerPokemonPorId(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}${id}`);
    if (!respuesta.ok) {
      throw new Error(`Error al obtener el Pokémon con ID ${id}`);
    }
    const data = await respuesta.json();
    return data;
  } catch (error) {
    console.error('Error en la API:', error);
    mostrarToast('No se pudo cargar el Pokémon. Inténtalo de nuevo.');
    return null;
  }
}

/**
 * Muestra un mensaje flotante tipo toast.
 * @param {string} mensaje - Texto a mostrar.
 */
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = mensaje;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  }
}
