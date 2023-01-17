function validarPalabra() {
    let palabra = document.getElementById('input-texto').value;

    if (soloLetrasMayusculas(palabra) == false) {
        toastr["warning"]("El texto no debe tener letras minúsculas");
    }
    
    if (sinAcentos(palabra) == false){
        toastr["warning"]("El texto no debe tener acentos");
    }

    if (sinNumeros(palabra) == false) {
        toastr["warning"]("El texto no debe tener números");
    }

    if (sinCaracteresEspeciales(palabra) == false){
        toastr["warning"]("El texto no debe tener caracteres especiales");
    }

    if (soloLetrasMayusculas(palabra) == true && sinAcentos(palabra) == true && sinNumeros(palabra) == true && sinCaracteresEspeciales(palabra) == true) {
        agregarPalabra(palabra);
        document.getElementById('input-texto').value = "";
        window.location = './juego.html'; // es "./" porque esta en una carpeta: (paginas). Si no se colocará el "./", la ruta seria: paginas/paginas/juego.html y daría error
    }
    

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}


function agregarPalabra(palabra) {
    if (sessionStorage.getItem("lista")) {
        let lista = sessionStorage.getItem("lista").split(",");
        lista.push(palabra);
        sessionStorage.setItem("lista",lista);
    } else {
        let lista = [];
        lista.push(palabra);
        sessionStorage.setItem("lista",lista);
    }
    //Si existe la lista en el storage, recupera la lista existente, luego añade la palabra nueva a la lista y la vuelve a subir en el storage
    //En caso no exista, crea la lista, añade la palabra nueva, y la sube al storage
}


const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

const advertencia = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div class="message">${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')
  alertPlaceholder.append(wrapper)

  setTimeout(function() {
    $(".alert").fadeOut(1500);
  },1500);
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