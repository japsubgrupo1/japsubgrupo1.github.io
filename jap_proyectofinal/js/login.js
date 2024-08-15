//Obtenemos contenedor de credentiales
const credentials = document.getElementsByClassName("credentialInput")[0];

//Creamos función login
function login() {
    //Obtenemos valores de lo escrito en el input de usuario y contraseña
    let username = credentials.getElementsByTagName("input")[0].value;
    let password = credentials.getElementsByTagName("input")[1].value;
    //Creamos un condicional que evalúe si algún campo está vacío
    if (username.length <= 0 || password.length <= 0) {
        //Mostramos alerta de error en caso verdadero
        showAlertError();
    } else {
        //Mostramos alerta de suceso en caso negativo
        showAlertSuccess();
        //Y guardamos el estado loggedIn en localStorage, el cual vamos a evaluar en index.js
        localStorage.setItem("loggedIn", "loggedIn");
    }
}

//Obtenemos alertas
let alertLoginOK = document.getElementById("alertLoginOK");
let alertLoginFAIL = document.getElementById("alertLoginFAIL");

//Login correcto
function showAlertSuccess() {
    //Mostrar alerta
    alertLoginOK.style = "display:block; opacity: 1";
    //Añadir mensaje "Redirigiendo..." al segundo y medio de mostrar la alerta
    setTimeout(function() {
        const redirectMsg = document.createElement("p");
        redirectMsg.textContent = "Redirigiendo..."
        redirectMsg.style = "text-align: right; margin-bottom: 0";
        alertLoginOK.appendChild(redirectMsg);
    }, 1500);
    //Redirigir a index.html a través de la función redirectToIndex - al segundo y medio de mostrar mensaje de Redirigiendo (o a los tres segundos de mostrar la alerta)
    setTimeout("redirectToIndex()", 3000);
}

//Login erróneo
function showAlertError() {
    //Mostrar alerta
    alertLoginFAIL.style = "display:block; opacity: 1";
    //Cerrar alerta automáticamente a los tres segundos de ser mostrada
    setTimeout("closeAlert()", 3000);
}

//Ocultar alerta/s
function closeAlert() {
    alertLoginFAIL.style = "display:none";
}

//Redirigir a index
function redirectToIndex() {
    window.location.href = "index.html";
}