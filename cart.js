// cart.js - fully functional cart page logic

// For demo, assuming cart data is saved in localStorage with key 'riimart_cart'
// Format: [{id, name, price, quantity, image}]

const cartKey = 'riimart_cart';

function getCart() {
  const cartJSON = localStorage.getItem(cartKey);
  return cartJSON ? JSON.parse(cartJSON) : [];
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalItemsElem = document.getElementById('total-items');
  const totalPriceElem = document.getElementById('total-price');
  const proceedBtn = document.getElementById('proceed-btn');

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    totalItemsElem.textContent = '0';
    totalPriceElem.textContent = '0.00';
    proceedBtn.disabled = true;
    return;
  }

  // Build cart items html
  let html = '';
  cart.forEach(item => {
    html += `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease">−</button>
            <div class="quantity-value">${item.quantity}</div>
            <button class="quantity-btn increase">+</button>
            <button class="remove-btn">Remove</button>
          </div>
        </div>
      </div>
    `;
  });
  cartItemsContainer.innerHTML = html;

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  totalItemsElem.textContent = totalItems;
  totalPriceElem.textContent = totalPrice.toFixed(2);

  proceedBtn.disabled = totalItems === 0;

  // Add event listeners for buttons
  const decreaseBtns = document.querySelectorAll('.quantity-btn.decrease');
  const increaseBtns = document.querySelectorAll('.quantity-btn.increase');
  const removeBtns = document.querySelectorAll('.remove-btn');

  decreaseBtns.forEach(btn => {
    btn.onclick = () => {
      const id = btn.closest('.cart-item').dataset.id;
      changeQuantity(id, -1);
    };
  });

  increaseBtns.forEach(btn => {
    btn.onclick = () => {
      const id = btn.closest('.cart-item').dataset.id;
      changeQuantity(id, +1);
    };
  });

  removeBtns.forEach(btn => {
    btn.onclick = () => {
      const id = btn.closest('.cart-item').dataset.id;
      removeItem(id);
    };
  });
}

function changeQuantity(id, delta) {
  let cart = getCart();
  cart = cart.map(item => {
    if (item.id === id) {
      const newQty = item.quantity + delta;
      return { ...item, quantity: newQty > 0 ? newQty : 1 };
    }
    return item;
  });
  saveCart(cart);
  updateCartUI();
}

function removeItem(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartUI();
}

document.getElementById('proceed-btn').onclick = () => {
  // Redirect to transaction page (you can create this page next)
  window.location.href = 'transaction.html';
};

// Initialize cart UI on page load
updateCartUI();
