const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

/*
//Creamos función para desconectarse
function logout() {
  localStorage.removeItem("loggedIn"); //Eliminamos la key de loggeo de localStorage
  localStorage.removeItem("email"); //Eliminamos la key del nombre de usuario de localStorage
  window.location.href = "login.html"; //Redirigimos a login.html
}

//Creamos función para renderizar nombre de usuario
function renderUsername() {
  //Obtenemos nav-link vacío para popular con el nombre de usuario
  const userDropdown = document.getElementById("userDropdown");

  //Obtenemos el correo del localStorage
  const username = localStorage.getItem("email");

  //Dividimos el correo electrónico con split en el '@' y seleccionamos el primer elemento
  const username = email ? email.split('@')[0]:""; // se usan las comillas vacías para evitar que haya un error en caso de que el valor sea null
  
  userDropdown.textContent = `${username} |`;
  renderLogoutLabel();
}

//Creamos función para renderizar opción de deslogueo
function renderLogoutLabel() {
  //Creamos elemento p de nombre logoutLabel
  const logoutLabel = document.createElement("p");
  //Seteamos id para nuestro elemento
  logoutLabel.setAttribute("id", "logoutLabel");
  //Seteamos atributo onclick para que al apretarse ejecute la función logout()
  logoutLabel.setAttribute("onclick", "logout()");
  //Editamos el texto de nuestro elemento, para que diga "Salir"
  logoutLabel.textContent = "Salir";
  //Seteamos el elemento como hijo de userLogout
  userLogout.appendChild(logoutLabel);
}

//Finalmente, llamamos a la función renderUsername(), para que renderize el nombre de usuario y la opción para desloguearse
renderUsername();
*/

document.addEventListener("DOMContentLoaded", function () {
  // Función para renderizar el nombre de usuario en el dropdown
  function renderUsername() {
    const userDropdown = document.getElementById("userDropdown");
    const email = localStorage.getItem("email");

    // Si hay un email almacenado, lo usamos; de lo contrario, mostramos "Usuario"
    const username = email ? email.split('@')[0] : "Usuario";

    if (userDropdown) {
      userDropdown.textContent = username;
    }
  }

  // Verificamos si el usuario está autenticado antes de mostrar el nombre
  const loggedIn = localStorage.getItem("loggedIn");
  
  if (loggedIn === "loggedIn") {
    renderUsername();
    
    // Asignar el evento para cerrar sesión
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("email");
        window.location.href = "login.html"; // Redirigir a la página de login
      });
    }
  }
});

