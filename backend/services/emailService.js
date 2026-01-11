import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service connection failed:', error);
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

export const sendOrderConfirmation = async (orderData) => {
  try {
    const { customerInfo, items, total, _id, deliveryOption } = orderData;

    const itemsList = items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">₹${item.price}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join('');

    const mailOptions = {
      from: `"${process.env.VITE_BRAND_NAME || 'dingdongcakebake'}" <${process.env.EMAIL_USER}>`,
      to: customerInfo.email,
      subject: `Order Confirmation - #${_id.toString().slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #d97706; margin: 0; font-size: 28px;">🎂 ${process.env.VITE_BRAND_NAME || 'dingdongcakebake'}</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Crafting delicious memories</p>
            </div>

            <h2 style="color: #333; border-bottom: 2px solid #d97706; padding-bottom: 10px;">Order Confirmation</h2>
            
            <p style="color: #333; font-size: 16px;">Dear ${customerInfo.name},</p>
            <p style="color: #333;">Thank you for your order! We're excited to prepare your delicious treats.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong style="color: #d97706;">Order ID:</strong> #${_id.toString().slice(-8)}<br>
              <strong style="color: #d97706;">Order Date:</strong> ${new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}<br>
              <strong style="color: #d97706;">Delivery Method:</strong> ${deliveryOption === 'pickup' ? 'Self Pickup' : 'Home Delivery'}
            </div>

            ${deliveryOption === 'pickup' ? `
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #d97706; margin: 20px 0;">
                <h3 style="color: #d97706; margin: 0 0 10px 0;">📍 Pickup Details</h3>
                <p style="margin: 0; color: #333;">
                  <strong>Address:</strong> ${process.env.PICKUP_ADDRESS || 'dingdongcakebake, 12 Main Road, Ooty – 643006'}<br>
                  <strong>Timing:</strong> ${process.env.PICKUP_TIME || '10 AM – 9 PM'}
                </p>
              </div>
            ` : `
              <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0;">
                <h3 style="color: #28a745; margin: 0 0 10px 0;">🚚 Delivery Address</h3>
                <p style="margin: 0; color: #333;">
                  ${customerInfo.address}<br>
                  ${customerInfo.city}, ${customerInfo.pincode}
                </p>
              </div>
            `}

            <h3 style="color: #333; margin-top: 30px;">Order Items:</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #d97706;">Item</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #d97706;">Price</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #d97706;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #d97706;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
                <tr style="background-color: #f8f9fa; font-weight: bold;">
                  <td colspan="3" style="padding: 15px; border-top: 2px solid #d97706; text-align: right;">Total Amount:</td>
                  <td style="padding: 15px; border-top: 2px solid #d97706; text-align: right; color: #d97706; font-size: 18px;">₹${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; margin: 20px 0;">
              <h3 style="color: #007bff; margin: 0 0 10px 0;">💳 Payment Information</h3>
              <p style="margin: 0; color: #333;">
                <strong>Payment Method:</strong> Cash on Delivery<br>
                <strong>Amount to Pay:</strong> ₹${total.toFixed(2)}
              </p>
            </div>

            <div style="text-center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0;">Thank you for choosing ${process.env.VITE_BRAND_NAME || 'dingdongcakebake'}!</p>
              <p style="color: #666; margin: 5px 0;">For any queries, contact us at:</p>
              <p style="color: #d97706; font-weight: bold; margin: 0;">${process.env.EMAIL_USER}</p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw new Error('Failed to send order confirmation email');
  }
};

export const sendOrderStatusUpdate = async (orderData, newStatus) => {
  try {
    const { customerInfo, _id } = orderData;
    
    const statusMessages = {
      preparing: 'Your order is being prepared with love! 👨‍🍳',
      ready: 'Great news! Your order is ready! 🎉',
      completed: 'Thank you! Your order has been completed. 😊',
      cancelled: 'Your order has been cancelled. If you have any questions, please contact us. 😔',
    };

    const statusColors = {
      preparing: '#007bff',
      ready: '#28a745',
      completed: '#28a745',
      cancelled: '#dc3545',
    };

    const mailOptions = {
      from: `"${process.env.VITE_BRAND_NAME || 'dingdongcakebake'}" <${process.env.EMAIL_USER}>`,
      to: customerInfo.email,
      subject: `Order Update - #${_id.toString().slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #d97706; margin: 0; font-size: 28px;">🎂 ${process.env.VITE_BRAND_NAME || 'dingdongcakebake'}</h1>
            </div>

            <div style="background-color: ${statusColors[newStatus] || '#007bff'}20; padding: 20px; border-radius: 10px; border-left: 4px solid ${statusColors[newStatus] || '#007bff'}; text-align: center; margin: 20px 0;">
              <h2 style="color: ${statusColors[newStatus] || '#007bff'}; margin: 0 0 10px 0;">Order Status Update</h2>
              <p style="margin: 0; color: #333; font-size: 18px;">${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong style="color: #333;">Order ID:</strong> #${_id.toString().slice(-8)}<br>
              <strong style="color: #333;">Customer:</strong> ${customerInfo.name}<br>
              <strong style="color: #333;">Status:</strong> <span style="color: ${statusColors[newStatus] || '#007bff'}; font-weight: bold;">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</span>
            </div>

            <div style="text-center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0;">Thank you for choosing ${process.env.VITE_BRAND_NAME || 'dingdongcakebake'}!</p>
              <p style="color: #d97706; font-weight: bold; margin: 5px 0;">${process.env.EMAIL_USER}</p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order status update email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending order status update email:', error);
    throw new Error('Failed to send order status update email');
  }
};


export const sendAdminNewOrderEmail = async (orderData) => {
  try {
    const { customerInfo, items, total, _id, deliveryOption } = orderData;

    const itemsList = items
      .map(
        (item) =>
          `<li>${item.name} - ₹${item.price} x ${item.quantity}</li>`
      )
      .join("");

    const mailOptions = {
      from: `"${process.env.BRAND_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // 🔥 ADMIN EMAIL
      subject: `🛎️ New Order Received - #${_id.toString().slice(-8)}`,
      html: `
        <h2>🆕 New Order Received</h2>

        <p><strong>Order ID:</strong> #${_id.toString().slice(-8)}</p>
        <p><strong>Customer:</strong> ${customerInfo.name}</p>
        <p><strong>Phone:</strong> ${customerInfo.phone}</p>
        <p><strong>Delivery:</strong> ${
          deliveryOption === "pickup" ? "Self Pickup" : "Home Delivery"
        }</p>

        <h3>Items:</h3>
        <ul>${itemsList}</ul>

        <h3>Total: ₹${total.toFixed(2)}</h3>

        <a href="${process.env.ADMIN_DASHBOARD_URL}"
           style="
             display:inline-block;
             padding:12px 20px;
             background:#d97706;
             color:white;
             text-decoration:none;
             border-radius:6px;
             margin-top:20px;
           ">
          👉 Go to Admin Dashboard
        </a>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Admin new order email sent:", result.messageId);
  } catch (error) {
    console.error("❌ Error sending admin email:", error.message);
  }
};



//enquirey 
// ADMIN notification
export const sendEnquiryEmailToAdmin = async (enquiry) => {
  const mailOptions = {
    from: `"${process.env.BRAND_NAME}" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "📩 New Customer Enquiry",
    html: `
      <h3>New Enquiry Received</h3>
      <p><b>Name:</b> ${enquiry.name}</p>
      <p><b>Phone:</b> ${enquiry.phone}</p>
      <p><b>Email:</b> ${enquiry.email}</p>
      <p><b>Type:</b> ${enquiry.enquiryType}</p>
      <p><b>Message:</b> ${enquiry.message}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};


// CUSTOMER confirmation
export const sendEnquiryConfirmationToCustomer = async (enquiry) => {
  if (!enquiry.email) return;

  const mailOptions = {
    from: `"${process.env.BRAND_NAME}" <${process.env.EMAIL_USER}>`,
    to: enquiry.email,
    subject: "✅ We received your enquiry",
    html: `
      <p>Hello ${enquiry.name},</p>
      <p>We have received your enquiry and our team will contact you shortly.</p>
      <p><b>Status:</b> Pending</p>
      <br/>
      <p>Thank you,<br/>${process.env.BRAND_NAME}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};


// STATUS update email
export const sendEnquiryStatusEmail = async (enquiry) => {
  if (!enquiry.email) return;

  const mailOptions = {
    from: `"${process.env.BRAND_NAME}" <${process.env.EMAIL_USER}>`,
    to: enquiry.email,
    subject: "📢 Enquiry Status Updated",
    html: `
      <p>Hello ${enquiry.name},</p>
      <p>Your enquiry status has been updated:</p>
      <h3>${enquiry.status.toUpperCase()}</h3>
      <p>Thank you,<br/>${process.env.BRAND_NAME}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
