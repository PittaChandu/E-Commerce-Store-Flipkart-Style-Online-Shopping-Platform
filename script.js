// 1. Updated Product Data - Removed "Chandu" from specific product names
const PRODUCTS = [
    { 
        id: 1, 
        name: "Chilli Powder", 
        price: 199, 
        desc: "Premium spicy red chilli powder.", 
        image: "images/chilli-powder.jpg" 
    },
    { 
        id: 2, 
        name: "Turmeric Powder", 
        price: 149, 
        desc: "Pure turmeric with rich aroma.", 
        image: "images/turmeric-powder.jpg" 
    },
    { 
        id: 3, 
        name: "Dhaniya Powder", 
        price: 129, 
        desc: "Fresh ground coriander powder.", 
        image: "images/dhaniya-powder.jpg" 
    }
];

// 2. State Management
let cart = JSON.parse(localStorage.getItem("chandu_cart")) || [];

/**
 * Router: Handles page visibility
 */
function showPage() {
    const hash = location.hash || "#home";
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    
    const activePage = document.querySelector(hash);
    if (activePage) activePage.classList.add("active");

    if (hash === "#cart") renderCart();
    if (hash === "#home") renderProducts();
}

window.addEventListener("hashchange", showPage);

/**
 * Product Rendering
 */
function renderProducts() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    grid.innerHTML = PRODUCTS.map(p => `
        <div class="card" data-name="${p.name.toLowerCase()}">
            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200?text=Product'">
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <div class="card-footer">
                <strong>₹${p.price}</strong>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

/**
 * Cart Logic
 */
function addToCart(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty++;
    } else {
        cart.push({ id, qty: 1 });
    }
    saveAndSync();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveAndSync();
}

function saveAndSync() {
    localStorage.setItem("chandu_cart", JSON.stringify(cart));
    updateCartCount();
    if (location.hash === "#cart") renderCart();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const countBadge = document.getElementById("cart-count");
    if (countBadge) countBadge.textContent = totalItems;
}

/**
 * Cart Rendering
 */
function renderCart() {
    const container = document.getElementById("cart-container");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<p>Your cart is empty. <a href="#home">Start Shopping</a></p>`;
        return;
    }

    let total = 0;
    let html = cart.map(item => {
        const product = PRODUCTS.find(p => p.id === item.id);
        if (!product) return '';
        const subtotal = product.price * item.qty;
        total += subtotal;

        return `
            <div class="cart-item">
                <div class="info">
                    <h3>${product.name}</h3>
                    <p>${item.qty} × ₹${product.price} = <strong>₹${subtotal}</strong></p>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${product.id})">Remove</button>
            </div>
        `;
    }).join('');

    html += `
        <div class="cart-total">
            <h3>Total: ₹${total}</h3>
            <button class="checkout-btn" onclick="alert('Order Placed!')">PLACE ORDER</button>
        </div>`;
    container.innerHTML = html;
}

/**
 * Live Search
 */
document.getElementById("search").addEventListener("input", function (e) {
    const query = e.target.value.toLowerCase();
    if (location.hash !== "#home" && query.length > 0) location.hash = "#home";

    document.querySelectorAll(".card").forEach(card => {
        const name = card.getAttribute("data-name");
        card.style.display = name.includes(query) ? "flex" : "none";
    });
});

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderProducts();
    showPage();
});
