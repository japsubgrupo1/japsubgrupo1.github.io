//Creamos función login
function login() {
    //Obtenemos valores de lo escrito en el input de usuario y contraseña
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value

    //Creamos un condicional que evalúe si algún campo está vacío
    if (email.length <= 0 || password.length <= 0) {
        //Mostramos alerta de error en caso verdadero
        showAlertError();
    } else if (!isValidEmail(email)) {
        // si isValidEmail no es true (devuelve false) muestra la alerta
        showAlertInvalidEmail();
    } else if (!isValidPassword(password)) { //
        // si isValidPassword no es true (devuelve false), muestra la alerta
        showAlertInvalidPassword();
    } else {
        //Mostramos alerta de suceso en caso negativo
        showAlertSuccess();
        //Y guardamos el estado loggedIn en localStorage, el cual vamos a evaluar en index.js
        localStorage.setItem("loggedIn", "loggedIn");
        //Guardamos nuestro nombre de email en otra key en localStorage
        localStorage.setItem("email", email);
    }
}

//Función para login erróneo
function showAlertError() {
    //Mostrar alerta
    alertLoginFail.style = "display:block; opacity: 1"; //modifica el estilo de la alerta
    //Cerrar alerta automáticamente a los tres segundos de ser mostrada
    setTimeout("closeAlert()", 3000);
}

//Función para validar el formato del correo electrónico
function isValidEmail(email) {
    // Expresión para validar un correo con formato más completo
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //Las expresiones regulares son patrones utilizados para buscar, validar o manipular cadenas de texto mediante la coincidencia de secuencias de caracteres específicos en un formato determinado
    //El método test verifica (booleano) si la cadena de mail coincide con el patrón "emailPattern"
    return emailPattern.test(email); 
}

//Función para mail inválido
function showAlertInvalidEmail() {
    // Ocultar otras alertas
    alertLoginOK.style.display = "none";
    alertLoginFail.style.display = "none";
    alertInvalidEmail.style.visibility = "visible"; // Mostrar alerta de email inválido
    alertInvalidEmail.style.opacity = 1;
}

//Función para validar la longitud de la contraseña
function isValidPassword(password) {
    return password.length >= 8; // Verifica que la contraseña tenga al menos 8 caracteres
}

//Función para contraseña inválida
function showAlertInvalidPassword() {
    // Ocultar otras alertas
    alertLoginOK.style.display = "none";
    alertLoginFail.style.display = "none";
    alertInvalidPassword.style.visibility = "visible"; // Mostrar alerta de contraseña inválida
    alertInvalidPassword.style.opacity = 1;
}

//Función para login correcto
function showAlertSuccess() {
    //Mostrar alerta
    alertLoginOK.style = "display:block; opacity: 1";
    //Añadir mensaje "Redirigiendo..." al segundo y medio de mostrar la alerta
    setTimeout(function() {
        const redirectMsg = document.createElement("p");
        redirectMsg.textContent = "Redirigiendo..."
        redirectMsg.style = "margin-bottom: 0";
        alertLoginOK.appendChild(redirectMsg);
    }, 1500);
    //Redirigir a index.html a través de la función redirectToIndex - al segundo y medio de mostrar mensaje de Redirigiendo (o a los tres segundos de mostrar la alerta)
    setTimeout("redirectToIndex()", 3000);
}

//Obtenemos alertas
let alertLoginOK = document.getElementById("alertLoginOK"); //Alerta sesión iniciada
let alertLoginFail = document.getElementById("alertLoginFail"); //Alerta error
let alertInvalidEmail = document.getElementById("alertInvalidEmail"); // Alerta para correos inválidos
let alertInvalidPassword = document.getElementById("alertInvalidPassword"); // Nueva alerta para contraseñas inválidas


//Ocultar alerta/s
function closeAlert() {
    alertLoginFail.style = "display:none";
}

//Redirigir a index

function redirectToIndex() {
    window.location.href = "index.html";
}