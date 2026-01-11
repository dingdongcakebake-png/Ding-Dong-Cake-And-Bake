import Enquiry from '../models/Enquiry.js';
import {
  sendEnquiryEmailToAdmin,
  sendEnquiryConfirmationToCustomer,
  sendEnquiryStatusEmail
} from '../services/emailService.js';

import {
  sendWhatsAppEnquiryToAdmin,
  sendWhatsAppEnquiryConfirmationToCustomer,
  sendWhatsAppEnquiryStatusUpdate
} from '../services/whatsappService.js';


// CREATE ENQUIRY
export const createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    // Send notifications (non-blocking)
    Promise.all([
      sendEnquiryEmailToAdmin(enquiry),
      sendEnquiryConfirmationToCustomer(enquiry),
      sendWhatsAppEnquiryToAdmin(enquiry),
      sendWhatsAppEnquiryConfirmationToCustomer(enquiry)
    ]).catch(err => {
      console.error("Notification error:", err.message);
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry
    });

  } catch (error) {
    console.error("Create enquiry error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry"
    });
  }
};


// GET ALL ENQUIRIES (ADMIN)
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: enquiries
    });

  } catch (error) {
    console.error("Fetch enquiries error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries"
    });
  }
};


// UPDATE STATUS (ADMIN)
export const updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    // Notify customer
    Promise.all([
      sendEnquiryStatusEmail(enquiry),
      sendWhatsAppEnquiryStatusUpdate(enquiry)
    ]).catch(err => {
      console.error("Status notification error:", err.message);
    });

    res.json({
      success: true,
      message: "Status updated successfully",
      data: enquiry
    });

  } catch (error) {
    console.error("Update status error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update status"
    });
  }
};
