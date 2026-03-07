# Surya Sweets - Self-Order Kiosk System

A professional self-ordering kiosk system for Surya Sweets sweet shop in Beawar, Rajasthan. This system allows customers to browse products, place orders, and make payments independently, while providing comprehensive admin management capabilities.

## Features

### Customer Kiosk
- **Touch-Optimized Interface**: Designed for tablets and touch screens
- **Product Browsing**: Categories and products with images
- **Shopping Cart**: Add/remove items with real-time updates
- **UPI Payment Integration**: QR code scanning with payment verification
- **Digital Receipts**: Automatic receipt generation and printing
- **Session Management**: Auto-timeout and session reset
- **Professional UI**: Modern design with smooth animations

### Admin Dashboard
- **Secure Authentication**: Login with session timeout and lockout protection
- **Product Management**: Add/edit/remove categories and products
- **Stock Management**: Track inventory and stock status
- **Order History**: Complete order tracking with details
- **Sales Analytics**: Real-time analytics and reporting
- **Data Export**: Export order data to CSV
- **Error Logging**: Comprehensive error tracking and handling

## Technical Improvements

### Security Features
- Admin session timeout (30 minutes)
- Account lockout after failed attempts (3 attempts, 15 minute lockout)
- Activity-based session management
- Secure credential storage

### Data Management
- Persistent data storage using localStorage
- Order history tracking with unique IDs
- Sales analytics and reporting
- Data backup and export capabilities

### User Experience
- Professional error handling with user-friendly messages
- Inactivity notifications
- Smooth animations and transitions
- Responsive design for various screen sizes
- Real-time cart updates

### Payment System
- Enhanced payment verification
- Order tracking with timestamps
- Receipt generation with proper formatting
- Payment method tracking

## Installation & Setup

1. **Clone/Download** the project files to your local server
2. **Open** `index.html` in a web browser to start the kiosk
3. **Admin Access**: Navigate to `admin.html` for admin login
   - Default credentials: Username: `Surya`, Password: `4374`

## File Structure

```
SuryaSweets/
├── index.html              # Main kiosk interface
├── admin.html              # Admin login page
├── admin-dashboard.html    # Admin management panel
├── assets/                 # Product images and assets
├── css/
│   ├── kiosk.css          # Kiosk styling
│   └── style.css          # Admin panel styling
├── js/
│   ├── kiosk-data.js      # Product data and categories
│   ├── kiosk.js           # Kiosk functionality
│   ├── data.js            # Admin data management
│   ├── admin-auth.js      # Admin authentication
│   ├── admin-dashboard.js # Admin panel logic
│   └── error-handler.js   # Global error handling
└── README.md              # This file
```

## Usage

### For Customers
1. Touch the screen to start ordering
2. Browse categories (Sweets, Chocolate, Ice Cream, Cold Drinks, Snacks)
3. Select products and adjust quantities
4. Review cart and proceed to payment
5. Scan UPI QR code to complete payment
6. Receive digital receipt

### For Admin Staff
1. Login to admin panel with credentials
2. Manage categories and products
3. Track inventory and stock levels
4. View order history and analytics
5. Export data for reporting
6. Monitor sales performance

## Browser Compatibility

- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge

Works best on modern browsers with JavaScript enabled.

## Security Notes

- Admin credentials should be changed in production
- Regular data backup recommended
- Monitor error logs for issues
- Keep browser updated for security

## Support

For technical support or issues, check the browser console for error messages or contact the development team.

---

**Developed for Surya Sweets, Beawar, Rajasthan**  
*Professional Sweet Shop Management System*
