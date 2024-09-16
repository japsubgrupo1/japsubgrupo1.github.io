//Definimos array con los productos y otra para filtrarlos, originalmente vacías
let productArray, filteredArray = [];
let catTitle = document.getElementById("catTitle"); //Obtenemos el h2 con el futuro título de la categoría
let catDescription = document.getElementById("catDescription"); //Obtenemos el p con la futura descripción de la categoría

//Función para mostrar los productos, modificando showProductList que pueda filtrar en base a un parámetro adicional
function showProductList(filteredArr = filteredArray) {
    //Definimos variable vacía para luego pasar al HTML
    let htmlContentToAppend = "";
    //For que recorre incrementalmente el array productArray, al cual se le pasa contenido en a línea 45
    for (let i = 0; i < filteredArr.length; i++) {
        //Definimos variable product, la cual va a equivaler al elemento que el for está evaluando
        let product = filteredArr[i];

        //Editamos variable htmlContentToAppend para que se construya la página con la estructura deseada
        htmlContentToAppend += `
            <div onclick="setProdID(${product.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3" id="productImg">
                        <img src="${product.image}" alt="${product.name}" class="img-thumbnail">
                    </div>
                    <div class="col" id="productContainer">
                        <div class="d-flex w-100 justify-content-between" id="productMain">
                            <h4 class="mb-1" id="productName">${product.name}</h4>
                            <h4 class="mb-1" id="productCost">${product.currency} ${product.cost}</h4>
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
}

//Funciones para extraer y convertir valores a filtrar
//Precio
function getProductPrice(element) {
    //Seleccionamos el elemento con el ID productCost dentro del documento, usandy querySelector
    //Obtenemos el texto del elemento con textContent
    //Utilizamos replace (expresión regular - patrón de búsqueda) para eliminar cualquier caracter que no sea numérico, dejando disponible sólo el número para hacer la comparación
    //Convertimos la cadena de texto (string) a número flotante (decimal) para poder hacer la comparación
    return parseFloat(element.querySelector("#productCost").textContent.replace(/[^0-9.-]/g, ""));
}

//Relevancia
function getProductSoldCount(element) {
    return parseInt(element.querySelector("#soldCounter").textContent.replace(/\D/g, ""), 10);
} 

//Defimos función para guardar el producto al clickearlo
function setProdID(id) {
    localStorage.setItem("prodID", id); //Guardamos el ID del producto clickeado en la key prodID en localStorage
    window.location.href = "product-info.html"; //Redirigimos a product-info.html
}

//Acciones a realizar apenas la página se carga
document.addEventListener("DOMContentLoaded", function (e) {
    //Definimos categoryUrl, el cual va generar una URL comenzando con PRODUCTS_URL (https://japceibal.github.io/emercado-api/cats_products/, definida en init.js)
    //A esta variable se le agrega el valor de la key catID almacenada en localStorage, la cual define la función setCatID, en categories.js (línea 38)
    //A esto finalmente le añadimos el .json, tomándolo de EXT_TYPE para hacerlo más fancy (definido en init.js)
    //Un ejemplo de URL generado puede ser el de Autos, dando como resultado https://japceibal.github.io/emercado-api/cats_products/101.json
    const categoryUrl = `${PRODUCTS_URL}${localStorage.getItem("catID")}${EXT_TYPE}`;

    //Traemos los datos
    getJSONData(categoryUrl).then(function(resultObj) {
        if (resultObj.status === "ok") { //Acción cuando la promesa da "ok"
            catTitle.textContent = resultObj.data.catName; //Modificamos el texto de catTitle para añadir el nombre de la categoría
            productArray = resultObj.data.products; //productArray toma todos los elementos del array de objetos "products", encontrado en la data de la respuesta de la promesa
            filteredArray = [...productArray]; //Creamos copia de productArray para filtrar sin perder el array original
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

    //Funcionalidad de los botones de orden y filtrdo
    //Ordenar los elementos comparando el número de ventas de los productos
    filteredArray.sort((a, b) => b.soldCount - a.soldCount); //Mayor relevancia

    //Mostrar botones de de "menor relevancia" y "menor precio"
    //style.display para que solo algunos botones estén visibles al inicio (mayor relevancia y menor precio), los demás se ocultan y se mostrarán al apretar cada botón
    document.getElementById("lowRelevance").style.display = "none";
    document.getElementById("priceUp").style.display = "inline";
    document.getElementById("highRelevance").style.display = "inline";
    document.getElementById("priceDown").style.display = "none";

    //Botón para filtrar por mayor relevancia
    document.getElementById("highRelevance").addEventListener("click", function () {
        filteredArray.sort((a, b) => b.soldCount - a.soldCount); //Mayor relevancia
        showProductList();

        //Alternar la visibilidad de los botones
        document.getElementById("highRelevance").style.display = "none";
        document.getElementById("lowRelevance").style.display = "inline";
    });

    //Botón para filtrar por menor relevancia
    document.getElementById("lowRelevance").addEventListener("click", function () {
        filteredArray.sort((a, b) => a.soldCount - b.soldCount); //Menor relevancia
        showProductList();

        //Alternar la visibilidad de los botones
        document.getElementById("lowRelevance").style.display = "none";
        document.getElementById("highRelevance").style.display = "inline";
    });

    //Botón para filtrar por menor precio
    document.getElementById("priceUp").addEventListener("click", function () {
        filteredArray.sort((a, b) => a.cost - b.cost); //Menor precio
        showProductList();

        //Alternar la visibilidad de los botones
        document.getElementById("priceUp").style.display = "none";
        document.getElementById("priceDown").style.display = "inline";
    });

    //Botón para filtrar por mayor precio
    document.getElementById("priceDown").addEventListener("click", function () {
        filteredArray.sort((a, b) => b.cost - a.cost); //Mayor precio
        showProductList();

        // Alternar la visibilidad de los botones
        document.getElementById("priceDown").style.display = "none";
        document.getElementById("priceUp").style.display = "inline";
    });

    //Campos de filtrado por precio y botón de filtrar
    document.getElementById("filterButton").addEventListener("click", function() {
        let minPrice = parseFloat(document.getElementById("minPrice").value);
        let maxPrice = parseFloat(document.getElementById("maxPrice").value);

        let filteredProducts = productArray.filter(function(product) {
            let productPrice = parseFloat(product.cost);

            //Filtrar por el rango de precios
            return (isNaN(minPrice) || productPrice >= minPrice) && (isNaN(maxPrice) || productPrice <= maxPrice);
        });

        // Mostrar los productos filtrados
        showProductList(filteredProducts);
    });
  
    //Función para filtrar los elementos por nombre, en tiempo real (input event)
    document.getElementById("searchInput").addEventListener("input", function() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase(); //Agarramos el valor de searchInput, pasándolo a minúscula para evitar errores
        const filteredProducts = productArray.filter(product => {
            return product.name.toLowerCase().includes(searchInput) || product.description.toLowerCase().includes(searchInput); //Filtrar los elementos que coinciden con la búsqueda (searchInput)
        });

        showProductList(filteredProducts); //Mostramos la función filtrada
    });

    //Botón para limpiar el filtro
    document.getElementById("cleanButton").addEventListener("click", function() {
        document.getElementById("minPrice").value = "";
        document.getElementById("maxPrice").value = "";
        document.getElementById("searchInput").value = "";
        showProductList(productArray); //Mostrar array original
    });
});