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

function imgSwap(clickedImg) {
    prodImageMain.src = clickedImg.src;
}

function zoom() {
    prodImageMain.style.transform = "scale(1.5)";
    prodImageMain.style.objectFit = "contain";
    prodImageMain.style.border = "0";
    prodImageMain.style.height = "auto";
    prodImageMain.style.margin = "16% 0 0 25%";
    imgBtn.style.display = "block";
}

function unzoom() {
    prodImageMain.style.transform = "none";
    prodImageMain.style.objectFit = "cover";
    prodImageMain.style.border = "border: 1px solid #D9D9D9";
    prodImageMain.style.height = "100%";
    prodImageMain.style.margin = "0";
    imgBtn.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function (e) {
    const productUrl = `${PRODUCT_INFO_URL}${localStorage.getItem("prodID")}${EXT_TYPE}`;

    getJSONData(productUrl).then(function (resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;
            showProduct();
        } else {
            console.error(`Error durante el fetch a ${productUrl}, puede que el recurso no esté disponible.`);
        }
    });

});