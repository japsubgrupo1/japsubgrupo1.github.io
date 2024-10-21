const pfpChange = document.getElementById("pfpChange"); //Obtenemos el input para cambiar la imagen
const profilePicture = document.getElementById("profilePicture"); //Obtenemos la imagen

// Función para actualizar la imagen de perfil y guardarla en localStorage
const changePfp = (src) => {
    profilePicture.src = src; // Actualizamos el src de la imagen
    localStorage.setItem("pfpSrc", src); //Guardamos el nuevo src en localStorage
};

//Evento para manejar el cambio de archivo
pfpChange.addEventListener("change", () => {
    const file = pfpChange.files[0]; //Guardamos la imagen en la constante file
    //En caso de que se haya subido un archivo y sea de tipo imagen
    if (file && file.type.startsWith("image/")) {
        const fr = new FileReader(); //Creamos un nuevo FileReader
        fr.onload = () => changePfp(fr.result); //Actualizamos la imagen cuando se lea el archivo
        fr.readAsDataURL(file); //Leemos el archivo como DataURL
    } else { //En caso de que no se haya subido un archivo de tipo imagen, mostramos una alerta de error
        window.alert("Por favor, selecciona un archivo de tipo imagen.");
    }
});

//Cargamos la imagen guardada en localStorage al iniciar la página
const pfpSrc = localStorage.getItem("pfpSrc") || "/img/profile-picture.png"; //profile-picture.png siendo el valor por defecto
changePfp(pfpSrc); //Llamamos a la función para establecer la imagen inicial

const saveEditBtn = document.getElementById("saveEditBtn");

saveEditBtn.addEventListener("click", function (event) {
    // Prevenir el comportamiento predeterminado del botón
    event.preventDefault();

    // Obtener los formularios
    const personalForm = document.querySelector("#personalData form");
    const contactForm = document.querySelector("#contactData form");

    // Validar ambos formularios
    const isPersonalFormValid = personalForm.checkValidity();
    const isContactFormValid = contactForm.checkValidity();

    // Agregar la clase de validación para mostrar los errores
    if (!isPersonalFormValid) {
        personalForm.classList.add("was-validated");
    }

    if (!isContactFormValid) {
        contactForm.classList.add("was-validated");
    }

    // Si ambos formularios son válidos, guardar los datos
    if (isPersonalFormValid && isContactFormValid) {
        saveDataToLocalStorage();
        alert("Los datos han sido guardados exitosamente.");
    } else {
        alert("Por favor, complete todos los campos requeridos.")
    }
});

//Función para guardar datos en localStorage
function saveDataToLocalStorage() {
    //Obtenemos campos
    const formName = document.getElementById("nombre").value;
    const formName2 = document.getElementById("segundo-nombre").value;
    const formLastname = document.getElementById("apellido").value;
    const formLastname2 = document.getElementById("segundo-apellido").value;
    const formEmail = document.getElementById("email").value;
    const formPhone = document.getElementById("telefono").value;

    //Guardamos los campos en localStorage
    localStorage.setItem('nombreDatosPerfil', formName);
    localStorage.setItem('segundoNombreDatosPerfil', formName2);
    localStorage.setItem('apellidoDatosPerfil', formLastname);
    localStorage.setItem('segundoApellidoDatosPerfil', formLastname2);
    localStorage.setItem('email', formEmail);
    localStorage.setItem('telefonoDatosPerfil', formPhone);
}

//Evento a ejecutar una vez carga la página
document.addEventListener("DOMContentLoaded", function () {
    //Array de objetos que mapean los IDs de los elementos del formulario a las keys en localStorage
    const datos = [
        { id: "nombre", key: "nombreDatosPerfil" },
        { id: "segundo-nombre", key: "segundoNombreDatosPerfil" },
        { id: "apellido", key: "apellidoDatosPerfil" },
        { id: "segundo-apellido", key: "segundoApellidoDatosPerfil" },
        { id: "email", key: "email" },
        { id: "telefono", key: "telefonoDatosPerfil" },
    ];

    // Itera sobre cada objeto en el array anteriormente definido
    datos.forEach(dato => {
        //Intentamos obtener el valor correspondiente del localStorage utilizando su key
        const valor = localStorage.getItem(dato.key);
        if(valor) { //Si se encontró un valor, se establece como valor del campo correspondiente en el formulario
            document.getElementById(dato.id).value = valor;
        }
    });
});