import invoiceModel from '../models/invoiceModel.js';
import orderModel from '../models/orderModel.js';
import { getInvoiceByOrderId } from '../utils/invoiceGenerator.js';

// Get invoice by id
const getInvoiceById = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        
        const invoice = await invoiceModel.findById(invoiceId);
        
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }
        
        res.json({ success: true, invoice });
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get invoice by order id
const getInvoiceByOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const invoice = await getInvoiceByOrderId(orderId);
        
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found for this order' });
        }
        
        res.json({ success: true, invoice });
    } catch (error) {
        console.error('Error fetching invoice by order:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all invoices for a user
const getUserInvoices = async (req, res) => {
    try {
        const { userId } = req.body;
        
        // Find all orders for the user
        const orders = await orderModel.find({ userId });
        
        // Get all invoice IDs from the orders
        const invoiceIds = orders
            .filter(order => order.invoice)
            .map(order => order.invoice);
        
        // Find all invoices
        const invoices = await invoiceModel.find({ _id: { $in: invoiceIds } });
        
        res.json({ success: true, invoices });
    } catch (error) {
        console.error('Error fetching user invoices:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getInvoiceById, getInvoiceByOrder, getUserInvoices };
