/**
 * Home page: categories, search, filter buttons, lazy load, cart count
 */
document.addEventListener("DOMContentLoaded", function () {
    var categories = window.SuryaStore ? SuryaStore.getCategories() : [
        { name: "Pizza", image: "assets/pizza.png" },
        { name: "Ice Cream", image: "assets/iceCreams.png" },
        { name: "Sweets", image: "assets/sweets.png" },
        { name: "Chocolates", image: "assets/chocolates.png" }
    ];

    var container = document.getElementById("categoryContainer");
    var searchInput = document.getElementById("searchCategories");
    var filtersContainer = document.getElementById("categoryFilters");
    if (!container) return;

    // Build category filter buttons (All + each category)
    function renderFilterButtons() {
        var allBtn = document.createElement("button");
        allBtn.type = "button";
        allBtn.className = "filter-btn active";
        allBtn.setAttribute("data-category", "");
        allBtn.textContent = "All";
        filtersContainer.innerHTML = "";
        filtersContainer.appendChild(allBtn);
        categories.forEach(function (cat) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "filter-btn";
            btn.setAttribute("data-category", cat.name);
            btn.textContent = cat.name;
            filtersContainer.appendChild(btn);
        });
    }
    renderFilterButtons();

    var currentFilter = "";
    function filterAndRender() {
        var query = (searchInput && searchInput.value) ? searchInput.value.trim().toLowerCase() : "";
        var filtered = categories.filter(function (c) {
            var matchFilter = !currentFilter || c.name === currentFilter;
            var matchSearch = !query || c.name.toLowerCase().indexOf(query) !== -1;
            return matchFilter && matchSearch;
        });
        renderCategoryCards(filtered);
    }

    function renderCategoryCards(list) {
        container.innerHTML = "";
        list.forEach(function (category, i) {
            var card = document.createElement("div");
            card.className = "card";
            var objFit = category.objectFit || "contain";
            card.innerHTML =
                '<img src="' + category.image + '" alt="' + category.name + '" style="object-fit:' + objFit + '" loading="lazy">' +
                '<h3>' + category.name + '</h3>';
            card.style.animationDelay = (i * 0.06) + "s";
            card.addEventListener("click", function () {
                localStorage.setItem("selectedCategory", category.name);
                window.location.href = "menu.html";
            });
            container.appendChild(card);
        });
    }

    // Filter button clicks
    filtersContainer.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter-btn");
        if (!btn) return;
        filtersContainer.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-category") || "";
        filterAndRender();
    });

    // Search input
    if (searchInput) {
        searchInput.addEventListener("input", filterAndRender);
    }

    // Initial render
    filterAndRender();

    // Cart count from localStorage
    function updateCartCount() {
        var cartCount = document.getElementById("cartCount");
        if (!cartCount) return;
        var cartData = JSON.parse(localStorage.getItem("cartData")) || {};
        var total = 0;
        for (var key in cartData) total += cartData[key].quantity;
        cartCount.textContent = total;
    }
    updateCartCount();
});
