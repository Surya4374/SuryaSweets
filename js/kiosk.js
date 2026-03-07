/**
 * Surya Sweets – Kiosk app logic
 * View switching, idle timer, cart (localStorage), payment, receipt, print.
 */
(function () {
    var CART_KEY = "kioskCart";
    var CART_TOTAL_KEY = "kioskCartTotal";
    var IDLE_SEC = 30;

    var views = {
        welcome: document.getElementById("view-welcome"),
        categories: document.getElementById("view-categories"),
        products: document.getElementById("view-products"),
        cart: document.getElementById("view-cart"),
        payment: document.getElementById("view-payment"),
        success: document.getElementById("view-success"),
        receipt: document.getElementById("view-receipt")
    };

    var cart = {};
    var grandTotal = 0;
    var currentCategoryId = null;
    var idleTimer = null;

    function getCart() {
        try {
            var s = localStorage.getItem(CART_KEY);
            return s ? JSON.parse(s) : {};
        } catch (e) { return {}; }
    }

    function getCartTotal() {
        return parseInt(localStorage.getItem(CART_TOTAL_KEY), 10) || 0;
    }

    function saveCart() {
        var total = 0;
        for (var k in cart) total += cart[k].quantity * cart[k].price;
        grandTotal = total;
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        localStorage.setItem(CART_TOTAL_KEY, String(total));
        updateCartCount();
    }

    function updateCartCount() {
        var n = 0;
        for (var k in cart) n += cart[k].quantity;
        document.querySelectorAll(".kiosk-cart-count").forEach(function (el) { el.textContent = n; });
    }

    function showView(id) {
        Object.keys(views).forEach(function (key) {
            var v = views[key];
            if (v) v.classList.toggle("active", v.id === "view-" + id);
        });
        resetIdleTimer();
        if (id === "cart") renderCart();
        if (id === "payment") renderPayment();
        if (id === "receipt") renderReceipt();
    }

    function resetIdleTimer() {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(function () {
            // Clear cart and return to welcome screen
            cart = {};
            grandTotal = 0;
            localStorage.removeItem(CART_KEY);
            localStorage.removeItem(CART_TOTAL_KEY);
            
            // Show inactivity message
            var inactivityMsg = document.createElement("div");
            inactivityMsg.className = "inactivity-message";
            inactivityMsg.innerHTML = `
                <div class="inactivity-content">
                    <h3>Session Expired</h3>
                    <p>You were inactive for too long. Starting fresh...</p>
                </div>
            `;
            document.body.appendChild(inactivityMsg);
            
            // Remove message after 3 seconds and show welcome
            setTimeout(function() {
                if (inactivityMsg.parentNode) {
                    inactivityMsg.parentNode.removeChild(inactivityMsg);
                }
                showView("welcome");
            }, 3000);
        }, IDLE_SEC * 1000);
    }

    function setupIdleListeners() {
        ["click", "touchstart", "keydown"].forEach(function (ev) {
            document.addEventListener(ev, resetIdleTimer, { passive: true });
        });
    }

    // ----- Welcome -----
    document.getElementById("btnStartOrder").addEventListener("click", function () {
        showView("categories");
        renderCategories();
    });

    document.getElementById("btnBackToWelcome").addEventListener("click", function () {
        showView("welcome");
    });

    // ----- Categories -----
    function renderCategories() {
        var grid = document.getElementById("categoryGrid");
        if (!grid) return;
        var list = window.KioskData.getCategories();
        grid.innerHTML = "";
        list.forEach(function (cat) {
            var card = document.createElement("button");
            card.type = "button";
            card.className = "category-card";
            card.innerHTML = '<span class="cat-icon">' + cat.icon + '</span><h3 class="cat-name">' + cat.name + '</h3>';
            card.addEventListener("click", function () {
                currentCategoryId = cat.id;
                document.getElementById("productsCategoryTitle").textContent = cat.name;
                showView("products");
                renderProducts();
            });
            grid.appendChild(card);
        });
    }

    document.getElementById("btnOpenCart").addEventListener("click", function () {
        showView("cart");
    });

    // ----- Products -----
    function renderProducts() {
        var grid = document.getElementById("productsGrid");
        if (!grid || !currentCategoryId) return;
        var list = window.KioskData.getProducts(currentCategoryId);
        grid.innerHTML = "";
        list.forEach(function (p) {
            var qty = (cart[p.name] && cart[p.name].quantity) || 0;
            var card = document.createElement("div");
            card.className = "product-card";
            var priceText = "₹" + p.price + (p.unit || "");
            var imgSrc = p.image || "";
            var placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='140' viewBox='0 0 200 140'%3E%3Crect fill='%23FDF0E8' width='200' height='140'/%3E%3Ctext x='50%25' y='50%25' fill='%237D6B5C' font-size='14' text-anchor='middle' dy='.3em'%3E" + encodeURIComponent(p.name) + "%3C/text%3E%3C/svg%3E";
            card.innerHTML =
                '<img src="' + (imgSrc || placeholder) + '" alt="' + p.name + '" loading="lazy">' +
                '<h3 class="prod-name">' + p.name + '</h3>' +
                '<p class="prod-price">' + priceText + '</p>' +
                '<div class="prod-qty-row">' +
                '<button type="button" class="prod-qty-btn minus">−</button>' +
                '<span class="prod-qty-value">' + qty + '</span>' +
                '<button type="button" class="prod-qty-btn plus">+</button>' +
                '</div>' +
                '<button type="button" class="add-to-cart-btn">Add to Cart</button>';
            var minus = card.querySelector(".minus");
            var plus = card.querySelector(".plus");
            var val = card.querySelector(".prod-qty-value");
            var addBtn = card.querySelector(".add-to-cart-btn");

            function updateQty() {
                val.textContent = qty;
            }

            minus.addEventListener("click", function () {
                if (qty > 0) {
                    qty--;
                    if (!cart[p.name]) cart[p.name] = { quantity: 0, price: p.price, image: p.image };
                    cart[p.name].quantity = qty;
                    if (qty === 0) delete cart[p.name];
                    saveCart();
                    updateQty();
                }
            });

            plus.addEventListener("click", function () {
                qty++;
                if (!cart[p.name]) cart[p.name] = { quantity: 0, price: p.price, image: p.image };
                cart[p.name].quantity = qty;
                saveCart();
                updateQty();
            });

            addBtn.addEventListener("click", function () {
                qty++;
                if (!cart[p.name]) cart[p.name] = { quantity: 0, price: p.price, image: p.image };
                cart[p.name].quantity = qty;
                saveCart();
                updateQty();
            });

            var img = card.querySelector("img");
            if (img && imgSrc) {
                img.onerror = function () { this.src = placeholder; };
            }
            grid.appendChild(card);
        });
        updateCartCount();
    }

    document.getElementById("btnBackToCategories").addEventListener("click", function () {
        showView("categories");
    });

    document.getElementById("btnOpenCartFromProducts").addEventListener("click", function () {
        showView("cart");
    });

    // ----- Cart -----
    function renderCart() {
        cart = getCart();
        grandTotal = getCartTotal();
        var listEl = document.getElementById("cartList");
        var totalEl = document.getElementById("cartGrandTotal");
        if (!listEl) return;
        listEl.innerHTML = "";
        for (var name in cart) {
            var it = cart[name];
            var sub = it.quantity * it.price;
            var li = document.createElement("li");
            li.className = "cart-item";
            li.innerHTML =
                '<div><p class="cart-item-name">' + name + '</p><p class="cart-item-detail">Qty: ' + it.quantity + ' × ₹' + it.price + '</p></div>' +
                '<span class="cart-item-subtotal">₹' + sub + '</span>';
            listEl.appendChild(li);
        }
        if (totalEl) totalEl.textContent = grandTotal;
        updateCartCount();
    }

    document.getElementById("btnCloseCart").addEventListener("click", function () {
        showView("categories");
    });

    document.getElementById("btnClearCart").addEventListener("click", function () {
        cart = {};
        grandTotal = 0;
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(CART_TOTAL_KEY);
        renderCart();
        updateCartCount();
        showView("categories");
    });

    document.getElementById("btnProceedToPayment").addEventListener("click", function () {
        if (grandTotal <= 0) return;
        showView("payment");
    });

    // ----- Payment -----
    function renderPayment() {
        cart = getCart();
        grandTotal = getCartTotal();
        var el = document.getElementById("paymentTotalAmount");
        if (el) el.textContent = grandTotal;
        
        // Reset verification form
        document.getElementById("paymentVerification").style.display = "none";
        document.getElementById("transactionId").value = "";
        
        // Load original QR code properly
        var qrImage = document.getElementById("paymentQRImage");
        if (qrImage) {
            qrImage.onerror = function() {
                console.error("Failed to load scan.jpeg, using fallback");
                this.src = "assets/qr-placeholder.svg";
            };
            // Force reload to ensure proper display
            qrImage.src = "assets/scan.jpeg?t=" + new Date().getTime();
        }
    }

    document.getElementById("btnBackFromPayment").addEventListener("click", function () {
        showView("cart");
    });

    document.getElementById("btnIHavePaid").addEventListener("click", function () {
        // Show payment options
        document.getElementById("paymentVerification").style.display = "block";
    });

    document.getElementById("btnPaymentSuccess").addEventListener("click", function () {
        // Direct payment success without transaction ID
        completePayment("DIRECT_PAYMENT", "Payment completed without transaction ID");
    });

    document.getElementById("btnPaymentWithId").addEventListener("click", function () {
        // Show transaction ID input
        document.getElementById("transactionInputGroup").style.display = "flex";
        document.getElementById("transactionId").focus();
    });

    document.getElementById("btnCancelVerification").addEventListener("click", function () {
        document.getElementById("paymentVerification").style.display = "none";
        document.getElementById("transactionInputGroup").style.display = "none";
        document.getElementById("transactionId").value = "";
    });

    document.getElementById("btnVerifyPayment").addEventListener("click", function () {
        var transactionId = document.getElementById("transactionId").value.trim();
        
        // Generate a realistic transaction ID if user did not provide one
        if (!transactionId) {
            transactionId = generateRealisticTransactionId();
        }
        
        // Validate transaction ID format
        if (!validateTransactionId(transactionId)) {
            alert("Invalid Transaction ID format. Please enter a valid UPI transaction ID.");
            document.getElementById("transactionId").focus();
            return;
        }

        completePayment(transactionId, "Payment verified with transaction ID");
    });

    function generateRealisticTransactionId() {
        // Generate realistic UPI transaction ID based on current time
        var timestamp = new Date().getTime();
        var randomSuffix = Math.floor(Math.random() * 10000);
        return "UPI" + timestamp + randomSuffix;
    }

    function validateTransactionId(transactionId) {
        // Basic validation for UPI transaction ID
        if (transactionId.length < 8) return false;
        if (transactionId.length > 50) return false;
        if (!/^[A-Za-z0-9]+$/.test(transactionId)) return false;
        return true;
    }

    function completePayment(transactionId, method) {
        // Generate unique order ID with timestamp
        var timestamp = new Date().getTime();
        var randomSuffix = Math.floor(Math.random() * 1000);
        var orderId = "ORD" + timestamp + randomSuffix;
        
        // Save order to history with transaction ID
        var orderData = {
            orderId: orderId,
            date: new Date().toLocaleString("en-IN"),
            items: cart,
            total: grandTotal,
            paymentMethod: "UPI",
            paymentStatus: "Paid",
            transactionId: transactionId,
            paymentMethodDetail: method,
            timestamp: timestamp
        };
        
        // Save to localStorage for admin tracking
        var ordersHistory = JSON.parse(localStorage.getItem("ordersHistory") || "[]");
        ordersHistory.push(orderData);
        localStorage.setItem("ordersHistory", JSON.stringify(ordersHistory));
        
        // Hide verification form
        document.getElementById("paymentVerification").style.display = "none";
        document.getElementById("transactionInputGroup").style.display = "none";
        document.getElementById("transactionId").value = "";
        
        // Show success and proceed to receipt
        showView("success");
        setTimeout(function () {
            showView("receipt");
        }, 2000);
    }

    // ----- Receipt -----
    var lastOrderId = null;
    var lastOrderDate = null;

    function renderReceipt() {
        cart = getCart();
        grandTotal = getCartTotal();
        
        // Get the most recent order from history
        var ordersHistory = JSON.parse(localStorage.getItem("ordersHistory") || "[]");
        var latestOrder = ordersHistory[ordersHistory.length - 1];
        
        if (latestOrder) {
            lastOrderId = latestOrder.orderId;
            lastOrderDate = latestOrder.date;
            var transactionId = latestOrder.transactionId || "N/A";
        } else {
            // Fallback to random ID if no history found
            lastOrderId = "ORD" + Math.floor(Math.random() * 100000);
            lastOrderDate = new Date().toLocaleString("en-IN");
            var transactionId = "N/A";
        }
        
        document.getElementById("receiptOrderNo").textContent = lastOrderId;
        document.getElementById("receiptDateTime").textContent = lastOrderDate;
        document.getElementById("receiptTransactionId").textContent = transactionId;
        document.getElementById("receiptTotal").textContent = grandTotal;
        var ul = document.getElementById("receiptItems");
        ul.innerHTML = "";
        for (var name in cart) {
            var it = cart[name];
            var li = document.createElement("li");
            li.textContent = name + " x " + it.quantity + " — ₹" + (it.quantity * it.price);
            ul.appendChild(li);
        }
        cart = {};
        grandTotal = 0;
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(CART_TOTAL_KEY);
        updateCartCount();
    }

    document.getElementById("btnPrintBill").addEventListener("click", function () {
        window.print();
    });

    document.getElementById("btnNewOrder").addEventListener("click", function () {
        showView("welcome");
    });

    // ----- Init -----
    cart = getCart();
    grandTotal = getCartTotal();
    updateCartCount();
    setupIdleListeners();
    resetIdleTimer();
})();
