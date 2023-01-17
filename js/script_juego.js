let contenedorPalabraSecreta = document.getElementById('letras-correctas');
let contenedorLetrasIncorrectas = document.getElementById('letras-incorrectas');
let parrafoCategoria = document.getElementById('categoria')
let horca = document.getElementById('horca');
let lista = JSON.parse(sessionStorage.getItem("lista"));

// Crea un numero random q servira como posicion para ubicar la palabra secreta y su categoria de forma aleatoria, Math.floor sirve para redondear
let posicionRandom = Math.floor(Math.random() * lista.length);

let palabraSecreta = lista[posicionRandom].detalle;
let categoria = lista[posicionRandom].categoria;
let contador = 0;

let numerosUsados = [];

function indicaciones() {
    Swal.fire({
        icon: 'info',
        title: 'Instrucciones',
        text:  'Dispones de 8 intentos, solo puedes presionar letras en mayúscula para completar la palabra',
        color: '#000000'
    })
}

function nuevoJuego() {
    location.reload();
}

function generarEspacioLetras() {

    parrafoCategoria.textContent = categoria;

    for (let i = 0; i < palabraSecreta.length; i++) {
        let letra = document.createElement("div");
        letra.id = `letra-${i}`;
        letra.style = "border-bottom: 3px solid #0A3871; width: 10%; text-align: center; font-size: 24px; font-family: 'Arial';";

        contenedorPalabraSecreta.appendChild(letra);
    }

    // Genera 3 letras aleatorias (j < 3)
    // El numero aleatorio es para seleccionar una letraAleatoria (un div) con id = "letra-(aleatoria)"
    for (let j = 0; j < 3; j++) {
        let numeroAleatorio = generarNumeroAleatorio(palabraSecreta.length);
        let letraAleatoria = document.getElementById(`letra-${numeroAleatorio}`);
        letraAleatoria.textContent = palabraSecreta.charAt(numeroAleatorio);
    }

}

// EXPLICACIÓN DE ESTA FUNCIÓN
// Genera un numero aleatorio en el rango del 0 al tamañoPalabraSecreta y luego verifica si esta repetido o no (linea 34)
// En el while: Mientras el numero este repetido (repetido != false, osea repetido == true), seguirá en el while
// generando otro numero aleatorio y comprobando si esta repetido o no, y asi sucesivamente... hasta
// que el numero no este repetido. En caso sea si, en la linea 35 se guarda el numero no repetido en numerosUsados
// para que en la funcion numeroRepetido haga las verificaciones.
function generarNumeroAleatorio(tamañoPalabraSecreta) {
    let repetido, num;
    while (repetido != false) {
        num = Math.floor(Math.random() * tamañoPalabraSecreta);
        repetido = numeroRepetido(num);
    }
    numerosUsados.push(num);
    return num;
}

// Comprueba si el numero esta repetido verificando si se encuentra en el array de numerosUsados
function numeroRepetido(num) {
    let repetido = false;
    for (let i = 0; i < numerosUsados.length; i++) {
        if (num == numerosUsados[i]) {
            repetido = true;
        }
    }
    return repetido;
}



window.onload = generarEspacioLetras();

window.Swal = indicaciones();



// EXPLICACIÓN LÍNEA 5
// Primero se extrae la lista del session Storage a través del key y luego con el split() se 
// divide el string con el separador de la coma, esto sirve para convertir el string en un array
// si se pasa el cursor del mouse por la variable "lista" se puede ver q la lista es de tipo Array string

// Leer https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/split sobre split()


