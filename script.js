function changeMainImage(imageSrc) {
  const mainImage = document.getElementById('main-image');
  mainImage.src = imageSrc;
}


function increaseQuantity() {
  let quantityInput = document.getElementById('quantity-input');
  let currentValue = parseInt(quantityInput.value);
  quantityInput.value = currentValue + 1;
}


function decreaseQuantity() {
  let quantityInput = document.getElementById('quantity-input');
  let currentValue = parseInt(quantityInput.value);
  if (currentValue > 1) {
    quantityInput.value = currentValue - 1;
  }
}


document.querySelectorAll('.add-to-cart').forEach(function (button) {
  button.addEventListener('click', function () {
    const productId = this.dataset.id;
    const productName = this.dataset.name;
    const productPrice = parseFloat(this.dataset.price);

    const isFromLandingPage = this.dataset.source === "landing";
    let productQuantity = 1; 

  
    if (!isFromLandingPage) {
      productQuantity = parseInt(document.getElementById('quantity-input').value);
    }
    
    console.log(`Adding to Cart: Product ID: ${productId}, Name: ${productName}, Price: ${productPrice}, Quantity: ${productQuantity}`);

   
    let cart = JSON.parse(localStorage.getItem('cart')) || [];


    const existingItem = cart.find(function (item) {
      return item.id === productId;
    });

    if (existingItem) {
  
      existingItem.quantity += productQuantity;
      showPopup(`${productName} added to cart. Quantity: ${existingItem.quantity}`);
    } else {
      
      cart.push({ id: productId, name: productName, price: productPrice, quantity: productQuantity });
      showPopup(`${productName} added to cart.`);
    }

 
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart UI and the cart navigation
    updateCartNav();
    renderCart();
  });
});

// Update Cart Navigation (e.g., cart icon)
function updateCartNav() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalItems = 0;
  let totalAmount = 0;
  let uniqueItemsCount = 0;

  for (let i = 0; i < cart.length; i++) {
    totalItems += cart[i].quantity;
    totalAmount += cart[i].price * cart[i].quantity;
    uniqueItemsCount++;
  }

  document.querySelector('.cart-items').textContent = uniqueItemsCount;
  document.querySelector('.cart-amount').textContent = `$${totalAmount}`;
  document.querySelector('.floating-cart .cart-items').textContent = uniqueItemsCount;
}

// Render Cart in the Cart Page
function renderCart() {
  const cartData = JSON.parse(localStorage.getItem('cart')) || [];
  const cartTableBody = document.querySelector('#cart-table-body');
  if (!cartTableBody) return;

  cartTableBody.innerHTML = '';

  if (cartData.length === 0) {
    cartTableBody.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
  } else {
    let rowIndex = 0;
    cartData.forEach(function (item) {
      const row = `
        <tr>
          <td>${item.name}</td>
          <td>$${item.price}</td>
          <td>
            <button class="quantity-btn" onclick="updateQuantity(${rowIndex}, -1)">-</button>
            ${item.quantity}
            <button class="quantity-btn" onclick="updateQuantity(${rowIndex}, 1)">+</button>
          </td>
          <td>$${item.price * item.quantity}</td>
          <td><button class="remove-btn" onclick="removeFromCart(${rowIndex})">Remove</button></td>
        </tr>
      `;
      cartTableBody.innerHTML += row;
      rowIndex++;
    });
  }

  updateCartSummary();
}


function updateQuantity(rowIndex, change) {
  const cartData = JSON.parse(localStorage.getItem('cart')) || [];
  if (cartData[rowIndex]) {
    cartData[rowIndex].quantity += change;

    // If quantity goes to zero or below, remove the item
    if (cartData[rowIndex].quantity <= 0) {
      cartData.splice(rowIndex, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cartData));
    renderCart();
  } else {
    console.error("Invalid row index for updateQuantity");
  }
}

// Remove item from cart
function removeFromCart(rowIndex) {
  const cartData = JSON.parse(localStorage.getItem('cart')) || [];
  cartData.splice(rowIndex, 1);

  localStorage.setItem('cart', JSON.stringify(cartData));
  renderCart();
  updateCartSummary();
}

// Update the cart summary (unique items count and total price)
function updateCartSummary() {
  const cartData = JSON.parse(localStorage.getItem('cart')) || [];
  let totalAmount = 0;
  let uniqueItemsCount = 0; 

  
  for (let i = 0; i < cartData.length; i++) {
    uniqueItemsCount++;  
    totalAmount += cartData[i].price * cartData[i].quantity;
  }

  
  document.querySelector('#cart-total-items').textContent = uniqueItemsCount; 
  document.querySelector('#cart-total').textContent = `$${totalAmount.toFixed(2)}`; 
}

// Function to clear the cart
function clearCart() {
  // Clear cart data from localStorage
  localStorage.removeItem('cart');

  // Optionally, clear the cart display
  renderCart();
  updateCartNav();

  // Notify the user that the cart has been cleared
  alert("Your cart has been cleared!");
}


document.addEventListener('DOMContentLoaded', function () {
  renderCart();
  updateCartNav();


  const clearCartButton = document.getElementById('clear-cart-btn');
  if (clearCartButton) {
    clearCartButton.addEventListener('click', clearCart);
  }
});



// Function to show custom popup message
function showPopup(message) {
  const popup = document.getElementById('custom-popup');
  const popupMessage = document.getElementById('popup-message');
  const popupClose = document.getElementById('popup-close');
 

  popupMessage.textContent = message;
  popup.style.display = "block"; 
 
  popupClose.onclick = function() {
    popup.style.display = "none";  
  };

  
  window.onclick = function(event) {
    if (event.target === popup) {
      popup.style.display = "none";  
    }
  };
}


