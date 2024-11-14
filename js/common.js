

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


  async function actualizarBadge() {
    // Obtenemos los elementos del carrito desde localStorage
    const badgeAActualizar = JSON.parse(localStorage.getItem("cartItems")) || [];
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