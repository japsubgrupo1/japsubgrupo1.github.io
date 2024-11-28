const CATEGORIES_URL = "http://localhost:3000/cat";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "http://localhost:3000/cats_products/";
const PRODUCT_INFO_URL = "http://localhost:3000/products/";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/products_comments/";
const CART_INFO_URL = "http://localhost:3000/cart";
const CART_BUY_URL = "http://localhost:3000/cart";
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

//Modos de color
const themeSwitch = document.getElementById("themeSwitch"); //Obtenemos el slider
const theme = localStorage.getItem("theme"); //Obtenemos la key del tema desde localStorage

//Verificamos si hay tema guardado en localStorage
if(theme) {
  themeSwitch.checked = theme === "dark"; //Marcamos el slider como activado en caso de que el slider esté en "dark"
  switchTheme(themeSwitch.checked); //Aplicamos el tema
} else {
  themeSwitch.checked = false; //En caso contrario, seteamos el slider como desactivado
}

//Detectamos los cambios en el slider
themeSwitch.addEventListener("change", (e) => {
  switchTheme(e.target.checked); //Llamamos a la función para cambiar de tema en base al estado actual del slider
});

//Función para cambiar el tema
function switchTheme(isChecked) {
  const theme = isChecked ? "dark" : "light"; //Determinamos el tema en función al slider
  document.documentElement.dataset.bsTheme = theme; //Aplicamos el tema a la propiedad dataset / data-bs-theme del tag HTML raíz
  localStorage.setItem("theme", theme); //Guardamos el tema seleccionado en localStorage
}

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
        localStorage.clear(); // Limpia todos los datos de localStorage al cerrar sesión
        window.location.href = "login.html"; // Redirigir a la página de login
      });
    }
  }
});



function cartBadge(count){
  const badge=document.getElementById("cart-badge");
  badge.textContent=count;
  badge.style.display = count > 0 ? 'block' : 'none'; 

}

function initializeCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartBadge(cartItems.length);
}

window.onload = initializeCartBadge;
