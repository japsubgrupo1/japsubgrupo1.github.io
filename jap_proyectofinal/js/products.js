//Definimos array con los productos, originalmente vacía
let productArray = [];
let catTitle = document.getElementById("catTitle");
let catDescription = document.getElementById("catDescription");

//Función para mostrar los productos
function showProductList() {
    //Obtenemos el h2 de id catTitle
    //Editamos el texto del elemento llamado, para que contenga el nombre de la categoría selecionada (atributo catName)
    //Los JSON a llamar se pueden ver en https://github.com/japceibal/emercado-api/tree/main/cats_products/

    //Definimos variable vacía para luego pasar al HTML
    let htmlContentToAppend = "";
    //For que recorre incrementalmente el array productArray, al cual se le pasa contenido en a línea 45
    for (let i = 0; i < productArray.length; i++) {
        //Definimos variable product, la cual va a equivaler al elemento que el for está evaluando
        let product = productArray[i];

        //Editamos variable htmlContentToAppend para que se construya la página con la estructura deseada
        htmlContentToAppend += `
            <div class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.name}" class="img-thumbnail">
                    </div>
                    <div class="col" id="productContainer">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name}</h4>
                            <h4 class="mb-1">${product.currency} ${product.cost}</h4>
                        </div>
                        <p class="mb-1">${product.description}</p>
                        <small class="text-muted" id="soldCounter">${product.soldCount} vendido(s)</small>
                    </div>
                </div>
            </div>
        `
    }

    //Finalmente, le pasamos el contenido de htmlContentToAppend al HTML (reemplazando el HTML interno de el div de id prod-list-container, el cual originalmente está vacío)
    document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;

    //Obtenemos array con todos los elementos de clase "list-group-item" (cada producto)
    let elementos = document.getElementsByClassName("list-group-item");

    //For que recorre incrementalmente el array elementos
    for (i = 0; i < elementos.length; i++) {
        //Definimos variable elemento, la cual va a equivaler al elemento que el for está evaluando
        elemento = elementos[i];

        //Añadimos manejador de evento de click a cada uno de los productos
        elemento.addEventListener("click", function () {
            window.location.href = "product-info.html"; //Redirigimos a product-info.html (funcionalidad en desarrollo)
        });
    }
}

//Acciones a realizar apenas la página se carga
document.addEventListener("DOMContentLoaded", function (e) {
    //Definimos categoryUrl, el cual va generar una URL comenzando con PRODUCTS_URL (https://japceibal.github.io/emercado-api/cats_products/, definida en init.js)
    //A esta variable, se le agrega el valor de la key catID almacenada en localStorage, la cual define la función setCatID, en categories.js (línea 38)
    //A esto finalmente le añadimos el .json, tomándolo de EXT_TYPE para hacerlo más fancy (definido en init.js)
    //Un ejemplo de URL generado puede ser el de Autos, dando como resultado https://japceibal.github.io/emercado-api/cats_products/101.json
    const categoryUrl = `${PRODUCTS_URL}${localStorage.getItem("catID")}${EXT_TYPE}`;

    //Traemos los datos
    getJSONData(categoryUrl).then(function(resultObj) {
        if (resultObj.status === "ok") { //Acción cuando la promesa da "ok"
            catTitle.textContent = resultObj.data.catName;
            productArray = resultObj.data.products; //productArray toma todos los elementos del array de objetos "products", encontrado en la data de la respuesta de la promesa
            showProductList(); //Mostrar elementos en pantalla
        } else { //Acción cuando la promesa no da "ok"
            console.error(`Error durante el fetch a ${categoryUrl}, puede que el recurso no esté disponible.`); //Loggear error en consola
        }
    });

    //Paso extra para añadir la descripción de la categoría abajo de su nombre, también por medio de una promesa, esta vez a CATEGORIES_URL (https://japceibal.github.io/emercado-api/cats/cat.json)
    getJSONData(CATEGORIES_URL).then(function(resultObj) {
        if (resultObj.status === "ok") { //Acción cuando la promesa da "ok"
            for(i = 0; i < resultObj.data.length; i++) { //For que recorre incrementalmente toda la response
                if(resultObj.data[i].id === Number(localStorage.getItem("catID"))) { //Condicional para cuando la id del elemento evaluado es igual al que tenemos guardado en localStorage por setCatID
                    catDescription.textContent = resultObj.data[i].description; //Modificamos el texto de catDescription para añadirle la descripción de la categoría
                }
            }
        } else { //Acción cuando la promesa no da "ok"
            console.error(`Error durante el fetch a ${categoryUrl}, puede que el recurso no esté disponible.`); //Loggear error en consola
        }
    });    
});