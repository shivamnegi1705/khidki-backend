import express from 'express';
import { getInvoiceById, getInvoiceByOrder, getUserInvoices } from '../controllers/invoiceController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const invoiceRouter = express.Router();

// User routes
invoiceRouter.post('/user', authUser, getUserInvoices);
invoiceRouter.get('/order/:orderId', authUser, getInvoiceByOrder);

// Admin and user routes
invoiceRouter.get('/:invoiceId', authUser, getInvoiceById);

export default invoiceRouter;
