const grid = document.getElementById("grid");
const puntuacion = document.getElementById("puntuacion");

let vectorBombas = [];//va a contener las celdas que tiene bombas 
let acabaJuego = false;
let almacenarPuntaje = 0;

function configurarMatriz() {
    
    (reiniciarPuntuacion);

    // Obtener los valores de los inputs
    let num1 = parseInt(document.getElementById("num1").value);
    let num2 = parseInt(document.getElementById("num2").value);

    // Verificar que los valores sean válidos
    if (isNaN(num1) || isNaN(num2) || num1 <= 0 || num2 <= 0) {//la funcion isNan es para saber si es un numero o no, viene interna en el javaScrip
        alert("Por favor ingrese valores válidos para las dimensiones del grid.");
        return;
    }

    acabaJuego = false;
    vectorBombas = [];
    grid.innerHTML = "";
    
    const numeroCeldas = num1 * num2;
    vectorBombas = generarArrayBombas(numeroCeldas);

    const anchoCelda = 400 / num2; // Ancho fijo del grid (400) dividido por el número de columnas
    const altoCelda = 400 / num1; // Alto fijo del grid (400) dividido por el número de filas

    // Crear el grid
    for (let i = 0; i < num1; i++) {
        const fila = document.createElement("div");
        //fila.classList.add("fila");

        for (let j = 0; j < num2; j++) {
            const celda = document.createElement("div");
            celda.classList.add("celda");
            celda.style.width = anchoCelda + "px"; // Asignar el ancho dinámicamente
            celda.style.height = altoCelda + "px"; // Asignar el alto dinámicamente
            fila.appendChild(celda);
        }

        grid.appendChild(fila);//Después de crear todas las celdas para una fila, la fila completa se agrega como hijo de la cuadrícula
    }

    // Agregar event listeners a las celdas
    const contenedorCeldas = document.querySelectorAll(".celda");//almacena todas las celdas
    contenedorCeldas.forEach((celda, indice) => {
        celda.addEventListener("click", function () {//se va aplicando en cada celda el evento click
            celdaClickeada(this, indice, contenedorCeldas);//this se refiere a la celda en la que se hizo clic/índice de esa celda en el array de celdas/array de todas las celdas
        });
    });
}

function celdaClickeada(elemento, indice, contenedorCeldas) {
    if (acabaJuego) {//verifica si el juego ha terminado
        return;
    }

    if (esBomba(indice)) {//verifica si la celda es una bomba si es verdad acaba el juego
        acabaJuego = true;//el juego ha terminado
        revelarZonaJuego(contenedorCeldas);
        letreroMensaje('¡Has perdido!', true);
    } else {
        const numeroBombasAdyacentes = obtenerNumeroBombas(indice, contenedorCeldas);

        elemento.classList.add("clicked");//si hizo click-muestra la celda clikeada por el jugador
        elemento.innerHTML = numeroBombasAdyacentes;

        aumentarPuntuacion();

        //si la puntuacion del jugador es  al número total de celdas 
        //menos el número de celdas que contienen bombas. Si es así, significa que el jugador ha descubierto 
        //todas las celdas que no contienen bombas y ha ganado el juego
        if (almacenarPuntaje === contenedorCeldas.length - vectorBombas.length) {
                acabaJuego = true;
                revelarZonaJuego(contenedorCeldas);
                letreroMensaje('¡Has ganado!', true);
            }
    }
}

