let total= 0;// Variable para almacenar el total
updateTotalDisplay()
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

        total=0;//Actualizamos el total a 0
        // Aseguramos que el total se muestre como 0
        document.querySelector("#paymentContainer h4 + p").textContent = "$0"; 
        return;
    }

    const productCount = {}; // Objeto para contar la cantidad de cada producto
     
    total = 0;//Reiniciamos el total
    

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
    updateTotalDisplay()
    // Actualizamos el total en el contenedor correspondiente
    document.querySelector("#totalAmount").textContent = `$${total}`;
}

async function getProductDetails(productId) {
    try {
        // Hacemos una solicitud para obtener los detalles del producto
        const response = await fetch(`${PRODUCT_INFO_URL}${productId}.json`);
        // Si la respuesta no es válida, envía un error
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
    initializeCartBadge();
    updateTotalDisplay()
    
}

const shippingPercentages = {
  standard:0.05,
  express:0.07,
  premium:0.15
};

//Función para el modal
const confirmButton = document.getElementById('confirmBtn');

function saveShippingData() {
    const department = document.getElementById('cityInput').value;
    const city = document.getElementById('nbhInput').value;
    const street = document.getElementById('streetInput').value;
    const addressNumber = document.getElementById('addressNumber').value;
    const corner = document.getElementById('secondAdressInput').value;

    // Opciones seleccionada
    const shippingOption = document.querySelector('input[name="shippingOption"]:checked')?.id;
    let shippingCost = 0;

    if (shippingOption) {
        const selectedShipping = shippingOption;
        shippingCost = total * shippingPercentages[selectedShipping];
    }
    
    // Actualizamos el total agregando el costo de envío
    const totalWithShipping = total + shippingCost;

    document.querySelector("#totalAmount").textContent = `$${totalWithShipping.toFixed(2)}`;

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id;

    // Crea un objeto con los datos
    const shippingData = {
        department,
        city,
        street,
        addressNumber,
        corner,
        shippingOption,
        paymentMethod
    };

    // Almacena el objeto en localStorage como string
    localStorage.setItem('shippingData', JSON.stringify(shippingData));
    console.log('Datos de envío guardados:', shippingData);
    
}

function closeModal() {
    const modal = document.querySelector('#staticBackdrop');
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) {
        bootstrapModal.hide();
    }
}

confirmButton.addEventListener('click', function(event) {
    event.preventDefault(); // Evitar comportamiento predeterminado del botón (para validación)

    // Obtener el formulario de "Datos de envío"
    const addressForm = document.querySelector("#addressForm");
    const shippingContainer = document.querySelector("#shippingContainer");
    const paymentContainer = document.querySelector("#paymentContainer");

    // Obtener los contenedores de error
    const shippingError = document.querySelector("#shippingError");
    const paymentError = document.querySelector("#paymentError");

    // Validar el formulario de dirección
    const isAddressFormValid = addressForm.checkValidity();
    // Validar tipo de envío
    const isShippingSelected = document.querySelector('input[name="shippingOption"]:checked') !== null;
    // Validar método de pago
    const isPaymentSelected = document.querySelector('input[name="paymentMethod"]:checked') !== null;

    // Si el formulario de dirección no es válido
    if (!isAddressFormValid) {
        addressForm.classList.add("was-validated");
    }

    // Si no se seleccionó tipo de envío, mostrar el mensaje de error
    if (!isShippingSelected) {
        shippingContainer.classList.add("was-validated");
        shippingError.style.display = "block"; //
    } else {
        shippingError.style.display = "none";
    }

    // Si no se seleccionó método de pago, mostrar el mensaje de error
    if (!isPaymentSelected) {
        paymentContainer.classList.add("was-validated");
        paymentError.style.display = "block";
    } else {
        paymentError.style.display = "none";
    }

    // Si alguno de los formularios no es válido, detener ejecución
    if (!isAddressFormValid || !isShippingSelected || !isPaymentSelected) {
        return;
    }

    // Si todo es válido, guardar los datos
    saveShippingData();
    closeModal();
    showShippingData();  // Asegúrate de tener esta función implementada
});


// Función para mostrar lo alojado en localStorage
function showShippingData() {
        const shippingData = JSON.parse(localStorage.getItem('shippingData'));
    
        if (shippingData) {
            const paymentLabel = document.querySelector(`label[for="${shippingData.paymentMethod}"]`).textContent;
            const shippingLabel = document.querySelector(`label[for="${shippingData.shippingOption}"]`).textContent;
    
            document.getElementById('paymentSelected').textContent = paymentLabel;
            document.getElementById('shippingSelected').textContent = shippingLabel;

            const addressFormatted = `${shippingData.street} ${shippingData.addressNumber}<br>${shippingData.department}, ${shippingData.locality}`;
            document.getElementById('addressSelected').innerHTML = addressFormatted;
        } else {
            document.getElementById('paymentSelected').textContent = 'no seleccionado';
            document.getElementById('shippingSelected').textContent = 'no seleccionado';
            document.getElementById('addressSelected').innerHTML = 'no seleccionado';
        }
    }
    
// Llamar a la función para actualizar la información al cargar la página
document.addEventListener('DOMContentLoaded', showShippingData);
    

// Llamamos a showCart y showShippingData cuando la página haya cargado
document.addEventListener("DOMContentLoaded", () => {
    showCart();
    showShippingData();
    updateTotalDisplay()
    
});


// Asegurarse de que el costo de envío se recalcule cuando cambie la opción
document.querySelectorAll('input[name="shippingOption"]').forEach((input) => {
    input.addEventListener('change', () => {
        saveShippingData();  // Recalcular y actualizar el total cuando elija una opción de envío
    });
});

//Función para actualizar el total
function updateTotalDisplay() {

    if (isNaN(total) || total < 0) {
        total = 0;  // Si el total no es válido, lo reiniciamos a 0
    }
    // Mostramos el total 
    document.querySelector("#totalAmount").textContent = `$${total.toFixed(2)}`;
};
