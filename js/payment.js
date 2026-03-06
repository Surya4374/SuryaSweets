(function () {
    var UPI_ID = "7850990344@ptsbi";
    var orderData = JSON.parse(localStorage.getItem("orderData")) || {};
    var total = localStorage.getItem("orderTotal") || localStorage.getItem("cartTotal") || 0;

    var listEl = document.getElementById("paymentOrderList");
    var totalEl = document.getElementById("paymentTotal");
    var upiLink = document.getElementById("upiPayLink");
    var paidBtn = document.getElementById("paidBtn");
    var qrImage = document.getElementById("qrImage");

    if (!orderData || Object.keys(orderData).length === 0) {
        window.location.href = "menu.html";
        return;
    }

    total = parseInt(total, 10) || 0;
    totalEl.textContent = total;

    for (var item in orderData) {
        var li = document.createElement("li");
        var d = orderData[item];
        li.textContent = item + " x " + d.quantity + " = ₹" + (d.quantity * d.price);
        listEl.appendChild(li);
    }

    var upiUrl = "upi://pay?pa=" + encodeURIComponent(UPI_ID) + "&am=" + total + "&tn=SuryaSweets";
    upiLink.href = upiUrl;

    qrImage.onerror = function () {
        this.style.display = "none";
    };

    paidBtn.addEventListener("click", function () {
        var orderId = "ORD" + Math.floor(Math.random() * 100000);
        var now = new Date();
        var dateStr = now.toLocaleString();

        localStorage.setItem("orderId", orderId);
        localStorage.setItem("orderDate", dateStr);

        var history = JSON.parse(localStorage.getItem("ordersHistory")) || [];
        history.push({
            orderId: orderId,
            date: dateStr,
            items: orderData,
            total: total
        });
        localStorage.setItem("ordersHistory", JSON.stringify(history));

        localStorage.removeItem("cartData");
        localStorage.removeItem("cartTotal");
        localStorage.removeItem("orderTotal");

        window.location.href = "order.html";
    });
})();
