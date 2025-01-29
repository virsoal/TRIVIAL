let url="https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple";
let preguntas=[];
let aciertos = 0;

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
  
  function pintarPregunta(pregunta, numeroPregunta) {//SET INTERVAL DE 10 SEGUNDOS
    const divPregunta = document.getElementById("pregunta");
    const ulRespuestas = document.getElementById("respuesta");
    const tituloPregunta = document.querySelector(".card-title");
    //Mostramos el titulo con el numero de la pregunta actual
    tituloPregunta.textContent = `Pregunta ${numeroPregunta}`;
  
    // Mostrar la pregunta
    divPregunta.innerHTML = pregunta.titulo;
  
    // Mostrar las respuestas
    ulRespuestas.innerHTML = ""; // Limpiar respuestas previas
    pregunta.respuestas.forEach((respuesta) => {
      const li = document.createElement("li");
      li.classList.add("d-flex","justify-content-start","mb-2");
      const button = document.createElement("button");
      button.textContent = respuesta;
      button.classList.add("btn","btn-outline-dark","w-20","p-2","text-start");
      button.addEventListener("click", () => {
        if (respuesta === pregunta.correcta) {
          aciertos ++;
          button.classList.replace("btn-outline-primary","btn-success");
          //ALERTA CON SWEETALERT
          Swal.fire({
            title: "¡Enhorabuena!",
            text: "Has elegido la respuesta correcta.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });
        } else {
          button.classList.replace("btn-outline-primary","btn-danger");
          Swal.fire({
            title: "¡Incorrecto!",
            text: `La respuesta correcta era: ${pregunta.correcta}`,
            icon: "error",
            confirmButtonText: "Entendido"
        });
        }
        //Actualizamos la puntuacion en la interfaz
        puntuacion.textContent = `Puntuación: ${aciertos}`;
      });
      li.appendChild(button);
      ulRespuestas.appendChild(li);
    });
  }
  
//Iniciar el juego
  async function iniciarJuego() {
    await consultaPreguntas();
    let indice = 0;

    //Restablecer la puntuacion cuando reinicia el juego
    const puntuacion = document.getElementById("puntuacion");
    aciertos = 0; //Restablecer la puntuacion
    puntuacion.textContent = `Puntuación: ${aciertos}`; //Mostrar puntuacion 0 al inicio
  
    function mostrarSiguientePregunta() {
      if (indice < preguntas.length) {
        pintarPregunta(preguntas[indice], indice +1);//Pasamos el numero de la pregunta
        indice++;
      } else {
        clearInterval(intervalo);
        Swal.fire({
          title: "¡Juego terminado!",
          text: `Has acertado ${aciertos} de ${preguntas.length} preguntas.`,
          icon: "success",
          confirmButtonText: "Jugar otra vez",
      }).then(() => {
          indice = 0;
          aciertos = 0;
          iniciarJuego();
      });
        }
      }
    
  
    mostrarSiguientePregunta();
    const intervalo = setInterval(mostrarSiguientePregunta, 10000); // Cada 10 segundos
  }
  
  iniciarJuego()
  
  consultaPreguntas();
