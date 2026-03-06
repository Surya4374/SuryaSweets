document.addEventListener("DOMContentLoaded", function () {
var categories = window.SuryaStore ? SuryaStore.getCategories() : [
    { name: "Pizza", image: "assets/pizza.png" },
    { name: "Ice Cream", image: "assets/iceCreams.png" },
    { name: "Sweets", image: "assets/sweets.png" },
    { name: "Chocolates", image: "assets/chocolates.png" }
];

var container = document.getElementById("categoryContainer");
if (!container) return;

categories.forEach(function (category) {
    var card = document.createElement("div");
    card.className = "card";

    var objFit = category.objectFit || "contain";
        card.innerHTML = 
        '<img src="' + category.image + '" alt="' + category.name + '" style="object-fit:' + objFit + '">' +
        '<h3>' + category.name + '</h3>';

    card.addEventListener("click", function () {
        localStorage.setItem("selectedCategory", category.name);
        window.location.href = "menu.html";
    });
    container.appendChild(card);
});

var cartCount = document.getElementById("cartCount");
if (cartCount) {
    var cartData = JSON.parse(localStorage.getItem("cartData")) || {};
    var totalItems = 0;
    for (var item in cartData) {
        totalItems += cartData[item].quantity;
    }
    cartCount.textContent = totalItems;
}

});