document.addEventListener('keydown', (e) => {
    let letraTeclado = e.key;

    if (soloLetrasMayusculas(letraTeclado) == true && sinAcentos(letraTeclado) == true && sinNumeros(letraTeclado) == true && sinCaracteresEspeciales(letraTeclado) == true && letraTeclado != "CapsLock") {
        verificarLetra(letraTeclado);
    }
    
    if (verificarGanador() == true){
        Swal.fire({
            title: 'Felicidades!!',
            text: 'Ganaste el juego',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Empezar de nuevo',
            denyButtonText: `Salir`,
            color: '#000000'
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            } else if (result.isDenied) {
                window.location = 'http://renzobtl30.github.io/app-juego-del-ahorcado';
                // window.location = '/index.html'; // Esta linea de codigo es para direccionar al index.html en este entorno (desarrollador)(cuando se esta programando el codigo),
                                                    // ya que no funciona cuando el proyecto esta en github pages (en modo producción)
                                                    // porque la ruta sería http://renzobtl30.github.io/index.html y da error 404
            }
        })
    };

    if (contenedorLetrasIncorrectas.children.length == 8) {

        Swal.fire({
            title: 'Fin del juego',
            text: 'Haz superado los intentos permitidos',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Empezar de nuevo',
            denyButtonText: `Salir`,
            color: '#000000'
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            } else if (result.isDenied) {
                window.location = 'http://renzobtl30.github.io/app-juego-del-ahorcado';
                // window.location = '/index.html'; // Esta linea de codigo es para direccionar al index.html en este entorno (desarrollador)(cuando se esta programando el codigo),
                                                    // ya que no funciona cuando el proyecto esta en github pages (en modo producción)
                                                    // porque la ruta sería http://renzobtl30.github.io/index.html y da error 404
            }
        })
    }
    
}, false);


/* EXPLICACIÓN DE ESTA FUNCIÓN
   - Si la palabraSecreta incluye la letraTeclado, entra al if, si no incluye, entra al else
   - Las lineas 84-90 almacenan las posiciones de las letras que coinciden con la letraTeclado en el array posiciones
   - Las lineas 96-98 recorre el array posiciones y con children (que permite seleccionar los elementos html dentros del contenedor de palabra secreta)
     se asigna el valor de letraTeclado los divs que les falta tenerla. 
   - En el else se crea un div con id letra-incorrecta y se le asigna el valor de letraTeclado (ya que no aparece en la palabraSecreta) */
function verificarLetra(letraTeclado){
    if (palabraSecreta.includes(letraTeclado) == true) {
        let posiciones = [];
        let pos = palabraSecreta.indexOf(letraTeclado);

        while (pos != -1) {
            posiciones.push(pos);
            pos = palabraSecreta.indexOf(letraTeclado, pos + 1) // se pone le pos + 1 para que se establezca la pos de inicio para buscar la letraTeclado en la palabraSecreta
        }

        for (let i = 0; i < posiciones.length; i++) {
            contenedorPalabraSecreta.children.item(posiciones[i]).textContent = letraTeclado;
        }

    } else {
        let letraIncorrecta = document.createElement("div");

        letraIncorrecta.id = `letra-incorrecta`;
        letraIncorrecta.style = "width: 5%; text-align: center; font-size: 15px; font-family: 'Arial';";
        letraIncorrecta.textContent = letraTeclado;

        contenedorLetrasIncorrectas.appendChild(letraIncorrecta);
        contador++;
        dibujarHorca(contador);
    }
    
}

function verificarGanador() {
    let resultado, letrasCorrectas = "";
    for (let i = 0; i < palabraSecreta.length; i++) {
        letrasCorrectas = letrasCorrectas + contenedorPalabraSecreta.children.item(i).textContent.toString();
    }
    if (letrasCorrectas == palabraSecreta) {
        return resultado = true;
    }
    
}

function dibujarHorca(contador) {
    switch (contador) {
        case 1:
            horca.src = "../recursos/parte1.png";
            break;

        case 2:
            horca.src = "../recursos/parte2.png";
            break;

        case 3:
            horca.src = "../recursos/parte3.png";
            break;

        case 4:
            horca.src = "../recursos/parte4.png";
            break;

        case 5:
            horca.src = "../recursos/parte5.png";
            break;

        case 6:
            horca.src = "../recursos/parte6.png";
            break;

        case 7:
            horca.src = "../recursos/parte7.png";
            break;

        case 8:
            horca.src = "../recursos/parte8-otro.png";
            break;
        default:
            break;
    }
    
}

function soloLetrasMayusculas(palabra){
    let format = /[a-z]/;
    return !format.test(palabra);
}


function sinAcentos(palabra) {
    let format = /[áéíóúüÁÉÍÓÚÜ]/;
    return !format.test(palabra);
}


function sinNumeros(palabra) {
    let format = /[0-9]/;
    return !format.test(palabra);
}

function sinCaracteresEspeciales(palabra) {
    let format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return !format.test(palabra);
}