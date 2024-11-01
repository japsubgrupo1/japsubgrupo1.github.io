function showCart() {
  const container = document.getElementById("my-cart-container"); // Obtenemos el contenedor del carrito
  container.innerHTML = "";  // Limpia el contenedor antes de agregar nuevos elementos

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Verifica si el carrito está vacío al chequear el largo del array
  if (cartItems.length === 0) {
      container.innerHTML = "<p>El carrito está vacío</p>"; // Devuelve un mensaje en caso de que esté vacío
      return;
  }


  // Revisa la cantidad de un mismo producto
  const productCount = {}; // objeto que almacena la cantidad de cada producto
  let total = 0;

  // Contar la cantidad de cada producto en el carrito
  cartItems.forEach((productId) => {
      if (productCount[productId]) {
        // si ya existe se incrementa su cantidad +1
          productCount[productId].cantidad += 1;
      } else {
        // si el producto no se encontró, se le adjudica 1 a su cantidad
          productCount[productId] = {
              id: productId,
              cantidad: 1
          };
      }
  });

  // Crea tarjetas para cada producto único
  Object.values(productCount).forEach((product) => { // object.values convierte los valores del objeto en un array
      const productDetails = getProductDetails(product.id); // obtenemos los detalles del producto para mostrar en la card
      const subtotal = product.cantidad * productDetails.cost;
      total += subtotal;

      // Estructura HTML de cada tarjeta
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
                          <div class="d-flex flex-colum mb-2 justify-content-end px-4" id="deleteCartItemBtn">
                              <button class="btn btn-danger btn-sm px-3" onclick="removeCartItem('${product.id}')">
                                  <span class="material-symbols-outlined">delete</span>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      `;

      // Agrega el contenido de cada producto al contenedor del carrito
      container.innerHTML += productHTML;
  });

  // Muestra el total en el contenedor correspondiente
  document.querySelector("#paymentContainer h4 + p").textContent = `$${total}`;
}

// Función para obtener los detalles de un producto específico
  async function getProductDetails(productId) {
    try {
        const response = await fetch(`${PRODUCT_INFO_URL}${productId}.json`);
        if (!response.ok) throw new Error("No se pudo obtener la información del producto");

        const productData = await response.json();
        return {
            id: productData.id,
            name: productData.name,
            cost: productData.cost,
            img: productData.images || []
        };
    } catch (error) {
        console.error("Error al obtener los detalles del producto:", error);
        return null;
    }
  }

// Función para eliminar un producto del carrito
function removeCartItem(productId) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const updatedCartItems = cartItems.filter(item => item !== productId);
  localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  showCart();  // Actualiza la vista del carrito
}