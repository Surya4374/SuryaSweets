/**
 * Menu page: products, search, category filters, cart, toast, loading, lazy load.
 * Keeps existing cart logic and localStorage.
 */
var orderItems = JSON.parse(localStorage.getItem("cartData")) || {};
var grandTotal = parseInt(localStorage.getItem("cartTotal"), 10) || 0;

var grandTotalSpan = document.getElementById("grandTotal");
var orderList = document.getElementById("orderList");
var container = document.getElementById("productContainer");
var categoryTitleEl = document.getElementById("categoryTitle");
var searchInput = document.getElementById("searchProducts");
var productCategoryFilters = document.getElementById("productCategoryFilters");
var loadingOverlay = document.getElementById("loadingOverlay");

var selectedCategory = localStorage.getItem("selectedCategory");
var productsData = window.SuryaStore ? SuryaStore.getProducts() : {
    Pizza: [
        { name: "Italian Pizza", price: 299, image: "assets/italianPizza.png", inStock: true },
        { name: "Farmhouse Pizza", price: 349, image: "assets/farmhousePizza.png", inStock: true }
    ],
    "Ice Cream": [{ name: "Vanilla Ice Cream", price: 99, image: "assets/vanilaIceCream.png", inStock: true }],
    Sweets: [{ name: "Kaju Katli", price: 499, image: "assets/kajuKatli.png", inStock: true }],
    Chocolates: [{ name: "Dark Chocolate", price: 199, image: "assets/darkChocolate.png", inStock: true }]
};

if (!selectedCategory) {
    window.location.href = "index.html";
    throw new Error("redirect");
}

if (grandTotalSpan) grandTotalSpan.textContent = grandTotal;
if (categoryTitleEl) categoryTitleEl.textContent = selectedCategory;

// Get all products with category for "All" view
function getAllProducts() {
    var list = [];
    for (var cat in productsData) {
        (productsData[cat] || []).forEach(function (p) {
            list.push({ category: cat, name: p.name, price: p.price, image: p.image, inStock: p.inStock !== false, objectFit: p.objectFit });
        });
    }
    return list;
}

function getProductsForCategory(cat) {
    if (!cat || cat === "All") return getAllProducts();
    return (productsData[cat] || []).map(function (p) {
        return { category: cat, name: p.name, price: p.price, image: p.image, inStock: p.inStock !== false, objectFit: p.objectFit };
    });
}

// Toast
function showToast(message) {
    var container = document.getElementById("toastContainer");
    if (!container) return;
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
        toast.remove();
    }, 2500);
}

// Loading
function showLoading(show) {
    if (loadingOverlay) {
        loadingOverlay.classList.toggle("visible", !!show);
    }
}

// Cart count + panel
function updateCartCount() {
    var count = 0;
    for (var k in orderItems) count += orderItems[k].quantity;
    var el = document.getElementById("cartCount");
    if (el) el.textContent = count;
    if (window.updateCartPanel) window.updateCartPanel();
}

function updateOrderList() {
    if (!orderList) return;
    orderList.innerHTML = "";
    for (var item in orderItems) {
        var d = orderItems[item];
        var li = document.createElement("li");
        li.textContent = item + " x " + d.quantity + " - ₹" + (d.quantity * d.price);
        orderList.appendChild(li);
    }
    updateCartCount();
}

var currentProductFilter = selectedCategory;
var productFilterButtons = [];

function buildProductFilterButtons() {
    if (!productCategoryFilters) return;
    productFilterButtons = ["All"].concat(Object.keys(productsData));
    productCategoryFilters.innerHTML = "";
    productFilterButtons.forEach(function (cat) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "filter-btn" + (cat === selectedCategory ? " active" : "");
        btn.setAttribute("data-category", cat);
        btn.textContent = cat;
        productCategoryFilters.appendChild(btn);
    });
    productCategoryFilters.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter-btn");
        if (!btn) return;
        productCategoryFilters.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        currentProductFilter = btn.getAttribute("data-category");
        showLoading(true);
        setTimeout(function () {
            renderProducts();
            showLoading(false);
        }, 300);
    });
}

