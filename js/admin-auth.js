(function () {
    if (window.SuryaStore && localStorage.getItem("adminUsername") === null) {
        SuryaStore.setAdminCredentials("Surya", "4374");
    }

    var form = document.getElementById("adminLoginForm");
    var loginAttempts = 0;
    var maxAttempts = 3;
    var lockoutTime = 15 * 60 * 1000; // 15 minutes
    
    if (form) {
        // Check if account is locked
        function isAccountLocked() {
            var lockUntil = localStorage.getItem("adminLockUntil");
            return lockUntil && new Date().getTime() < parseInt(lockUntil);
        }
        
        function updateLoginUI() {
            var lockUntil = localStorage.getItem("adminLockUntil");
            if (isAccountLocked()) {
                var remainingTime = Math.ceil((parseInt(lockUntil) - new Date().getTime()) / 60000);
                form.innerHTML = `
                    <div class="account-locked">
                        <h3>Account Locked</h3>
                        <p>Too many failed login attempts.</p>
                        <p>Please try again in ${remainingTime} minutes.</p>
                        <button type="button" onclick="location.reload()" class="checkout-btn">Refresh</button>
                    </div>
                `;
            }
        }
        
        updateLoginUI();
        
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            
            if (isAccountLocked()) {
                updateLoginUI();
                return;
            }
            
            var user = document.getElementById("adminUser").value.trim();
            var pass = document.getElementById("adminPass").value;
            
            if (window.SuryaStore && SuryaStore.checkAdmin(user, pass)) {
                // Reset login attempts on successful login
                loginAttempts = 0;
                localStorage.removeItem("adminLockUntil");
                sessionStorage.setItem("adminLoggedIn", "1");
                sessionStorage.setItem("adminLoginTime", new Date().getTime());
                window.location.href = "admin-dashboard.html";
            } else {
                loginAttempts++;
                var remainingAttempts = maxAttempts - loginAttempts;
                
                if (loginAttempts >= maxAttempts) {
                    // Lock the account
                    var lockUntil = new Date().getTime() + lockoutTime;
                    localStorage.setItem("adminLockUntil", lockUntil.toString());
                    alert("Account locked due to too many failed attempts. Please try again in 15 minutes.");
                    updateLoginUI();
                } else {
                    alert(`Invalid credentials. ${remainingAttempts} attempts remaining.`);
                    // Clear password field
                    document.getElementById("adminPass").value = "";
                }
            }
        });
    }
})();
