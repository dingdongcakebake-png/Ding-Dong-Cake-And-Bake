import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Format phone number correctly for WhatsApp
 * ALWAYS returns: whatsapp:+91XXXXXXXXXX
 */
const formatWhatsAppNumber = (phone) => {
  let cleaned = phone.toString().trim();
  cleaned = cleaned.replace(/\s+/g, "");

  if (cleaned.startsWith("whatsapp:")) return cleaned;

  if (!cleaned.startsWith("+")) {
    cleaned = "+91" + cleaned.replace(/^0/, "");
  }

  return `whatsapp:${cleaned}`;
};

/**
 * SEND ORDER CONFIRMATION (CUSTOMER + ADMIN)
 */
export const sendWhatsAppOrderConfirmation = async (orderData) => {
  try {
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_WHATSAPP_NUMBER
    ) {
      console.log("⚠️ WhatsApp not configured");
      return;
    }

    const { customerInfo, items, total, _id, deliveryOption } = orderData;

    const customerNumber = formatWhatsAppNumber(customerInfo.phone);
    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;

    const itemsList = items
      .map(
        (item) =>
          `• ${item.name} - ₹${item.price} x${item.quantity} = ₹${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    /* ================= CUSTOMER MESSAGE ================= */
    const customerMessage = `
🎂 *${process.env.BRAND_NAME || "dingdongcakebake"}*

✅ *Order Confirmed!*
Order ID: #${_id.toString().slice(-8)}

👤 *Customer:* ${customerInfo.name}
📞 *Phone:* ${customerInfo.phone}

🛒 *Items:*
${itemsList}

💰 *Total: ₹${total.toFixed(2)}*

🚚 *Delivery:* ${
      deliveryOption === "pickup" ? "Self Pickup" : "Home Delivery"
    }

🙏 Thank you for choosing us!
`.trim();

    /* ================= ADMIN MESSAGE ================= */
    const adminMessage = `
📢 *NEW ORDER RECEIVED*

🆔 Order ID: #${_id.toString().slice(-8)}

👤 Customer: ${customerInfo.name}
📞 Phone: ${customerInfo.phone}

🛒 Items:
${itemsList}

💰 Total: ₹${total.toFixed(2)}

🚚 Delivery: ${
      deliveryOption === "pickup" ? "Self Pickup" : "Home Delivery"
    }
`.trim();

    // SEND TO CUSTOMER
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: customerNumber,
      body: customerMessage,
    });

    console.log("✅ WhatsApp sent to CUSTOMER");

    // SEND TO ADMIN
    if (adminNumber) {
      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: adminNumber,
        body: adminMessage,
      });

      console.log("✅ WhatsApp sent to ADMIN");
    }
  } catch (error) {
    console.error("❌ WhatsApp order confirmation error:", error.message);
  }
};

/**
 * SEND ORDER STATUS UPDATE (CUSTOMER ONLY)
 */
export const sendWhatsAppStatusUpdate = async (orderData, status) => {
  try {
    const toNumber = formatWhatsAppNumber(orderData.customerInfo.phone);

    const statusMessages = {
      pending: "🕒 Your order has been received!",
      preparing: "👨‍🍳 Your order is being prepared!",
      out_for_delivery: "🚚 Your order is out for delivery!",
      delivered: "🎉 Your order has been delivered. Enjoy!",
      cancelled: "😔 Your order has been cancelled.",
    };

    const message = `
🎂 *${process.env.BRAND_NAME || "dingdongcakebake"}*

📝 *Order Update*
Order ID: #${orderData._id.toString().slice(-8)}

${statusMessages[status] || "Order status updated."}

Status: *${status.replace("_", " ").toUpperCase()}*
`.trim();

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: toNumber,
      body: message,
    });

    console.log("✅ WhatsApp status update sent");
  } catch (error) {
    console.error("❌ WhatsApp status update error:", error.message);
  }
};



//enqurey 
export const sendWhatsAppEnquiryToAdmin = async (enquiry) => {
  const msg = `
📩 NEW ENQUIRY

Name: ${enquiry.name}
Phone: ${enquiry.phone}
Type: ${enquiry.enquiryType}

Message:
${enquiry.message}
`;

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: process.env.ADMIN_WHATSAPP_NUMBER,
    body: msg
  });
};


export const sendWhatsAppEnquiryConfirmationToCustomer = async (enquiry) => {
  const msg = `
🎂 ${process.env.BRAND_NAME}

Hi ${enquiry.name},
We received your enquiry.

Status: Pending
We will contact you soon 😊
`;

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: formatWhatsAppNumber(enquiry.phone),
    body: msg
  });
};


export const sendWhatsAppEnquiryStatusUpdate = async (enquiry) => {
  const msg = `
🎂 ${process.env.BRAND_NAME}

Your enquiry status is now:

${enquiry.status.toUpperCase()}

Thank you!
`;

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: formatWhatsAppNumber(enquiry.phone),
    body: msg
  });
};
