/* Basic frontend-only e-commerce logic */

const logoPath = "images/logo.jpeg";

/* ------- Products data ------- */
const PRODUCTS = [
  {
    id: "chilli-powder",
    name: "Pure Chilli Powder",
    desc: "Rich color & spicy aroma.",
    price: 199.0,
    img: logoPath
  },
  {
    id: "turmeric-powder",
    name: "Turmeric Powder",
    desc: "Premium turmeric powder.",
    price: 149.0,
    img: logoPath
  },
  {
    id: "dhaniya-powder",
    name: "Dhaniya Powder",
    desc: "Fresh ground coriander.",
    price: 129.0,
    img: logoPath
  },
  {
    id: "masala-mix",
    name: "Masala Mix",
    desc: "Balanced spice blend.",
    price: 229.0,
    img: logoPath
  }
];

/* ------- Helpers ------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ------- Navigation ------- */
function showSectionFromHash() {
  const hash = location.hash.replace("#", "") || "home";

  $$(".page").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(hash);
  if (target) target.classList.add("active");

  $$(".nav-link").forEach(a =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + hash)
  );
}

window.addEventListener("hashchange", showSectionFromHash);
if (!location.hash) location.hash = "#home";
showSectionFromHash();

/* ------- Render products ------- */
function createProductCard(p) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <div class="product-image">
      <img src="${p.img}" alt="${p.name}" />
    </div>
    <div>
      <div class="product-name">${p.name}</div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-meta">
        <div class="price">₹${p.price.toFixed(2)}</div>
        <button class="add-btn" data-id="${p.id}">Add</button>
      </div>
    </div>
  `;
  return card;
}

function renderProducts() {
  const grid = $("#products-grid");
  if (!grid) return;
  grid.innerHTML = "";
  PRODUCTS.forEach(p => grid.appendChild(createProductCard(p)));
}

renderProducts();

/* ------- Cart Logic ------- */
const CART_KEY = "manjil_cart_v1";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id) {
  const cart = loadCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  updateCartUI();
}

function removeFromCart(id) {
  const cart = loadCart();
  delete cart[id];
  saveCart(cart);
  updateCartUI();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartUI();
}

function cartTotalAndCount(cart) {
  let total = 0, count = 0;

  for (const id in cart) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) continue;
    total += product.price * cart[id];
    count += cart[id];
  }
  return { total, count };
}

function updateCartUI() {
  const cart = loadCart();
  const { total, count } = cartTotalAndCount(cart);

  const cartCount = $("#cart-count");
  const cartTotal = $("#cart-total");
  const cartItems = $("#cart-items");

  if (cartCount) cartCount.textContent = count;
  if (cartTotal) cartTotal.textContent = "₹" + total.toFixed(2);
  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (count === 0) {
    cartItems.innerHTML = `<p class="muted" style="padding:18px;text-align:center">Your cart is empty.</p>`;
    return;
  }

  for (const id in cart) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) continue;

    const qty = cart[id];

    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img src="${product.img}" alt="${product.name}" />
      <div>
        <strong>${product.name}</strong>
        <div>₹${product.price.toFixed(2)} × ${qty}</div>
      </div>
      <button data-remove="${id}">Remove</button>
    `;
    cartItems.appendChild(el);
  }
}

/* ------- Events ------- */
document.addEventListener("click", (e) => {

  const addBtn = e.target.closest(".add-btn");
  if (addBtn) {
    addToCart(addBtn.dataset.id);
    return;
  }

  if (e.target.id === "clear-cart") {
    clearCart();
    return;
  }

  if (e.target.id === "checkout") {
    alert("Checkout simulated. Thank you!");
    clearCart();
    closeCart();
    return;
  }

  const removeBtn = e.target.closest("[data-remove]");
  if (removeBtn) {
    removeFromCart(removeBtn.dataset.remove);
    return;
  }

  if (e.target.closest("#cart-btn")) {
    openCart();
    return;
  }

  if (e.target.closest("#close-cart")) {
    closeCart();
    return;
  }
});

/* ------- Cart Modal ------- */
function openCart() {
  $("#cart-modal")?.setAttribute("aria-hidden", "false");
}

function closeCart() {
  $("#cart-modal")?.setAttribute("aria-hidden", "true");
}

/* ------- Login Simulation ------- */
const USER_KEY = "manjil_user";

$("#login-form")?.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const email = $("#email").value.trim();
  const password = $("#password").value.trim();

  if (!email || password.length < 6) {
    alert("Enter valid credentials.");
    return;
  }

  localStorage.setItem(USER_KEY, JSON.stringify({ email }));
  updateAuthUI();
  location.hash = "#home";
  alert("Welcome, " + email + "!");
});

function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
  const navLogin = $("#nav-login");

  if (!navLogin) return;

  if (user) {
    navLogin.textContent = user.email.split("@")[0];
    navLogin.href = "#home";
    navLogin.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem(USER_KEY);
      updateAuthUI();
    };
  } else {
    navLogin.textContent = "Login";
    navLogin.href = "#login";
  }
}

updateAuthUI();
updateCartUI();

/* ------- Footer Year ------- */
document.getElementById("year").textContent = new Date().getFullYear();
