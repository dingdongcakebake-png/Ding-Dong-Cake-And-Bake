import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  enquiryType: {
    type: String,
    enum: ['custom_cake', 'products', 'delivery', 'general'],
    default: 'general'
  },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('Enquiry', enquirySchema);
