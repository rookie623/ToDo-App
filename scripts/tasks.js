'use strict'
// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.


/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {
  if(!localStorage.jwt){
    window.location.replace('./index.html')
  }

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const url = "https://ctd-todo-api.herokuapp.com/v1"
  const token = localStorage.jwt;
  const btnCerrarSesion = document.getElementById('closeApp')
  const formCrearTarea = document.querySelector('form')
  const username = document.querySelector('p')
  const inputNuevaTarea = document.getElementById('nuevaTarea')
  const cantTareasPendientes = document.getElementById('cantidad-finalizadas')
  const undoneTasksList = document.querySelector('.tareas-pendientes')

  obtenerNombreUsuario()
  consultarTareas()
  
  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    localStorage.clear()
    window.location.replace('./index.html')
  })

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const settings = {
      method: 'GET',
      headers: {
        'authorization': token
      }
    }
    fetch(`${url}/users/getMe`, settings)
    .then(response => {
        return response.json()
    })
    .then(userData => {
      username.innerText = `${userData.firstName} ${userData.lastName}`
    })
  }


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const settings = {
      method: 'GET',
      headers: {
        'authorization': token
      }
    }
    fetch(`${url}/tasks`, settings)
    .then(response => {
        return response.json()
    })
    .then(fetchUserTasks => {
      cantTareasPendientes.innerText = fetchUserTasks.length
      renderizarTareas(fetchUserTasks)
      console.log(fetchUserTasks);
    })
  }


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault()
    if(inputNuevaTarea.value !== '') {
      const settings = {
        method: 'POST',
        body: JSON.stringify({
          "description": inputNuevaTarea.value,
          "completed": false,
        }),
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        }
      }
      fetch(`${url}/tasks`, settings)
      .then(response => {
          return response.json()
      })
      .then(taskCreated => {
      })
    }
  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(taskList) {
    taskList.forEach(task => {

      const hora = new Date(task.createdAt)

      const trashIcon = document.createElement('i')
      trashIcon.classList.add('fa-solid')
      trashIcon.classList.add('fa-trash-can')

      const clipboard = document.createElement('i')
      clipboard.classList.add('fa-solid')
      clipboard.classList.add('fa-clipboard')

      const btnClipboard = document.createElement('button')
      btnClipboard.appendChild(clipboard)
      btnClipboard.classList.add('clipboard')

      const btnBorrar = document.createElement('button')
      btnBorrar.appendChild(trashIcon)
      btnBorrar.classList.add('borrar')

      // btnBorrar.onclick = botonBorrarTarea
      btnBorrar.addEventListener('click', () =>{
        botonBorrarTarea(`${task.id}`)
      })

      btnClipboard.addEventListener('click', () =>{
        botonesCambioEstado(task)
      })

      const nombre = document.createElement('p')
      nombre.classList.add('nombre')
      nombre.innerText = `${task.description}`

      const timeStamp = document.createElement('p')
      timeStamp.classList.add('timestamp')
      timeStamp.innerText = `Creado: ${hora.getHours()}:${hora.getMinutes()}hs`

      const descripcion = document.createElement('div')
      descripcion.classList.add('descripcion')
      descripcion.setAttribute('id', `${task.id}`)

      descripcion.appendChild(nombre)
      descripcion.appendChild(timeStamp)
      descripcion.appendChild(btnClipboard)
      descripcion.appendChild(btnBorrar)

      const tarea = document.createElement('li')
      tarea.classList.add('tarea')
      tarea.appendChild(descripcion)

      undoneTasksList.appendChild(tarea)
    })
  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado(task) {
    const settings = { 
      method: "PUT",
      body: JSON.stringify({
        "description": `${task.description}`,
        "completed": `${!task.completed}`
      }),
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      }
    }
     fetch(`${url}/tasks/${task.id}`, settings)
     .then(response => {
       return response.text()
     })
     .then(data => {
      // console.log(data);
     })
  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea(id) {
    const settings = { 
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      }
    }
     fetch(`${url}/tasks/${id}`, settings)
     .then(response => {
       return response.text()
     })
     .then(data => {
      console.log(data);
     })
  }
});