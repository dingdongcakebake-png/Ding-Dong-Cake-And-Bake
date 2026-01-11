import express from 'express';
import { createEnquiry, getAllEnquiries, updateEnquiryStatus } from '../controllers/enquiryController.js';

const router = express.Router();

router.post('/', createEnquiry);

// Admin
router.get('/admin', getAllEnquiries);
router.put('/admin/:id/status', updateEnquiryStatus);

export default router;
