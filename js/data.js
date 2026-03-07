window.SuryaStore = (function () {
    var CATEGORIES_KEY = "storeCategories";
    var PRODUCTS_KEY = "storeProducts";
    var ADMIN_USER = "adminUsername";
    var ADMIN_PASS = "adminPassword";
    var ORDERS_KEY = "ordersHistory";
    var SETTINGS_KEY = "storeSettings";

    var defaultCategories = [
        { name: "Sweets", image: "assets/sweets.png", objectFit: "contain" },
        { name: "Chocolate", image: "assets/chocolates.png", objectFit: "contain" },
        { name: "Ice Cream", image: "assets/iceCreams.png", objectFit: "contain" },
        { name: "Cold Drinks", image: "assets/cocaCola.png", objectFit: "contain" },
        { name: "Snacks", image: "assets/samosa.png", objectFit: "contain" }
    ];

    var defaultProducts = {
        "Sweets": [
            { name: "Kaju Katli", price: 520, image: "assets/kajuKatli.png", inStock: true, unit: "/kg" },
            { name: "Gulab Jamun", price: 320, image: "assets/gulabJamun.png", inStock: true, unit: "/kg" },
            { name: "Rasgulla", price: 300, image: "assets/rasgulla.png", inStock: true, unit: "/kg" },
            { name: "Motichoor Laddu", price: 340, image: "assets/motichoor.png", inStock: true, unit: "/kg" }
        ],
        "Chocolate": [
            { name: "Dairy Milk", price: 80, image: "assets/dairyMilk.png", inStock: true },
            { name: "KitKat", price: 40, image: "assets/kitkat.png", inStock: true },
            { name: "Ferrero Rocher", price: 499, image: "assets/ferrero.png", inStock: true },
            { name: "Five Star", price: 30, image: "assets/fivestar.png", inStock: true }
        ],
        "Ice Cream": [
            { name: "Vanilla Cup", price: 60, image: "assets/vanillaCup.png", inStock: true },
            { name: "Chocolate Cone", price: 80, image: "assets/chocolateCone.png", inStock: true },
            { name: "Butterscotch Cup", price: 70, image: "assets/butterscotch.png", inStock: true },
            { name: "Family Pack", price: 280, image: "assets/familyPack.png", inStock: true }
        ],
        "Cold Drinks": [
            { name: "Coca Cola", price: 40, image: "assets/cocaCola.png", inStock: true },
            { name: "Pepsi", price: 40, image: "assets/pepsi.png", inStock: true },
            { name: "Sprite", price: 40, image: "assets/sprite.png", inStock: true },
            { name: "Fanta", price: 40, image: "assets/fanta.png", inStock: true }
        ],
        "Snacks": [
            { name: "Samosa", price: 20, image: "assets/samosa.png", inStock: true },
            { name: "Kachori", price: 25, image: "assets/kachori.png", inStock: true },
            { name: "Aloo Patties", price: 30, image: "assets/alooPatties.png", inStock: true },
            { name: "Veg Sandwich", price: 60, image: "assets/vegSandwich.png", inStock: true }
        ]
    };

    var defaultSettings = {
        storeName: "Surya Sweets",
        storeAddress: "Beawar, Rajasthan",
        currency: "₹",
        taxRate: 0,
        phone: "",
        email: "",
        autoLogout: 30
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
        var saved = localStorage.getItem(ORDERS_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [];
    }

    function saveOrder(orderData) {
        var orders = getOrdersHistory();
        orders.push(orderData);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
        return orderData;
    }

    function getSettings() {
        var saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return defaultSettings;
    }

    function saveSettings(settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function getSalesAnalytics() {
        var orders = getOrdersHistory();
        var analytics = {
            totalOrders: orders.length,
            totalRevenue: 0,
            todayOrders: 0,
            todayRevenue: 0,
            topProducts: {},
            categorySales: {}
        };

        var today = new Date().toDateString();
        
        orders.forEach(function(order) {
            var orderDate = new Date(order.timestamp).toDateString();
            analytics.totalRevenue += order.total || 0;
            
            if (orderDate === today) {
                analytics.todayOrders++;
                analytics.todayRevenue += order.total || 0;
            }

            // Product and category analytics
            for (var itemName in order.items) {
                var item = order.items[itemName];
                var quantity = item.quantity || 0;
                
                // Top products
                if (!analytics.topProducts[itemName]) {
                    analytics.topProducts[itemName] = 0;
                }
                analytics.topProducts[itemName] += quantity;
                
                // Category sales (determine category from product name)
                var category = getCategoryForProduct(itemName);
                if (!analytics.categorySales[category]) {
                    analytics.categorySales[category] = 0;
                }
                analytics.categorySales[category] += (item.total || (item.price * quantity));
            }
        });

        return analytics;
    }

    function getCategoryForProduct(productName) {
        var products = getProducts();
        for (var category in products) {
            var found = products[category].find(function(p) {
                return p.name === productName;
            });
            if (found) return category;
        }
        return "Unknown";
    }

    function setAdminCredentials(user, pass) {
        localStorage.setItem(ADMIN_USER, user);
        localStorage.setItem(ADMIN_PASS, pass);
    }

    function checkAdmin(user, pass) {
        var u = localStorage.getItem(ADMIN_USER);
        var p = localStorage.getItem(ADMIN_PASS);
        if (!u) {
            setAdminCredentials("Surya", "4374");
            return user === "Surya" && pass === "4374";
        }
        return u === user && p === pass;
    }

    function clearAllData() {
        localStorage.removeItem(CATEGORIES_KEY);
        localStorage.removeItem(PRODUCTS_KEY);
        localStorage.removeItem(ORDERS_KEY);
        localStorage.removeItem(SETTINGS_KEY);
    }

    return {
        getCategories: getCategories,
        getProducts: getProducts,
        setCategories: setCategories,
        setProducts: setProducts,
        getOrdersHistory: getOrdersHistory,
        saveOrder: saveOrder,
        getSettings: getSettings,
        saveSettings: saveSettings,
        getSalesAnalytics: getSalesAnalytics,
        checkAdmin: checkAdmin,
        setAdminCredentials: setAdminCredentials,
        clearAllData: clearAllData
    };
})();
