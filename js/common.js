

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