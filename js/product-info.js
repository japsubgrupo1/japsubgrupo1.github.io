//Definimos array con los productos, originalmente vacía
let product;

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
            <h4 class="mb-1" id="productInfoCost">${product.currency} ${product.cost}</h4>
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

//Defimos función para guardar el producto al clickearlo
function setProdID(id) {
    localStorage.setItem("prodID", id); //Guardamos el ID del producto clickeado en la key prodID en localStorage
    window.location.href = "product-info.html"; //Redirigimos a product-info.html
}

//Función para cambiar la imagen una vez clickeada, recibe por parámetro el URL de la imagen clickeada
function imgSwap(clickedImg) {
    prodImageMain.src = clickedImg.src; //Cambia la ruta de la imagen principal por la de la imagen clickeada
}

//Función para hacer zoom
function zoom() {
    if(window.innerWidth <= 768) { //Caso en el que el ancho de la pantalla es igual o menor a 768px (tablet / celular)
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

});