//funcion para obtener numero de bombas/indiceCelda: es el índice de la celda para la cual se quiere 
//calcular el número de bombas adyacentes/y contenedor celdas:almacena todas las celdas 
function obtenerNumeroBombas(indiceCelda, contenedorCeldas) {

    const celdasPorFilas = Math.sqrt(contenedorCeldas.length);//se calcular celdas por filas
    const arrayIndicesCeldasAdyacentes = [];//guarda los indices de las celdas adyacentes a la celda actual
    const celdasAlaIzquierda = indiceCelda % celdasPorFilas !== 0;//Se verifica si hay celdas a la izquierda de la celda actual
    const celdasAlaDerecha = indiceCelda % celdasPorFilas !== celdasPorFilas - 1;
    const celdasArriba = indiceCelda > celdasPorFilas;
    const celdasAbajo = indiceCelda + celdasPorFilas < contenedorCeldas.length;

    //se verifica y se añaden los indices al vector-arrayIndicesCeldasAdyacentes, dependiendo de la condicion 
    if (celdasAlaIzquierda) {
        arrayIndicesCeldasAdyacentes.push(indiceCelda - 1);//push- Es un método de los arrays en JavaScript que se utiliza para añadir un nuevo elemento al final de un array
    }                                         //5-1=4=verdadero

    if (celdasAlaDerecha) {
        arrayIndicesCeldasAdyacentes.push(indiceCelda + 1);
    }                                       //5+1=6=falso

    if (celdasArriba) {
        arrayIndicesCeldasAdyacentes.push(indiceCelda - celdasPorFilas);
    }                                       //5-3=2=verdadero

    if (celdasAbajo) {
        arrayIndicesCeldasAdyacentes.push(indiceCelda + celdasPorFilas);
    }                                           //5+3=8=verdadero
    //verifica los indices de laS adyacentes 
    if (celdasArriba && celdasAlaIzquierda) {
        arrayIndicesCeldasAdyacentes.push(indiceCelda - celdasPorFilas - 1);
    }   // v - v :v                       //5-3=2   2-1=1 //ese 1 es el indice del lado superior-Izquierdo

    if (celdasArriba && celdasAlaDerecha) {
        arrayIndicesCeldasAdyacentes.push(indiceCelda - celdasPorFilas + 1);
    }    // v - f : f    //no se cumple condicion- excede al tamaño de la matriz -superior-derecha                                

    if (celdasAbajo && celdasAlaIzquierda) {
        arrayIndicesCeldasAdyacentes.push(indiceCelda + celdasPorFilas - 1);
    }   // v - v : v                     //5+3=8  8-1=7 //ese 7 es el indice del lado inferior-Izquierdo 

    if (celdasAbajo && celdasAlaDerecha) {
        arrayIndicesCeldasAdyacentes.push(indiceCelda + celdasPorFilas + 1);
    }   // v - f: f              //no se cumple condicion- excede al tamaño de la matriz -inferior-derecha                                
        

    let numeroBombasAdyacentes = 0;

    for (let i = 0; i < arrayIndicesCeldasAdyacentes.length; i++) {
        const arrayIndiceCeldaAdyacente = arrayIndicesCeldasAdyacentes[i];

        if (vectorBombas.includes(arrayIndiceCeldaAdyacente)) {
            numeroBombasAdyacentes++;
        }
    }

    return numeroBombasAdyacentes;//representa el número total de bombas al rededor de la celda actual
}


function esBomba(indice) {
    return vectorBombas.includes(indice);
    //includes- es un método que se utiliza en arrays en JavaScript 
    //para verificar si un determinado elemento está presente en el array.
    //Este método retorna true si el elemento está presente y false si no lo está.
}

function aumentarPuntuacion() {
    almacenarPuntaje++;
    puntuacion.innerHTML = almacenarPuntaje;
}

function reiniciarPuntuacion() {
    almacenarPuntaje = 0;
    puntuacion.innerHTML = 0;
}

function generarArrayBombas(numeroCeldas) {
    const porcentaje = 0.1; // Porcentaje de bombas deseado - 30%
    let numeroBombasAdyacentes = Math.ceil(numeroCeldas * porcentaje); // Calcular el número de bombas-math.ceil=redondea numeros hacia arriba 
    let resultado = [];//contendrá los índices de las celdas que contendrán bombas

    while (resultado.length < numeroBombasAdyacentes) {
        const indiceBomba = numeroAleatorio(numeroCeldas); // Ajustar el rango para incluir

        if (!resultado.includes(indiceBomba)) {
            resultado.push(indiceBomba);
        }
    }

    return resultado;
}

function numeroAleatorio(max) {// número aleatorio dentro del rango deseado.
    return Math.floor(Math.random() * max);
}

function letreroMensaje(mensaje, acabaJuego) {
    let mensajeElement = document.getElementById('mensaje');
    mensajeElement.textContent = mensaje;
    if (acabaJuego) {
      mensajeElement.style.color = '#894BEB';
    } else {
      mensajeElement.style.color = 'green';
    }
    mensajeElement.style.display = 'block'; // Mostrar el elemento// el block- es para mostrar el mensaje- el none- es ocultar
    mensajeElement.style.display = acabaJuego ? 'block' : 'none'; //es una expresion condicional

}

function revelarZonaJuego(contenedorCeldas) {
    for (let i = 0; i < contenedorCeldas.length; i++) {
        const elemento = contenedorCeldas[i];
        const numeroBombasAdyacentes = obtenerNumeroBombas(i, contenedorCeldas);

        if (esBomba(i)) {
            elemento.classList.add("clicked", "bomba");
        } else {
            elemento.classList.add("clicked");
            elemento.innerHTML = numeroBombasAdyacentes;
        }
    }
}

function reiniciarJuego() {
    const mensajeElement = document.getElementById('mensaje');
    mensajeElement.style.display = 'none'; // Ocultar el mensaje
    
    reiniciarPuntuacion(); // Reiniciar los puntos
    acabaJuego = false; // Reiniciar el estado del juego

    const contenedorCeldas = document.querySelectorAll(".celda");
    contenedorCeldas.forEach(celda => {
        celda.classList.remove("clicked", "bomba"); // Quitar celdas clikeadas y bombas
        celda.innerHTML = ""; // Limpiar el contenido de las celdas
    });

    // Volver a agregar el event listener a las celdas
    contenedorCeldas.forEach((celda, indice) => {
        celda.addEventListener("click", function () {
            celdaClickeada(this, indice, contenedorCeldas);
        });
    });
}