function renderProducts() {
    var list = getProductsForCategory(currentProductFilter);
    var query = (searchInput && searchInput.value) ? searchInput.value.trim().toLowerCase() : "";
    if (query) {
        list = list.filter(function (p) { return p.name.toLowerCase().indexOf(query) !== -1; });
    }

    if (!container) return;
    container.innerHTML = "";

    list.forEach(function (product, idx) {
        var inStock = product.inStock !== false;
        var card = document.createElement("div");
        card.className = "card" + (inStock ? "" : " out-of-stock");
        var objFit = product.objectFit || "contain";
        card.innerHTML =
            '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy" style="object-fit:' + objFit + '">' +
            '<h3>' + product.name + '</h3>' +
            '<p>Price: ₹' + product.price + '</p>' +
            (inStock ? '' : '<p class="stock-badge">Out of stock</p>') +
            '<div class="qty-box">' +
            '<button class="minus" type="button">−</button>' +
            '<span class="qty">0</span>' +
            '<button class="plus" type="button"' + (inStock ? '' : ' disabled') + '>+</button>' +
            '</div>' +
            '<p class="item-total">Total: ₹0</p>' +
            (inStock ? '<button type="button" class="add-to-cart-btn">Add to Cart</button>' : '');

        var minusBtn = card.querySelector(".minus");
        var plusBtn = card.querySelector(".plus");
        var qtySpan = card.querySelector(".qty");
        var totalText = card.querySelector(".item-total");
        var addBtn = card.querySelector(".add-to-cart-btn");
        var quantity = 0;

        if (orderItems[product.name]) {
            quantity = orderItems[product.name].quantity;
            qtySpan.textContent = quantity;
            totalText.textContent = "Total: ₹" + (quantity * product.price);
        }

        if (!inStock) {
            container.appendChild(card);
            return;
        }

        function saveCart() {
            localStorage.setItem("cartData", JSON.stringify(orderItems));
            localStorage.setItem("cartTotal", String(grandTotal));
            if (grandTotalSpan) grandTotalSpan.textContent = grandTotal;
            updateOrderList();
        }

        plusBtn.addEventListener("click", function () {
            quantity++;
            qtySpan.textContent = quantity;
            totalText.textContent = "Total: ₹" + (quantity * product.price);
            grandTotal += product.price;
            if (!orderItems[product.name]) {
                orderItems[product.name] = { quantity: 0, price: product.price, image: product.image };
            }
            orderItems[product.name].quantity = quantity;
            saveCart();
            showToast(product.name + " added to cart");
        });

        minusBtn.addEventListener("click", function () {
            if (quantity <= 0) return;
            quantity--;
            qtySpan.textContent = quantity;
            totalText.textContent = "Total: ₹" + (quantity * product.price);
            grandTotal -= product.price;
            if (orderItems[product.name]) {
                orderItems[product.name].quantity = quantity;
                if (quantity === 0) delete orderItems[product.name];
            }
            saveCart();
        });

        if (addBtn) {
            addBtn.addEventListener("click", function () {
                quantity++;
                qtySpan.textContent = quantity;
                totalText.textContent = "Total: ₹" + (quantity * product.price);
                grandTotal += product.price;
                if (!orderItems[product.name]) {
                    orderItems[product.name] = { quantity: 0, price: product.price, image: product.image };
                }
                orderItems[product.name].quantity = quantity;
                saveCart();
                showToast(product.name + " added to cart");
            });
        }

        container.appendChild(card);
    });
}

buildProductFilterButtons();
renderProducts();
updateOrderList();
updateCartCount();

// Checkout
var checkoutBtn = document.getElementById("checkoutBtn");
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
        if (grandTotal === 0) {
            alert("Your cart is empty");
            return;
        }
        localStorage.setItem("orderData", JSON.stringify(orderItems));
        localStorage.setItem("orderTotal", String(grandTotal));
        window.location.href = "payment.html";
    });
}

function resetCart() {
    orderItems = {};
    grandTotal = 0;
    if (grandTotalSpan) grandTotalSpan.textContent = "0";
    if (orderList) orderList.innerHTML = "";
    localStorage.removeItem("cartData");
    localStorage.removeItem("cartTotal");
    localStorage.removeItem("orderTotal");
    document.querySelectorAll(".qty").forEach(function (q) { q.textContent = "0"; });
    document.querySelectorAll(".item-total").forEach(function (t) { t.textContent = "Total: ₹0"; });
    updateCartCount();
    if (window.updateCartPanel) window.updateCartPanel();
}

var clearCartBtn = document.getElementById("clearCartBtn");
if (clearCartBtn) {
    clearCartBtn.addEventListener("click", function () {
        resetCart();
        showToast("Cart cleared");
    });
}

window.resetCart = resetCart;

// Search
if (searchInput) {
    searchInput.addEventListener("input", renderProducts);
}

window.updateCartCount = updateCartCount;
window.updateOrderList = updateOrderList;
