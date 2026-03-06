(function () {
    if (window.SuryaStore && localStorage.getItem("adminUsername") === null) {
        SuryaStore.setAdminCredentials("Surya", "4374");
    }

    var form = document.getElementById("adminLoginForm");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var user = document.getElementById("adminUser").value.trim();
            var pass = document.getElementById("adminPass").value;
            if (window.SuryaStore && SuryaStore.checkAdmin(user, pass)) {
                sessionStorage.setItem("adminLoggedIn", "1");
                window.location.href = "admin-dashboard.html";
            } else {
                alert("Wrong username or password.");
            }
        });
    }
})();
