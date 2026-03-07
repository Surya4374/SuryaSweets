/**
 * Global Error Handler for Surya Sweets Kiosk
 * Provides user-friendly error messages and logging
 */
window.SuryaErrorHandler = (function() {
    
    function showError(message, title, duration) {
        title = title || "Error";
        duration = duration || 5000;
        
        // Remove any existing error messages
        removeErrorMessages();
        
        var errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <button type="button" class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after duration
        setTimeout(function() {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, duration);
    }
    
    function showSuccess(message, duration) {
        duration = duration || 3000;
        
        var successDiv = document.createElement("div");
        successDiv.className = "success-message";
        successDiv.innerHTML = `
            <div class="success-content">
                <p>${message}</p>
                <button type="button" class="success-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(function() {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, duration);
    }
    
    function removeErrorMessages() {
        var errors = document.querySelectorAll('.error-message, .success-message');
        errors.forEach(function(error) {
            error.remove();
        });
    }
    
    function handleApiError(error, context) {
        console.error('API Error in ' + context + ':', error);
        
        var userMessage = "Something went wrong. Please try again.";
        
        if (error.message) {
            if (error.message.includes('network') || error.message.includes('fetch')) {
                userMessage = "Network error. Please check your connection and try again.";
            } else if (error.message.includes('parse')) {
                userMessage = "Data error. Please refresh and try again.";
            }
        }
        
        showError(userMessage, "Connection Error");
    }
    
    function handleValidationError(field, message) {
        var fieldElement = document.getElementById(field);
        if (fieldElement) {
            fieldElement.classList.add('error-field');
            
            // Remove error class on input
            fieldElement.addEventListener('input', function() {
                this.classList.remove('error-field');
            }, { once: true });
            
            // Show error message
            var errorDiv = document.createElement("div");
            errorDiv.className = "field-error";
            errorDiv.textContent = message;
            
            var existingError = fieldElement.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
            
            fieldElement.parentNode.appendChild(errorDiv);
            
            setTimeout(function() {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        }
    }
    
    function logError(error, context) {
        var errorData = {
            timestamp: new Date().toISOString(),
            context: context || 'Unknown',
            message: error.message || 'Unknown error',
            stack: error.stack || '',
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Store error logs in localStorage (keep last 50 errors)
        var errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
        errorLogs.push(errorData);
        
        if (errorLogs.length > 50) {
            errorLogs = errorLogs.slice(-50);
        }
        
        localStorage.setItem('errorLogs', JSON.stringify(errorLogs));
        console.error('Logged error:', errorData);
    }
    
    // Global error handler
    window.addEventListener('error', function(event) {
        logError(event.error, 'Global JavaScript Error');
        showError("An unexpected error occurred. The page has been refreshed.", "System Error", 5000);
        
        // Refresh page after critical errors
        setTimeout(function() {
            location.reload();
        }, 5000);
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        logError(event.reason, 'Unhandled Promise Rejection');
        showError("An operation failed. Please try again.", "Operation Failed");
    });
    
    return {
        showError: showError,
        showSuccess: showSuccess,
        removeErrorMessages: removeErrorMessages,
        handleApiError: handleApiError,
        handleValidationError: handleValidationError,
        logError: logError
    };
})();
