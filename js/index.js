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