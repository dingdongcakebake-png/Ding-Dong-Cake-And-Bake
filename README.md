# 🎂 dingdongcakebake - MERN Stack Bakery Website

A full-featured, modern bakery website built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features include online ordering, payment processing, admin management, and automated notifications.

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog**: Browse cakes, pastries, cookies, breads, and desserts
- **Smart Filtering**: Filter by category, price range, and search functionality
- **Shopping Cart**: Persistent cart with quantity management
- **Stepper Checkout**: Multi-step checkout process with validation
- **Order Tracking**: Track orders by email address
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **Dark/Light Theme**: Toggle between themes with persistent settings

### 🏪 Business Features
- **Cash on Delivery**: Only payment method (as requested)
- **Dual Delivery**: Home delivery and self-pickup options
- **Email Notifications**: Automated order confirmations and updates
- **WhatsApp Integration**: Order notifications via Twilio
- **Admin Dashboard**: Hidden admin panel (accessible only via URL)
- **Order Management**: Full CRUD operations for orders and products
- **Inventory Tracking**: Stock management with low stock alerts

### 🔒 Security & UX
- **Error Handling**: User-friendly messages with detailed developer logs
- **Input Validation**: Comprehensive server-side validation
- **Rate Limiting**: API protection against abuse
- **Toast Notifications**: Real-time feedback for all user actions
- **Loading States**: Smooth loading indicators throughout the app

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Gmail account (for emails)
- Twilio account (for WhatsApp - optional)

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
VITE_API_BASE_URL=http://localhost:5000/api
VITE_BRAND_NAME=dingdongcakebake

# Start development server
npm run dev
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables (see Backend Configuration below)

# Seed sample data (optional)
node scripts/seedData.js

# Start development server
npm run dev
```

## ⚙️ Configuration

### Backend Environment Variables

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/dingdongcakebake

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=dingdongcakebake@gmail.com
EMAIL_PASS=your-gmail-app-password

# Twilio (WhatsApp) - Optional
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_NUMBER=+14155238886

# Admin Configuration
ADMIN_EMAIL=dingdongcakebake@gmail.com
ADMIN_DASHBOARD_URL=http://localhost:3000/admin/dashboard

# Store Information
PICKUP_ADDRESS=dingdongcakebake, 12 Main Road, Ooty – 643006
PICKUP_TIME=10 AM – 9 PM

# Client Configuration
CLIENT_URL=http://localhost:3000
```

### Gmail Setup for Emails

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings → Security
   - Under "2-Step Verification", click "App passwords"
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

### WhatsApp Setup (Optional)

1. **Create Twilio Account** at [twilio.com](https://twilio.com)
2. **Get Credentials**:
   - Account SID and Auth Token from Console
3. **WhatsApp Sandbox**:
   - Go to Console → Messaging → Try WhatsApp
   - Follow sandbox setup instructions
   - Use sandbox number for `TWILIO_WHATSAPP_NUMBER`

## 🏗️ Project Structure

```
dingdongcakebake/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   │   ├── Layout/              # Header, Footer, Layout
│   │   └── UI/                  # Buttons, Cards, etc.
│   ├── pages/                   # Page components
│   │   ├── Admin/              # Admin dashboard pages
│   │   ├── Home.jsx            # Homepage
│   │   ├── Products.jsx        # Product catalog
│   │   ├── Cart.jsx           # Shopping cart
│   │   ├── Checkout.jsx       # Checkout process
│   │   └── Orders.jsx         # Order tracking
│   ├── store/                  # Redux store
│   │   └── slices/            # Redux slices
│   ├── services/              # API services
│   └── context/               # React context (Theme)
├── backend/                    # Express.js API server
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── middleware/            # Custom middleware
│   ├── services/              # Email & WhatsApp services
│   └── scripts/              # Database seeding scripts
└── README.md                  # This file
```

## 🔐 Admin Access

The admin dashboard is **intentionally hidden** from the main navigation for security.

### Access Methods:
1. **Direct URL**: Navigate to `/admin` manually
2. **Demo Credentials**: Password is `admin123`
3. **Admin Panel**: Full CRUD operations for products and orders

### Admin Features:
- **Product Management**: Add, edit, delete products
- **Order Management**: View all orders, update status
- **Dashboard Analytics**: Revenue, order statistics
- **Status Updates**: Automatic email/WhatsApp notifications

## 📱 User Experience

### Customer Journey:
1. **Browse Products** → Filter by category/price
2. **Add to Cart** → Persistent cart across sessions  
3. **Checkout Process** → 4-step validation process
4. **Order Confirmation** → Email + WhatsApp notification
5. **Order Tracking** → Track by email address

### Error Handling:
- **User-Facing**: Clean, actionable error messages
- **Developer**: Detailed console logging with stack traces
- **Network Issues**: Graceful handling with retry options
- **Validation**: Real-time form validation feedback

## 🛠️ API Endpoints

### Products
- `GET /api/products` - Get filtered products
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get single product

### Orders  
- `POST /api/orders` - Create new order
- `GET /api/orders/user/:email` - Get orders by email
- `GET /api/orders/:id` - Get single order

### Admin
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

## 🎨 Design Features

### Visual Design:
- **Luxury Aesthetic**: Warm colors (golden, cream, brown)
- **Modern UI**: Clean cards, smooth animations, micro-interactions
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark/Light Theme**: System preference detection + manual toggle
- **Typography**: Readable fonts with proper hierarchy

### UX Features:
- **Loading States**: Skeleton screens and spinners
- **Toast Notifications**: Success, error, and info messages
- **Progressive Disclosure**: Hide complexity until needed
- **Accessibility**: Focus states, ARIA labels, keyboard navigation

## 📦 Deployment

### Frontend (Vite Build)
```bash
npm run build
# Deploy 'dist' folder to your hosting provider
```

### Backend (Node.js)
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start server.js --name "dingdongcakebake-api"
pm2 save && pm2 startup

# Or regular Node.js
npm start
```

### Environment Variables for Production:
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dingdongcakebake
CLIENT_URL=https://yourdomain.com
```

## 🤝 Contributing

1. **Code Style**: Follow existing patterns and structure
2. **Error Handling**: Always include proper error handling
3. **Validation**: Add input validation for new features
4. **Testing**: Test all functionality before submitting
5. **Documentation**: Update README for new features

## 📞 Support

For technical support or questions:
- **Email**: dingdongcakebake@gmail.com
- **Issues**: Create GitHub issue with detailed description

## 📄 License

This project is created for educational/portfolio purposes. Feel free to use and modify as needed.

---

**🎂 Made with love for cake lovers everywhere!**