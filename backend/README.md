# dingdongcakebake Backend API

MERN stack bakery website backend with comprehensive order management and notification system.

## Features

- 🍰 Product management (CRUD operations)
- 📋 Order processing with email/WhatsApp notifications
- 👨‍💼 Admin dashboard with full control
- 📧 Automated email confirmations
- 📱 WhatsApp notifications via Twilio
- 🔒 Secure error handling
- 📊 Analytics and reporting
- 🛡️ Input validation and sanitization

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Nodemailer** - Email service
- **Twilio** - WhatsApp notifications
- **JWT** - Authentication
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting

## Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure Environment Variables**
   Edit `.env` file with your configurations:
   
   ```env
   # MongoDB Connection
   MONGO_URI=mongodb://localhost:27017/dingdongcakebake
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=dingdongcakebake@gmail.com
   EMAIL_PASS=your-gmail-app-password
   
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_WHATSAPP_NUMBER=+14155238886
   
   # Admin Configuration
   ADMIN_EMAIL=dingdongcakebake@gmail.com
   
   # Store Information
   PICKUP_ADDRESS=dingdongcakebake, 12 Main Road, Ooty – 643006
   PICKUP_TIME=10 AM – 9 PM
   
   # Client URL
   CLIENT_URL=http://localhost:3000
   ```

5. **Seed Sample Data (Optional)**
   ```bash
   node scripts/seedData.js
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Start Production Server**
   ```bash
   npm start
   ```

## API Endpoints

### Products

- `GET /api/products` - Get all active products (with filtering)
- `GET /api/products/categories` - Get all product categories
- `GET /api/products/:id` - Get single product

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders/user/:email` - Get orders by user email
- `GET /api/orders/:id` - Get single order

### Admin

- `GET /api/admin/products` - Get all products (including inactive)
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Soft delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/stats` - Get dashboard statistics

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

## WhatsApp Configuration

### Twilio Setup

1. Create Twilio Account
2. Get Account SID and Auth Token
3. Enable WhatsApp Sandbox:
   - Go to Console → Messaging → Try it out → Send a WhatsApp message
   - Follow sandbox setup instructions
4. Use sandbox number for `TWILIO_WHATSAPP_NUMBER`

## Error Handling

The application implements comprehensive error handling:

- **User-Facing Errors**: Clean, friendly messages
- **Developer Errors**: Detailed logging with stack traces
- **Validation Errors**: Specific field validation messages
- **Database Errors**: Proper error codes and responses

## Security Features

- **Helmet**: Security headers protection
- **Rate Limiting**: API request throttling
- **Input Validation**: Express validator sanitization
- **Error Sanitization**: No sensitive data exposure
- **CORS**: Controlled cross-origin requests

## Database Schema

### Product Schema
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  category: Enum (required),
  image: String,
  stock: Number,
  isActive: Boolean
}
```

### Order Schema
```javascript
{
  customerInfo: {
    name: String (required),
    email: String (required),
    phone: String (required),
    address: String,
    city: String,
    pincode: String
  },
  items: [OrderItem],
  total: Number,
  status: Enum,
  deliveryOption: Enum,
  paymentMethod: String,
  paymentStatus: String
}
```

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dingdongcakebake
CLIENT_URL=https://yourdomain.com
```

### PM2 Deployment (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "dingdongcakebake-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

## Monitoring & Logging

- Request/Response logging with timestamps
- Error logging with detailed stack traces
- Performance monitoring with response times
- MongoDB connection status logging

## Contributing

1. Follow the existing code structure
2. Add proper error handling for new endpoints
3. Include input validation for all user inputs
4. Write clear commit messages
5. Test all functionality before submitting

## Support

For issues or questions, contact: dingdongcakebake@gmail.com