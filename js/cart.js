// Función para mostrar el contenido del carrito
async function showCart() {
    // Obtenemos el contenedor donde se mostrará el carrito
    const container = document.getElementById("my-cart-container");
    // Limpiamos el contenido anterior del contenedor
    container.innerHTML = "";

    // Obtenemos los elementos del carrito desde localStorage
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Verificamos si el carrito está vacío
    if (cartItems.length === 0) {
        // Si está vacío, mostramos un mensaje en el contenedor
        container.innerHTML = "<p>El carrito está vacío</p>";
        // Aseguramos que el total se muestre como 0
        document.querySelector("#paymentContainer h4 + p").textContent = "$0"; 
        return;
    }

    const productCount = {}; // Objeto para contar la cantidad de cada producto
    let total = 0; // Variable para almacenar el total

    // Recorremos los IDs de los productos en el carrito
    cartItems.forEach((productId) => {
        if (productCount[productId]) {
            // Si el producto ya existe en productCount aumentamos su cantidad en 1
            productCount[productId].cantidad += 1;
        } else {
            // Si es un nuevo producto lo inicializamos con cantidad 1
            productCount[productId] = {
                id: productId,
                cantidad: 1
            };
        }
    });

    // Recorremos cada producto único en productCount
    for (const product of Object.values(productCount)) {
        // Obtenemos los detalles del producto usando su ID
        const productDetails = await getProductDetails(product.id);
        if (!productDetails) {
            // Si no se pueden obtener los detalles, mostramos un error
            console.error(`No se pudieron obtener los detalles para el producto con ID ${product.id}`);
            continue; // Pasamos al siguiente producto
        }
        // Calculamos el subtotal multiplicando la cantidad por el costo del producto
        const subtotal = product.cantidad * productDetails.cost;
        // Actualizamos el total sumando el subtotal
        total += subtotal;

        // Estructura HTML para mostrar la tarjeta del producto
        let productHTML = `
            <div class="card-product card mx-4 my-3" id="product-container">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${productDetails.img[0]}" class="img-fluid rounded-start" alt="${productDetails.name}">
                    </div>
                    <div class="col-md-5">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${productDetails.name}</h5>
                            <p class="card-text">Precio: $${productDetails.cost}</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="row align-items-end">
                            <div class="d-flex flex-column mt-2">
                                <div class="p-2 d-flex justify-content-around fw-bold">
                                    <p>Cantidad:</p>
                                    <p>${product.cantidad}</p>
                                </div>
                            </div>
                            <div class="d-flex flex-column mb-2">
                                <div class="p-2 d-flex justify-content-around fw-bold">
                                    <p>Subtotal:</p>
                                    <p>$${subtotal}</p>
                                </div>
                            </div>
                            <div class="d-flex flex-column mb-2 justify-content-end px-4" id="deleteCartItemBtn">
                                <button class="btn btn-danger btn-sm px-3" onclick="removeCartItem('${product.id}')">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Agregamos el contenido HTML de la tarjeta del producto al contenedor
        container.innerHTML += productHTML;
    }

    // Actualizamos el total en el contenedor correspondiente
    document.querySelector("#paymentContainer h4 + p").textContent = `$${total}`;
}

// Función para obtener los detalles de un producto específico
async function getProductDetails(productId) {
    try {
        // Hacemos una solicitud para obtener los detalles del producto
        const response = await fetch(`${PRODUCT_INFO_URL}${productId}.json`);
        // Si la respuesta no es válida lanzamos un error
        if (!response.ok) throw new Error("No se pudo obtener la información del producto");

        // Convertimos la respuesta en JSON
        const productData = await response.json();
        // Retornamos los detalles que necesitamos del producto
        return {
            id: productData.id,
            name: productData.name,
            cost: productData.cost,
            img: productData.images || [] // Nos aseguramos que haya imágenes
        };
    } catch (error) {
        // En caso de que ocurra un error lo mostramos en la consola
        console.error("Error al obtener los detalles del producto:", error);
        return null; // Retornamos null en caso de error
    }
}

// Función para eliminar un producto del carrito
async function removeCartItem(productId) {
    // Obtenemos los elementos del carrito desde localStorage
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    // Filtramos los elementos para eliminar el producto específico
    const updatedCartItems = cartItems.filter(item => item !== productId);
    // Actualizamos el localStorage con la lista filtrada
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

    // Obtenemos los detalles del producto que se está eliminando
    const productDetails = await getProductDetails(productId);
    if (!productDetails) return; // Si no se obtienen detalles, salir

    // Llamamos a showCart para mostrar los cambios en el carrito
    showCart(); // Actualiza la vista del carrito
}

// Llamamos a showCart cuando la página haya cargado
document.addEventListener("DOMContentLoaded", () => {
    showCart(); // Inicializa el carrito al cargar la página
});
