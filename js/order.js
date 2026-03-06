var orderIdSpan = document.getElementById("orderId");
var orderDateSpan = document.getElementById("orderDate");
var finalOrderList = document.getElementById("finalOrderList");
var finalTotal = document.getElementById("finalTotal");

var savedOrder = JSON.parse(localStorage.getItem("orderData")) || {};
var savedTotal = localStorage.getItem("orderTotal") || localStorage.getItem("cartTotal") || "0";
var savedOrderId = localStorage.getItem("orderId");
var savedOrderDate = localStorage.getItem("orderDate");

if (!savedOrder || Object.keys(savedOrder).length === 0) {
    if (finalTotal) finalTotal.innerText = "0";
    if (orderIdSpan) orderIdSpan.innerText = "—";
    if (orderDateSpan) orderDateSpan.innerText = "—";
} else {
    for (var item in savedOrder) {
        var li = document.createElement("li");
        var qty = savedOrder[item].quantity;
        var price = savedOrder[item].price;
        li.innerText = item + " x " + qty + " = ₹" + (qty * price);
        finalOrderList.appendChild(li);
    }
    if (finalTotal) finalTotal.innerText = savedTotal;
    if (orderIdSpan) orderIdSpan.innerText = savedOrderId || "—";
    if (orderDateSpan) orderDateSpan.innerText = savedOrderDate || "—";
}