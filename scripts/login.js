window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector('form')
    const email = document.getElementById('inputEmail')
    const password = document.getElementById('inputPassword')
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
                   "email": email.value,
                   "password": password.value
                }),
            headers:{
                'Content-Type': 'application/json'
            }
        }
        realizarLogin(settings)
    });

    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {
        fetch(`${url}/users/login`, settings)
        .then(response => {
            return response.json()
        })
        .then(info => {
            localStorage.setItem('jwt', info.jwt)
            window.location.replace('./mis-tareas.html')
        })
    };
});