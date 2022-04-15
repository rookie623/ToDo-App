// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.


/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {
  if(!localStorage.jwt){
    window.location.replace('./index.html')
  }

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const url = "https://ctd-todo-api.herokuapp.com/v1"
  const btnCerrarSesion = document.getElementById('closeApp')
  const formCrearTarea = document.querySelector('form')
  const username = document.querySelector('p')
  const token = localStorage.jwt;
  const inputNuevaTarea = document.getElementById('nuevaTarea')
  const cantTareasFinalizadas = document.getElementById('cantidad-finalizadas')
  const cantTareasPendientes = document.getElementById('cantidad-pendientes')
  const unorderlistTareasTerminadas = document.querySelector('.tareas-terminadas')
  const undoneTasksList = document.querySelector('.tareas-pendientes')
  const botonesBorrar = document.querySelectorAll('.borrar')
  const userTasks = JSON.parse(localStorage.userTasks)
  cantTareasPendientes.innerText = userTasks.length
  console.log(botonesBorrar);
  
  obtenerNombreUsuario()
  consultarTareas()
  renderizarTareas(userTasks)

  
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
    .then(userTasks => {
      localStorage.setItem('userTasks',JSON.stringify(userTasks))
      })
  }


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault()
    if(inputNuevaTarea.value != ' '){
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
      consultarTareas()
    })
    inputNuevaTarea.value = ''
  }
  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(taskList) {
    undoneTasksList.innerHTML = ''
    unorderlistTareasTerminadas.innerHTML = ''
    taskList.forEach(task => {
      console.log(task)
      const hora = new Date(task.createdAt)
      undoneTasksList.innerHTML += `
      <li class="tarea">
        <div class="descripcion">
          <p class="nombre">${task.description}</p>
          <p class="timestamp">Creado: ${hora.getHours()}:${hora.getMinutes()}hs</p>
          <button class="borrar" id=${task.id}>
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </li>`
    })
  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {




  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
    const settings = { 
      method: "DELETE",
      headers: {
       "authorization": token
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