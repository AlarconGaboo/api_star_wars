const BASE_URL = "https://swapi.dev/api";
const ENDPOINT = "/films/1/";

// Función para obtener los personajes de la película
const obtenerPersonajes = async () => {
  const respuesta = await fetch(`${BASE_URL}${ENDPOINT}`);
  const respuestaJSON = await respuesta.json();
  const arregloURLPersonajes = respuestaJSON.characters;

  const infoPersonajes = arregloURLPersonajes.map(async (URLPersonaje) => {
    const respuesta = await fetch(URLPersonaje);
    const infoPersonaje = await respuesta.json();
    return infoPersonaje;
  });

  const personajesArray = await Promise.all(infoPersonajes);
  return personajesArray;
};

// Función generadora para obtener personajes en bloques de 5
async function* generarPersonajes(personajesArray) {
  let start = 0;
  while (start < personajesArray.length) {
    yield personajesArray.slice(start, start + 5);
    start += 5;
  }
}

// Función para mostrar personajes en un recuadro específico
const mostrarPersonajes = async (characters, detailsDiv, colorClase) => {
  detailsDiv.innerHTML = ''; // Limpiar contenido previo

  const generador = generarPersonajes(characters);
  for await (let personajes of generador) {
    personajes.forEach(personaje => {
      const characterBlock = document.createElement('div');
      characterBlock.className = 'character-block';
      characterBlock.innerHTML = `
        <div class="details-circle ${colorClase}"></div>
        <strong>${personaje.name}</strong><br>
        Altura: ${personaje.height} cm<br>
        Peso: ${personaje.mass} kg
      `;
      detailsDiv.appendChild(characterBlock);

      // Mostrar la información en la consola
      console.log(`Nombre: ${personaje.name}, Altura: ${personaje.height}, Peso: ${personaje.mass}`);
    });
    break; // Solo mostramos el primer bloque de 5 resultados
  }
};

// Inicialización
const iniciar = async () => {
  const personajes = await obtenerPersonajes();

  const secciones = [
    { id: "range1-5", detailsDiv: document.getElementById('details1-5'), colorClase: 'orange' },
    { id: "range6-11", detailsDiv: document.getElementById('details6-11'), colorClase: 'lightgreen' },
    { id: "range12-17", detailsDiv: document.getElementById('details12-17'), colorClase: 'skyblue' }
  ];

  secciones.forEach(seccion => {
    const point = document.getElementById(seccion.id);

    // Evento 'mouseenter' para mostrar la información
    $(point).on('mouseenter', function() {
      if ($(seccion.detailsDiv).is(':hidden')) {
        mostrarPersonajes(personajes.slice(secciones.indexOf(seccion) * 5, (secciones.indexOf(seccion) + 1) * 5), seccion.detailsDiv, seccion.colorClase);
        $(seccion.detailsDiv).stop(false, false).slideDown(100); // Animación con jQuery
      }
    });

    // Evento 'mouseleave' para ocultar la información
    $(point).on('mouseleave', function() {
      $(seccion.detailsDiv).stop(true, true).slideUp(100); // Animación con jQuery
    });
  });
};

window.onload = iniciar;
