/**
 * Sliding cart panel: open/close, render items from localStorage, sync with cart count
 */
(function () {
    var overlay = document.getElementById("cartOverlay");
    var panel = document.getElementById("cartPanel");
    var panelBody = document.getElementById("cartPanelBody");
    var panelTotal = document.getElementById("cartPanelTotal");
    var trigger = document.getElementById("cartTrigger");
    var closeBtn = document.getElementById("cartPanelClose");
    var clearBtn = document.getElementById("clearCartPanelBtn");
    var checkoutBtn = document.getElementById("checkoutPanelBtn");

    function getCart() {
        return JSON.parse(localStorage.getItem("cartData")) || {};
    }
    function getTotal() {
        return parseInt(localStorage.getItem("cartTotal"), 10) || 0;
    }

    function renderPanel() {
        var cart = getCart();
        var total = getTotal();
        panelBody.innerHTML = "";
        for (var name in cart) {
            var item = cart[name];
            var imgSrc = item.image || "";
            var row = document.createElement("div");
            row.className = "cart-panel-item";
            row.innerHTML =
                '<img src="' + (imgSrc || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect fill='%23f0f0f0' width='64' height='64'/%3E%3C/svg%3E") + '" alt="">' +
                '<div class="cart-panel-item-details">' +
                '<p class="name">' + name + '</p>' +
                '<p class="qty-price">Qty: ' + item.quantity + ' × ₹' + item.price + ' = ₹' + (item.quantity * item.price) + '</p>' +
                '</div>';
            panelBody.appendChild(row);
        }
        if (Object.keys(cart).length === 0) {
            panelBody.innerHTML = "<p style='text-align:center;color:var(--color-muted);'>Cart is empty.</p>";
        }
        if (panelTotal) panelTotal.textContent = total;
    }

    function openPanel() {
        if (overlay) overlay.classList.add("open");
        if (overlay) overlay.setAttribute("aria-hidden", "false");
        if (panel) panel.setAttribute("aria-hidden", "false");
        renderPanel();
    }
    function closePanel() {
        if (overlay) overlay.classList.remove("open");
        if (overlay) overlay.setAttribute("aria-hidden", "true");
        if (panel) panel.setAttribute("aria-hidden", "true");
    }

    if (trigger) trigger.addEventListener("click", openPanel);
    if (closeBtn) closeBtn.addEventListener("click", closePanel);
    if (overlay) overlay.addEventListener("click", closePanel);

    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            localStorage.removeItem("cartData");
            localStorage.removeItem("cartTotal");
            localStorage.removeItem("orderTotal");
            renderPanel();
            if (window.resetCart) window.resetCart();
            else {
                if (window.updateCartCount) window.updateCartCount();
                if (window.updateOrderList) window.updateOrderList();
            }
            if (window.updateCartPanel) window.updateCartPanel();
        });
    }
    if (checkoutBtn) {
        checkoutBtn.href = "payment.html";
        checkoutBtn.addEventListener("click", function (e) {
            if (getTotal() <= 0) {
                e.preventDefault();
                return;
            }
            closePanel();
        });
    }

    window.updateCartPanel = renderPanel;
})();
