//Definimos array con los productos, originalmente vacía
let product;

let productCount=0;

function showProduct() {
    let htmlContentToAppend = "";

    htmlContentToAppend += `
        <div class="col" id="prodImagesDiv">
        
            <img onclick="imgSwap(prodImage1)" id="prodImage1" src="${product.images[0]}" alt="${product.name}">
            <img onclick="imgSwap(prodImage2)" id="prodImage2" src="${product.images[1]}" alt="${product.name}">
            <img onclick="imgSwap(prodImage3)" id="prodImage3" src="${product.images[2]}" alt="${product.name}">
            <img onclick="imgSwap(prodImage4)" id="prodImage4" src="${product.images[3]}" alt="${product.name}">
        </div>
        <div class="col" id="prodImageMainDiv">
            <img onclick="zoom()" id="prodImageMain" src="${product.images[0]}" alt="${product.name}">
            <button id="imgBtn" type="button" class="btn-close" aria-label="Cerrar imagen" onclick="unzoom()"></button>
        </div>
        <div class="col" id="productInfo">
            <small class="text-muted">${product.category} | ${product.soldCount} vendidos</small>
            <h4 class="mb-1" id="productInfoName">${product.name}</h4>
            <h4 class="mb-1" id="productInfoCost">${product.currency} ${product.cost}</h4> <a class="mb-1 btn btn-warning .fs-5 text fw-bold" id="buyBtn" onclick="buyItem()">Comprar</a>
            <h4 class="mb-1" id="productInfoDesc">${product.description}</h4>
            <p>Artículos recomendados:</p>
            <div class="col" id="relatedProducts">
                <div class="relatedImages">
                    <img onclick="setProdID(${product.relatedProducts[0].id})" src="${product.relatedProducts[0].image}" title="${product.relatedProducts[0].name}" alt="${product.relatedProducts[0].name}">
                    <img onclick="setProdID(${product.relatedProducts[1].id})" src="${product.relatedProducts[1].image}" title="${product.relatedProducts[1].name}" alt="${product.relatedProducts[1].name}">
                </div>
            </div>
        </div>
    `

    document.getElementById("prod-info-container").innerHTML = htmlContentToAppend;
}

// Función para obtener los comentarios desde la API
async function getComments() {
    //Constante que almacena la URL de la API
    const productCommentsUrl = `${PRODUCT_INFO_COMMENTS_URL}${localStorage.getItem("prodID")}${EXT_TYPE}`;// Concatenamos el ID del prodcuto a la URL desde la constante declarada en init.js para luego obter de ahí el mismo ID que está almacenado en localstorage
    //
    try {
        const response = await fetch(productCommentsUrl); // el código espera la respuesta del fetch para ejecutarse
        const comments = await response.json(); // el método .json lee el cuerpo de la respuesta y lo convierte en un objeto JSON.
        console.log("Comentarios obtenidos:", comments);
        showComments(comments); // Mostrar los comentarios
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
    }
}

// Función para mostrar las calificaciones en pantalla
function showComments(comments) {
    const container = document.getElementById("all-califications"); // Obtenemos el contenedor all-califications que está en el HTML
    container.innerHTML = "";  // Limpiar el contenedor antes de agregar nuevos comentarios

    //Para cada comentario se crea una nueva tarjeta con todas las especificaciones
    comments.forEach(comment => {
        let commentHTML = `
            <div class="comment card mb-2" id="api-container">
                <div class="card-body" id="api-comments">
                    <div class="row">
                        <div class="col-sm-4 col-md-4">
                        <h6 class="card-title"><strong>${comment.user}</strong></h6>
                        </div>
                        <div class="col-md-3 offset-md-5 d-flex md-flex-row-reverse">
                        <p>${getStarsHTML(comment.score)}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-10">
                        <p>${comment.description}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3 ms-auto">
                        <p id="dateTime">${comment.dateTime.split(' ')[0]}</p>   
                        <!--Usamos el método split para que sólo aparezca la fecha-->
                        </div>
                    </div>                   
                </div>
            </div>
        `;

        container.innerHTML += commentHTML;
    });
}

// Función para mostrar estrellas según la calificación
function getStarsHTML(score) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= score) {
            stars += `<span class="fa fa-star checked"></span>`;
        } else {
            stars += `<span class="fa fa-star"></span>`;
        }
    }
    return stars;
}

//Defimos función para guardar el producto al clickearlo
function setProdID(id) {
    localStorage.setItem("prodID", id); //Guardamos el ID del producto clickeado en la key prodID en localStorage
    // podemos llamar esta función para guardar en el carrito?
    window.location.href = "product-info.html"; //Redirigimos a product-info.html
}

//Función para cambiar la imagen una vez clickeada, recibe por parámetro el URL de la imagen clickeada
function imgSwap(clickedImg) {
    prodImageMain.src = clickedImg.src; //Cambia la ruta de la imagen principal por la de la imagen clickeada
}

