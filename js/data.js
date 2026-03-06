window.SuryaStore = (function () {
    var CATEGORIES_KEY = "storeCategories";
    var PRODUCTS_KEY = "storeProducts";
    var ADMIN_USER = "adminUsername";
    var ADMIN_PASS = "adminPassword";

    var defaultCategories = [
        { name: "Pizza", image: "assets/pizza.png" },
        { name: "Ice Cream", image: "assets/iceCreams.png" },
        { name: "Sweets", image: "assets/sweets.png" },
        { name: "Chocolates", image: "assets/chocolates.png" }
    ];

    var defaultProducts = {
        "Pizza": [
            { name: "Italian Pizza", price: 299, image: "assets/italianPizza.png", inStock: true },
            { name: "Farmhouse Pizza", price: 349, image: "assets/farmhousePizza.png", inStock: true }
        ],
        "Ice Cream": [
            { name: "Vanilla Ice Cream", price: 99, image: "assets/vanilaIceCream.png", inStock: true }
        ],
        "Sweets": [
            { name: "Kaju Katli", price: 499, image: "assets/kajuKatli.png", inStock: true }
        ],
        "Chocolates": [
            { name: "Dark Chocolate", price: 199, image: "assets/darkChocolate.png", inStock: true }
        ]
    };

    function getCategories() {
        var saved = localStorage.getItem(CATEGORIES_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return defaultCategories;
    }

    function getProducts() {
        var saved = localStorage.getItem(PRODUCTS_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return defaultProducts;
    }

    function setCategories(arr) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(arr));
    }

    function setProducts(obj) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(obj));
    }

    function getOrdersHistory() {
        var saved = localStorage.getItem("ordersHistory");
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [];
    }

    function setAdminCredentials(user, pass) {
        localStorage.setItem(ADMIN_USER, user);
        localStorage.setItem(ADMIN_PASS, pass);
    }

    function checkAdmin(user, pass) {
        var u = localStorage.getItem(ADMIN_USER);
        var p = localStorage.getItem(ADMIN_PASS);
        if (!u) {
            setAdminCredentials("admin", "Admin@123");
            return user === "admin" && pass === "Admin@123";
        }
        return u === user && p === pass;
    }

    return {
        getCategories: getCategories,
        getProducts: getProducts,
        setCategories: setCategories,
        setProducts: setProducts,
        getOrdersHistory: getOrdersHistory,
        checkAdmin: checkAdmin,
        setAdminCredentials: setAdminCredentials
    };
})();
