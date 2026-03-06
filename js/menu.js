
let orderItems = JSON.parse(localStorage.getItem("cartData")) || {};
let grandTotal = parseInt(localStorage.getItem("cartTotal")) || 0;

const grandTotalSpan = document.getElementById("grandTotal");
grandTotalSpan.innerText = grandTotal;


const selectedCategory = localStorage.getItem("selectedCategory");
if (!selectedCategory) {
    window.location.href = "index.html";
    throw new Error("redirect");
}
document.getElementById("categoryTitle").innerText = selectedCategory;

var prducts = window.SuryaStore ? SuryaStore.getProducts() : {
    Pizza: [
        { name: "Italian Pizza", price: 299, image: "assets/italianPizza.png", inStock: true },
        { name: "Farmhouse Pizza", price: 349, image: "assets/farmhousePizza.png", inStock: true }
    ],
    "Ice Cream": [{ name: "Vanilla Ice Cream", price: 99, image: "assets/vanilaIceCream.png", inStock: true }],
    Sweets: [{ name: "Kaju Katli", price: 499, image: "assets/kajuKatli.png", inStock: true }],
    Chocolates: [{ name: "Dark Chocolate", price: 199, image: "assets/darkChocolate.png", inStock: true }]
};

var container = document.getElementById("productContainer");

const orderList = document.getElementById("orderList");

if (prducts[selectedCategory]) {
    prducts[selectedCategory].forEach(function (product) {
        var inStock = product.inStock !== false;
        var card = document.createElement("div");
        card.classList.add("card");
        if (!inStock) card.classList.add("out-of-stock");

        var objFit = product.objectFit || "contain";
        card.innerHTML =
            '<img src="' + product.image + '" alt="' + product.name + '" style="object-fit:' + objFit + '">' +
            '<h3>' + product.name + '</h3>' +
            '<p>Price: ₹' + product.price + '</p>' +
            (inStock ? '' : '<p class="stock-badge">Out of stock</p>') +
            '<div class="qty-box">' +
            '<button class="minus" type="button">-</button>' +
            '<span class="qty">0</span>' +
            '<button class="plus" type="button"' + (inStock ? '' : ' disabled') + '>+</button>' +
            '</div>' +
            '<p class="item-total">Total: ₹0</p>';

        var minusBtn = card.querySelector(".minus");
        var plusBtn = card.querySelector(".plus");
        var qtySpan = card.querySelector(".qty");
        var totalText = card.querySelector(".item-total");
        var quantity = 0;

        if (orderItems[product.name]) {
            quantity = orderItems[product.name].quantity;
            qtySpan.innerText = quantity;
            var totalPrice = quantity * product.price;
            totalText.innerText = "Total: ₹" + totalPrice;
        }

        if (!inStock) {
            plusBtn.disabled = true;
            container.appendChild(card);
            return;
        }

        plusBtn.addEventListener("click", function () {
    quantity++;
    qtySpan.innerText = quantity;
    
    const totalPrice = quantity * product.price;
    totalText.innerText = "Total: ₹" + totalPrice;
    grandTotal += product.price;
    grandTotalSpan.innerText = grandTotal;

    if (!orderItems[product.name]) {
        orderItems[product.name] = {quantity: 0, price: product.price};
    };
    orderItems[product.name].quantity++;
    localStorage.setItem("cartData", JSON.stringify(orderItems));
    localStorage.setItem("cartTotal", grandTotal);
    updateOrderList();
        });

        minusBtn.addEventListener("click", function () {
    if (quantity > 0) {
        quantity--;
        qtySpan.innerText = quantity;

        const itemTotal = quantity * product.price;
        totalText.innerText = "Total: ₹" + itemTotal;
        
        grandTotal -= product.price;
        grandTotalSpan.innerText = grandTotal;

        if (orderItems[product.name]) {
            orderItems[product.name].quantity--;

            if (orderItems[product.name].quantity === 0) {
                delete orderItems[product.name];
            }
        }
        localStorage.setItem("cartData", JSON.stringify(orderItems));
    localStorage.setItem("cartTotal", grandTotal);
            updateOrderList();
    }
        });
        container.appendChild(card);
    });
}

function updateCartCount() {
    let count = 0;
    for (let item in orderItems) count += orderItems[item].quantity;
    const cartEl = document.getElementById("cartCount");
    if (cartEl) cartEl.innerText = count;
}

function updateOrderList() {
    orderList.innerHTML = "";
    for (let item in orderItems) {
        const li = document.createElement("li");
        const qty = orderItems[item].quantity;
        const price = orderItems[item].price;
        li.innerText = `${item} x ${qty} - ₹${qty * price}`;
        orderList.appendChild(li);
    }
    updateCartCount();
}
updateOrderList();
updateCartCount();
const checkoutBtn = document.getElementById("checkoutBtn")

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (grandTotal === 0) {
            alert("Your cart is empty");
            return;
        }

        localStorage.setItem("orderData", JSON.stringify(orderItems));
        localStorage.setItem("orderTotal", grandTotal);

        window.location.href = "payment.html";
    });
}

const clearCartBtn = document.getElementById("clearCartBtn");

if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
        orderItems = {};
        grandTotal = 0;

        grandTotalSpan.innerText = 0;
        orderList.innerHTML = "";

        localStorage.removeItem("cartData");
        localStorage.removeItem("cartTotal");
        localStorage.removeItem("orderTotal");

        document.querySelectorAll(".qty").forEach(q => q.innerText = 0);
        document.querySelectorAll(".item-total").forEach(t => t.innerText = "Total: ₹0");

        updateCartCount();
        alert("Cart cleared successfully");
    });
}