//Función para hacer zoom
function zoom() {
    if (window.innerWidth <= 768) { //Caso en el que el ancho de la pantalla es igual o menor a 768px (tablet / celular)
        null; //Aquí se hará una función para agrandar la imagen de alguna forma aún no decidida, ya que de momento se ve bien en el dispositivo
    } else { //Caso contrario (escritorio)
        prodImageMain.style.transform = "scale(1.5)"; //Agrandar imagen
        prodImageMain.style.objectFit = "contain"; //Mostrar imágen en relación de aspecto original (cover / panorámica)
        prodImageMain.style.border = "0"; //Eliminamos el borde
        prodImageMain.style.height = "auto"; //Mostramos el alto total de la imágen
        prodImageMain.style.margin = "16% 0 0 25%"; //Movemos la imagen
        prodImageMain.style.cursor = "auto"; //Seteamos el cursor denuevo en auto
        imgBtn.style.display = "block"; //Mostramos el botón de cerrado
    }
}

//Función para quitar el zoom cuando se aprieta el botón, revirtiendo los cambios de zoom() (no encontramos mejor forma de hacer esto aún)
function unzoom() {
    prodImageMain.style.transform = "none";
    prodImageMain.style.objectFit = "cover";
    prodImageMain.style.border = "border: 1px solid #D9D9D9";
    prodImageMain.style.height = "100%";
    prodImageMain.style.margin = "0";
    prodImageMain.style.cursor = "pointer";
    imgBtn.style.display = "none";
}

//Acciones a realizar apenas la página se carga
document.addEventListener("DOMContentLoaded", function (e) {
    //Definimos productUrl, el cual va generar una URL comenzando con PRODUCT_INFO_URL (https://japceibal.github.io/emercado-api/products/, definida en init.js)
    //A esta variable se le agrega el valor de la key prodID almacenada en localStorage, la cual define la función setProdID, en products.js (línea 40)
    //A esto finalmente le añadimos el .json, tomándolo de EXT_TYPE para hacerlo más fancy (definido en init.js)
    //Un ejemplo de URL generado puede ser el del Chevrolet Onix Joy, dando como resultado https://japceibal.github.io/emercado-api/products/50921.json
    const productUrl = `${PRODUCT_INFO_URL}${localStorage.getItem("prodID")}${EXT_TYPE}`;

    //Traemos los datos
    getJSONData(productUrl).then(function (resultObj) {
        if (resultObj.status === "ok") { //Acción cuando la promesa da "ok"
            product = resultObj.data; //product toma todos los elementos del array del producto al que se ingresa, encontrado en la data de la respuesta de la promesa
            showProduct(); //Mostrar elementos en pantalla
        } else { //Acción cuando la promesa no da "ok"
            console.error(`Error durante el fetch a ${productUrl}, puede que el recurso no esté disponible.`); //Loggear error en consola
        }
    });

    //Cargamos los comentarios del producto
    const productCommentsUrl = `${PRODUCT_INFO_COMMENTS_URL}${localStorage.getItem("prodID")}${EXT_TYPE}`;

    // Obtener los comentarios usando fetch
    fetch(productCommentsUrl)
        .then(response => response.json())
        .then(comments => {
            console.log("Comentarios obtenidos:", comments); // Verificar en consola
            showComments(comments); // Mostrar los comentarios en la página
        })
        .catch(error => {
            console.error("Error al obtener comentarios:", error);
        });

    function addComment() {
        // Obtener los valores del formulario
        const user = document.getElementById("userName").value;
        const description = document.getElementById("userComment").value;
        const score = parseInt(document.getElementById("userRating").value);
        const dateTime = new Date().toISOString(); // Obtener la fecha y hora actual en formato ISO (ej: 2024-10-06T14:23:42.511Z)

        // Validación para asegurarse de que los campos estén completos
        if (user && description) {
            // Crear el HTML del nuevo comentario
            const newCommentHTML = `
                    <div class="comment card mb-2" id="api-container">
                        <div class="card-body" id="api-comments">
                            <div class="row">
                                <div class="col-sm-4 col-md-4">
                                <h6 class="card-title"><strong>${user}</strong></h6>
                                </div>
                                <div class="col-md-3 offset-md-5 d-flex md-flex-row-reverse">
                                <p>${getStarsHTML(score)}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-10">
                                <p>${description}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3 ms-auto">
                                <p id="dateTime">${dateTime.split('T')[0]}</p>   
                                <!--Usamos el método split para que sólo aparezca la fecha-->
                                </div>
                            </div>                   
                        </div>
                    </div>
                `;

            // Agregar el nuevo comentario al contenedor 'all-califications'
            const container = document.getElementById("all-califications");
            container.innerHTML += newCommentHTML;  // Añadir el nuevo comentario sin borrar los existentes

            // Limpiar los campos del formulario
            document.getElementById("userName").value = "";
            document.getElementById("userComment").value = "";
            document.getElementById("userRating").value = "5";
        } else {
            alert("Falta completar datos.");
        }
    }
    //Botón submitComment al evento de clic
    document.getElementById("submitComment").addEventListener("click", function () {
        addComment(); // Llama a la función addComment cuando se hace clic en el botón
    });
});
 
//Función para el boton comprar



function buyItem() {
    let cartItems=JSON.parse(localStorage.getItem("cartItems")) || [];

    const prodID=localStorage.getItem("prodID");

    if (prodID) {
        cartItems.push(prodID);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } 
    location.href="cart.html";

    cartBadge(cartItems.length);
}

