'use strict'
window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector('form')
    const name = document.getElementById('inputNombre')
    const lastname = document.getElementById('inputApellido')
    const email = document.getElementById('inputEmail')
    const password = document.getElementById('inputPassword')
    const rePassword = document.getElementById('inputPasswordRepetida')
    const url = "https://ctd-todo-api.herokuapp.com/v1"

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const settings = {
            method: 'POST',
            body: JSON.stringify(
                {
                    firstName: name.value,
                    lastName: lastname.value,
                    email: email.value,
                    password: password.value,
                }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        realizarRegister(settings)
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        fetch(`${url}/users`, settings)
        .then(response => {
            return response.json()
        })
        .then(info => {
            window.location.replace('./index.html')
        })
    };
});