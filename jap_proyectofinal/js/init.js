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

//Creamos función para desconectarse
function logout() {
  localStorage.removeItem("loggedIn"); //Eliminamos la key de loggeo de localStorage
  localStorage.removeItem("username"); //Eliminamos la key del nombre de usuario de localStorage
  window.location.href = "login.html"; //Redirigimos a login.html
}

//Creamos función para renderizar nombre de usuario
function renderUsername() {
  //Obtenemos nav-link vacío para popular con el nombre de usuario
  const userLogout = document.getElementById("userLogout");
  //Cambiamos el texto del mismo elemento para que popule nuestro nombre de usuario, seguido de una barra (|)
  userLogout.textContent = `${localStorage.getItem("username")} | `;
  //Llamamos a la función para renderizar la opción de deslogueo
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