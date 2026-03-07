(function () {
    // Enhanced security checks
    function checkSessionTimeout() {
        var loginTime = sessionStorage.getItem("adminLoginTime");
        var sessionTimeout = 30 * 60 * 1000; // 30 minutes
        
        if (!loginTime || (new Date().getTime() - parseInt(loginTime)) > sessionTimeout) {
            sessionStorage.removeItem("adminLoggedIn");
            sessionStorage.removeItem("adminLoginTime");
            window.location.href = "admin.html";
            return false;
        }
        return true;
    }
    
    if (!sessionStorage.getItem("adminLoggedIn") || !checkSessionTimeout()) {
        window.location.href = "admin.html";
        return;
    }

    var store = window.SuryaStore;
    if (!store) return;

    // Update session activity
    function updateSessionActivity() {
        sessionStorage.setItem("adminLoginTime", new Date().getTime());
    }
    
    // Auto-logout on inactivity
    var activityTimer;
    function resetActivityTimer() {
        clearTimeout(activityTimer);
        activityTimer = setTimeout(function() {
            sessionStorage.removeItem("adminLoggedIn");
            sessionStorage.removeItem("adminLoginTime");
            window.location.href = "admin.html";
        }, 30 * 60 * 1000); // 30 minutes
    }
    
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(function(event) {
        document.addEventListener(event, resetActivityTimer, true);
    });
    
    resetActivityTimer();

    document.getElementById("adminLogout").addEventListener("click", function () {
        sessionStorage.removeItem("adminLoggedIn");
        sessionStorage.removeItem("adminLoginTime");
        window.location.href = "admin.html";
    });

    function switchTab(tabId) {
        document.querySelectorAll(".admin-tab").forEach(function (t) {
            t.classList.toggle("active", t.getAttribute("data-tab") === tabId);
        });
        document.querySelectorAll(".admin-panel").forEach(function (p) {
            p.classList.toggle("active", p.id === "tab-" + tabId);
        });
        if (tabId === "products") renderProducts();
        if (tabId === "orders") renderOrders();
        if (tabId === "analytics") renderAnalytics();
    }

    document.querySelectorAll(".admin-tab").forEach(function (btn) {
        btn.addEventListener("click", function () { switchTab(btn.getAttribute("data-tab")); });
    });

    function readFileAsBase64(fileInput, cb) {
        var file = fileInput && fileInput.files && fileInput.files[0];
        if (!file) { cb(""); return; }
        var r = new FileReader();
        r.onload = function () { cb(r.result || ""); };
        r.readAsDataURL(file);
    }

    function setupImgMode(name) {
        var prefix = name === "catImgMode" ? "cat" : "prod";
        var urlEl = document.getElementById(prefix + "Image");
        var fileEl = document.getElementById(prefix + "ImageFile");
        var urlWrap = urlEl ? urlEl.parentElement : null;
        var fileWrap = fileEl ? fileEl.parentElement : null;
        document.querySelectorAll("input[name='" + name + "']").forEach(function (r) {
            r.addEventListener("change", function () {
                var useUrl = this.value === "url";
                if (urlWrap) urlWrap.style.display = useUrl ? "" : "none";
                if (fileWrap) fileWrap.style.display = useUrl ? "none" : "inline-block";
            });
        });
    }
    setupImgMode("catImgMode");
    setupImgMode("prodImgMode");

    function renderCategories() {
        var list = document.getElementById("categoryList");
        var cats = store.getCategories();
        list.innerHTML = "";
        cats.forEach(function (c, i) {
            var li = document.createElement("li");
            li.className = "admin-list-item";
            var imgPreview = c.image && (c.image.indexOf("data:") === 0 || c.image.indexOf("http") === 0 || c.image.indexOf("assets") === 0)
                ? "<img src=\"" + c.image + "\" alt=\"\" class=\"admin-thumb\">" : "";
            li.innerHTML = "<span>" + (c.name || "") + "</span> " + imgPreview +
                " <span class=\"img-path\">" + (c.objectFit || "contain") + "</span> " +
                "<button type=\"button\" class=\"btn-small btn-danger\" data-index=\"" + i + "\">Delete</button>";
            li.querySelector(".btn-danger").addEventListener("click", function () {
                cats.splice(parseInt(this.getAttribute("data-index"), 10), 1);
                store.setCategories(cats);
                renderCategories();
                fillCategorySelect();
            });
            list.appendChild(li);
        });
    }

    document.getElementById("addCategoryBtn").addEventListener("click", function () {
        var name = document.getElementById("catName").value.trim();
        if (!name) { alert("Category name dalo."); return; }
        var useFile = document.querySelector("input[name='catImgMode']:checked").value === "file";
        var image = "";
        if (useFile) {
            var fi = document.getElementById("catImageFile");
            if (!fi.files.length) { alert("Image file choose karo."); return; }
            readFileAsBase64(fi, function (b64) {
                var cats = store.getCategories();
                cats.push({
                    name: name,
                    image: b64 || "assets/placeholder.png",
                    objectFit: document.getElementById("catObjectFit").value || "contain"
                });
                store.setCategories(cats);
                document.getElementById("catName").value = "";
                document.getElementById("catImage").value = "";
                document.getElementById("catImageFile").value = "";
                renderCategories();
                fillCategorySelect();
            });
        } else {
            image = document.getElementById("catImage").value.trim() || "assets/placeholder.png";
            var cats = store.getCategories();
            cats.push({
                name: name,
                image: image,
                objectFit: document.getElementById("catObjectFit").value || "contain"
            });
            store.setCategories(cats);
            document.getElementById("catName").value = "";
            document.getElementById("catImage").value = "";
            renderCategories();
            fillCategorySelect();
        }
    });

    function fillCategorySelect() {
        var sel = document.getElementById("productCategory");
        var cats = store.getCategories();
        sel.innerHTML = "";
        cats.forEach(function (c) {
            var opt = document.createElement("option");
            opt.value = c.name;
            opt.textContent = c.name;
            sel.appendChild(opt);
        });
        if (cats.length) renderProducts();
    }

    function renderProducts() {
        var list = document.getElementById("productList");
        var cat = document.getElementById("productCategory").value;
        var prods = store.getProducts();
        list.innerHTML = "";
        if (!cat || !prods[cat]) return;
        (prods[cat] || []).forEach(function (p, i) {
            var li = document.createElement("li");
            li.className = "admin-list-item product-item";
            var imgPreview = p.image ? "<img src=\"" + p.image + "\" alt=\"\" class=\"admin-thumb\">" : "";
            li.innerHTML = "<span><strong>" + (p.name || "") + "</strong> ₹" + (p.price || 0) + "</span> " + imgPreview +
                "<span class=\"stock-tag " + (p.inStock ? "in" : "out") + "\">" + (p.inStock ? "In stock" : "Out") + "</span> " +
                "<button type=\"button\" class=\"btn-small toggle-stock\" data-cat=\"" + cat + "\" data-index=\"" + i + "\">Toggle stock</button> " +
                "<button type=\"button\" class=\"btn-small btn-danger del-product\" data-cat=\"" + cat + "\" data-index=\"" + i + "\">Delete</button>";
            li.querySelector(".toggle-stock").addEventListener("click", function () {
                prods[cat][i].inStock = !prods[cat][i].inStock;
                store.setProducts(prods);
                renderProducts();
            });
            li.querySelector(".del-product").addEventListener("click", function () {
                prods[cat].splice(parseInt(this.getAttribute("data-index"), 10), 1);
                store.setProducts(prods);
                renderProducts();
            });
            list.appendChild(li);
        });
    }

    document.getElementById("addProductBtn").addEventListener("click", function () {
        var cat = document.getElementById("productCategory").value;
        var name = document.getElementById("prodName").value.trim();
        var price = parseInt(document.getElementById("prodPrice").value, 10) || 0;
        var inStock = document.getElementById("prodInStock").checked;
        var objectFit = document.getElementById("prodObjectFit").value || "contain";
        if (!cat) { alert("Pehle category select karo."); return; }
        if (!name) { alert("Product name dalo."); return; }
        var useFile = document.querySelector("input[name='prodImgMode']:checked").value === "file";
        function addProd(img) {
            var prods = store.getProducts();
            if (!prods[cat]) prods[cat] = [];
            prods[cat].push({ name: name, price: price, image: img || "assets/placeholder.png", inStock: inStock, objectFit: objectFit });
            store.setProducts(prods);
            document.getElementById("prodName").value = "";
            document.getElementById("prodPrice").value = "";
            document.getElementById("prodImage").value = "";
            document.getElementById("prodImageFile").value = "";
            renderProducts();
        }
        if (useFile) {
            var fi = document.getElementById("prodImageFile");
            if (!fi.files.length) { alert("Image file choose karo ya URL select karo."); return; }
            readFileAsBase64(fi, function (b64) { addProd(b64 || "assets/placeholder.png"); });
        } else {
            addProd(document.getElementById("prodImage").value.trim() || "assets/placeholder.png");
        }
    });

    document.getElementById("productCategory").addEventListener("change", renderProducts);

    function renderOrders() {
        var tbody = document.getElementById("ordersTableBody");
        var orders = store.getOrdersHistory();
        var analytics = store.getSalesAnalytics();
        
        // Update analytics summary
        document.getElementById("todayOrdersCount").textContent = analytics.todayOrders;
        document.getElementById("todayRevenue").textContent = "₹" + analytics.todayRevenue;
        document.getElementById("totalOrdersCount").textContent = analytics.totalOrders;
        document.getElementById("totalRevenue").textContent = "₹" + analytics.totalRevenue;
        
        tbody.innerHTML = "";
        orders.slice().reverse().forEach(function (o) {
            var tr = document.createElement("tr");
            var itemsStr = "";
            for (var it in o.items) {
                var d = o.items[it];
                itemsStr += it + " x " + d.quantity + "; ";
            }
            tr.innerHTML = "<td>" + (o.orderId || "—") + "</td><td>" + (o.date || "—") + "</td><td>" + itemsStr + "</td><td>₹" + (o.total || 0) + "</td><td>" + (o.paymentMethod || "UPI") + "</td><td>" + (o.transactionId || "—") + "</td>";
            tbody.appendChild(tr);
        });
    }

    function renderAnalytics() {
        var analytics = store.getSalesAnalytics();
        
        // Render top products
        var topProductsList = document.getElementById("topProductsList");
        topProductsList.innerHTML = "";
        
        var sortedProducts = Object.entries(analytics.topProducts)
            .sort(function(a, b) { return b[1] - a[1]; })
            .slice(0, 10);
            
        sortedProducts.forEach(function(product) {
            var li = document.createElement("li");
            li.innerHTML = "<strong>" + product[0] + "</strong>: " + product[1] + " units sold";
            topProductsList.appendChild(li);
        });
        
        // Render category sales
        var categorySalesList = document.getElementById("categorySalesList");
        categorySalesList.innerHTML = "";
        
        var sortedCategories = Object.entries(analytics.categorySales)
            .sort(function(a, b) { return b[1] - a[1]; });
            
        sortedCategories.forEach(function(category) {
            var li = document.createElement("li");
            li.innerHTML = "<strong>" + category[0] + "</strong>: ₹" + category[1];
            categorySalesList.appendChild(li);
        });
    }

    // Export orders functionality
    document.getElementById("exportOrdersBtn").addEventListener("click", function() {
        var orders = store.getOrdersHistory();
        var csvContent = "Order ID,Date,Items,Total,Payment Method,Transaction ID\n";
        
        orders.forEach(function(order) {
            var itemsStr = "";
            for (var item in order.items) {
                itemsStr += item + " x " + order.items[item].quantity + "; ";
            }
            csvContent += order.orderId + "," + order.date + ',"' + itemsStr + '",' + order.total + "," + order.paymentMethod + "," + (order.transactionId || "") + "\n";
        });
        
        var blob = new Blob([csvContent], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'orders_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });

    // Clear orders functionality
    document.getElementById("clearOrdersBtn").addEventListener("click", function() {
        if (confirm("Are you sure you want to clear all order history? This action cannot be undone.")) {
            localStorage.removeItem("ordersHistory");
            renderOrders();
            renderAnalytics();
            alert("Order history cleared successfully.");
        }
    });

    fillCategorySelect();
    renderCategories();
    renderOrders();
})();
