/**
 * Kiosk product data – in-store self-ordering (Beawar, Rajasthan)
 * Categories and products with prices. Images use placeholder paths; replace with real assets.
 */
window.KioskData = (function () {
    var CATEGORIES = [
        { id: "sweets",     name: "Sweets",     icon: "🍬" },
        { id: "chocolate",  name: "Chocolate",  icon: "🍫" },
        { id: "icecream",   name: "Ice Cream",  icon: "🍦" },
        { id: "colddrinks", name: "Cold Drinks", icon: "🥤" },
        { id: "snacks",     name: "Snacks",     icon: "🥟" }
    ];

    var PRODUCTS = {
        sweets: [
            { name: "Kaju Katli",      price: 520, unit: "/kg",  image: "assets/kajuKatli.png" },
            { name: "Gulab Jamun",     price: 320, unit: "/kg",  image: "assets/gulabJamun.png" },
            { name: "Rasgulla",       price: 300, unit: "/kg",  image: "assets/rasgulla.png" },
            { name: "Motichoor Laddu", price: 340, unit: "/kg",  image: "assets/motichoor.png" }
        ],
        chocolate: [
            { name: "Dairy Milk",     price: 80,  unit: "", image: "assets/dairyMilk.png" },
            { name: "KitKat",         price: 40,  unit: "", image: "assets/kitkat.png" },
            { name: "Ferrero Rocher", price: 499, unit: "", image: "assets/ferrero.png" },
            { name: "Five Star",      price: 30,  unit: "", image: "assets/fivestar.png" }
        ],
        icecream: [
            { name: "Vanilla Cup",     price: 60,  unit: "", image: "assets/vanillaCup.png" },
            { name: "Chocolate Cone",  price: 80,  unit: "", image: "assets/chocolateCone.png" },
            { name: "Butterscotch Cup", price: 70, unit: "", image: "assets/butterscotch.png" },
            { name: "Family Pack",     price: 280, unit: "", image: "assets/familyPack.png" }
        ],
        colddrinks: [
            { name: "Coca Cola", price: 40, unit: "", image: "assets/cocaCola.png" },
            { name: "Pepsi",     price: 40, unit: "", image: "assets/pepsi.png" },
            { name: "Sprite",    price: 40, unit: "", image: "assets/sprite.png" },
            { name: "Fanta",    price: 40, unit: "", image: "assets/fanta.png" }
        ],
        snacks: [
            { name: "Samosa",      price: 20, unit: "", image: "assets/samosa.png" },
            { name: "Kachori",    price: 25, unit: "", image: "assets/kachori.png" },
            { name: "Aloo Patties", price: 30, unit: "", image: "assets/alooPatties.png" },
            { name: "Veg Sandwich", price: 60, unit: "", image: "assets/vegSandwich.png" }
        ]
    };

    return {
        getCategories: function () { return CATEGORIES; },
        getProducts: function (categoryId) { return PRODUCTS[categoryId] || []; }
    };
})();
