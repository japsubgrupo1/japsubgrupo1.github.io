document.addEventListener("DOMContentLoaded", function(){
    //Creamos condicional que checkee por la variable loggedIn en localStorage y compare si el valor fue el dado en la función login() en login.js
    if(localStorage.getItem("loggedIn") === "loggedIn") {
        renderIndexPage(); //En caso afirmativo, renderizamos la página
    } else {
        window.location.href = "login.html"; //En caso negativo, redirigimos a login.html
    }
});

//Movemos el contenido original al ejecutarse el DOMContentLoaded a la función renderIndexPage
function renderIndexPage() {
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
}

//Función para que se pueda acceder a mi perfil sólo si se está loggeado

document.addEventListener("DOMContentLoaded",function(){

    //Función que corrobora el estado del inicio de sesión
    function checkLoginStatus(){
        // Obtenemos el valor del localstorage
        const loggedIn = localStorage.getItem("loggedIn");
        // Devuelve el resultado de la comparación (booleano)
        return loggedIn === "loggedIn";
    }
    
    //Verificamos el estado de inicio de sesión
    const isAuthenticated = checkLoginStatus();

    //Definimos una constante que con querySelector seleccione el primer elemento que coincida con el selector elegido entre paréntesis
    const profileLink = document.querySelector(".dropdown-item[href='my-profile.html']");

    // Verificamos si el usuario está loggeado
    if(profileLink){
        profileLink.addEventListener("click", function (event) {
            if (!isAuthenticated) {
              // Si no está autenticado, prevenir la redirección
              event.preventDefault();
              window.location.href = "login.html"; // Redirige a la página de login
            }
        });
    }
});