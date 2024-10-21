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
    if(file && file.type.startsWith("image/")) {
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

document.addEventListener("DOMContentLoaded", function() {
    // Buscamos el formulario
    const form = document.querySelectorAll(".needs-validation");

    
    Array.from(form).forEach(form => {
        form.addEventListener("submit", event => {
            // Obtenemos los elementos a utilizar
            const personalDatos = document.getElementById("formpersonaldata");
            const personalDataFormName = document.getElementById("nombre").value; 
            const personalDataFormSecondName = document.getElementById("segundo-nombre").value;
            const personalDataFormSureName = document.getElementById("apellido").value;
            const personalDataFormSecondSureName = document.getElementById("segundo-apellido").value;
            const personalDataFormEmail = document.getElementById("email").value;
            const personalDataFormCellphone = document.getElementById("telefono").value; 

            // Validamos el formulario
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }else{
                saveDataToLocalStorage()
            }

            
            personalDatos.classList.add("was-validated");

            //guardamos en el localstorage
            function saveDataToLocalStorage(){
            localStorage.setItem('nombreDatosPerfil', personalDataFormName);
            localStorage.setItem('segundoNombreDatosPerfil', personalDataFormSecondName);
            localStorage.setItem('apellidoDatosPerfil', personalDataFormSureName);
            localStorage.setItem('segundoApellidoDatosPerfil', personalDataFormSecondSureName);
            localStorage.setItem('emailDatosPerfil', personalDataFormEmail);
            localStorage.setItem('telefonoDatosPerfil', personalDataFormCellphone);
        }

           
        }, false);
    });
});

