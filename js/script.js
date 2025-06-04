// -------------------- PRODUCTS & HOME PAGE LOGIC --------------------

const products = [
  {
    id: 1,
    name: "Classic Leather Jacket",
    category: "clothing",
    price: 149.99,
    image: "images/leather-jacket.jpg"
  },
  {
    id: 2,
    name: "Running Sneakers",
    category: "footwear",
    price: 89.99,
    image: "images/running-sneakers.jpg"
  },
  {
    id: 3,
    name: "Bluetooth Headphones",
    category: "electronics",
    price: 59.99,
    image: "images/bluetooth-headphones.jpg"
  },
  {
    id: 4,
    name: "Smart Watch",
    category: "electronics",
    price: 199.99,
    image: "images/smart-watch.jpg"
  },
  {
    id: 5,
    name: "Denim Jeans",
    category: "clothing",
    price: 79.99,
    image: "images/denim-jeans.jpg"
  },
  {
    id: 6,
    name: "Leather Boots",
    category: "footwear",
    price: 129.99,
    image: "images/leather-boots.jpg"
  }
];

const featuredProductsContainer = document.getElementById('featured-products');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderProducts(productsList) {
  if (!featuredProductsContainer) return;

  featuredProductsContainer.innerHTML = '';

  if (productsList.length === 0) {
    featuredProductsContainer.innerHTML = `<p style="text-align:center; font-weight:600; font-size:1.2rem; color:#999;">No products found.</p>`;
    return;
  }

  productsList.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-category">${capitalizeFirstLetter(product.category)}</p>
        <p class="product-price">₹${product.price.toFixed(2)}</p>
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart 🛒</button>
      </div>
    `;
    featuredProductsContainer.appendChild(card);
  });

  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      addToCart(productId);
    });
  });
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const productInCart = cart.find(item => item.id === productId);

  if (productInCart) {
    productInCart.quantity++;
  } else {
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push({ ...product, quantity: 1 });
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  showCustomNotification("Product added to cart!");
  updateCartCount();
}

function showCustomNotification(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.className = "custom-alert";
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 3000);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

function filterProducts() {
  const searchTerm = searchInput?.value.trim().toLowerCase() || '';
  const category = categoryFilter?.value || '';

  const filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = category ? product.category === category : true;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

if (featuredProductsContainer) {
  renderProducts(products);
  searchInput?.addEventListener('input', filterProducts);
  categoryFilter?.addEventListener('change', filterProducts);
  updateCartCount();
}


// -------------------- CART PAGE LOGIC --------------------

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItemsContainer || !cartTotal) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty 🛍️</p>";
      cartTotal.textContent = "0.00";
      return;
    }

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>₹${item.price} × ${item.quantity}</p>
        </div>
        <div class="cart-item-controls">
          <button onclick="updateQuantity(${index}, 'decrease')">➖</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 'increase')">➕</button>
          <button onclick="removeItem(${index})">❌</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemDiv);
    });

    cartTotal.textContent = total.toFixed(2);
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  window.updateQuantity = function(index, action) {
    if (action === "increase") {
      cart[index].quantity += 1;
    } else if (action === "decrease" && cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  window.removeItem = function(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  renderCart();
});

document.addEventListener("DOMContentLoaded", () => {
  const cartButtons = document.querySelectorAll(".add-to-cart");

  cartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");

      // You can use productId to find the product info
      alert("Product added to cart! 🛒 (ID: " + productId + ")");
      
      // OPTIONAL: Add to localStorage or cart array here
    });
  });
});
