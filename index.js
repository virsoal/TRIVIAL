let url="https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple";
let preguntas=[];

//con esta funcion consulto las preguntas en API
async function consultaPreguntas() {
    // si utilizo un await
    let respuesta = await fetch(url);
    let respuestaJSON = await respuesta.json();

    //tranformar las preguntas en objetos
    preguntas= respuestaJSON.results.map((element, index) => {
/*respuestaJSON.results contiene un array de objetos que representan las preguntas obtenidas de la API
map para crear un nuevo array
element es cada objeto dentro del array (una pregunta con su título, respuestas incorrectas y la correcta)
*/
      console.log(`Pregunta ${index + 1}`);
      console.log(element.question);//contiene el texto de la pregunta proporcionado por la API
      let respuestas = element.incorrect_answers;//array con varias respuestas incorrectas proporcionado por la API
      respuestas.push(element.correct_answer);//se añade la respuesta correcta al array de respuestas (push)
      respuestas.sort(() => Math.random() - 0.5);//mezclar respuestas 

  return { //devuelve un objeto que contiene varias propiedades
    numero: index + 1,
    titulo: element.question,
    respuestas: respuestas,
    correcta: element.correct_answer
  };
  
      
    });
  }
  

  //visualización preguntas en el DOM
  
  function pintarPregunta(pregunta) {//SET INTERVAL DE 10 SEGUNDOS
    const divPregunta = document.getElementById("pregunta");
    const ulRespuestas = document.getElementById("respuesta");
  
    // Mostrar la pregunta
    divPregunta.textContent = pregunta.titulo;
  
    // Mostrar las respuestas
    ulRespuestas.innerHTML = ""; // Limpiar respuestas previas
    pregunta.respuestas.forEach((respuesta) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.textContent = respuesta;
      button.addEventListener("click", () => {
        if (respuesta === pregunta.correcta) {
          alert("¡Correcto!");
        } else {
          alert("Incorrecto, la respuesta era: " + pregunta.correcta);
        }
      });
      li.appendChild(button);
      ulRespuestas.appendChild(li);
    });
  }
  
//Iniciar el juego
  async function iniciarJuego() {
    await consultaPreguntas();
    let indice = 0;
  
    function mostrarSiguientePregunta() {
      if (indice < preguntas.length) {
        pintarPregunta(preguntas[indice]);
        indice++;
      } else {
        alert("¡Juego terminado!");
        clearInterval(intervalo);
      }
    }
  
    mostrarSiguientePregunta();
    const intervalo = setInterval(mostrarSiguientePregunta, 10000); // Cada 10 segundos
  }
  
  iniciarJuego();





























  
  consultaPreguntas();