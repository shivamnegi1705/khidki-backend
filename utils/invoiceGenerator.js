import invoiceModel from '../models/invoiceModel.js';

// Hardcoded seller details as per requirement
const sellerDetails = {
    name: "Shivam Retail Pvt. Ltd.",
    address: "123, MG Road, Bengaluru, Karnataka - 560001",
    gstin: "29ABCDE1234F1Z5",
    phone: "+91-9876543210",
    email: "contact@shivamretail.in"
};

// GST rates
const CGST_RATE = 0.09; // 9%
const SGST_RATE = 0.09; // 9%
const TOTAL_GST_RATE = CGST_RATE + SGST_RATE; // 18%

// Generate a random HSN code (8 digits)
const generateHSNCode = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Generate a random invoice number
const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
    return `INV-${year}-${randomDigits}`;
};

// Convert number to words
const numberToWords = (num) => {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    
    const convertLessThanThousand = (n) => {
        if (n === 0) return '';
        else if (n < 20) return units[n] + ' ';
        else if (n < 100) return tens[Math.floor(n / 10)] + ' ' + convertLessThanThousand(n % 10);
        else return units[Math.floor(n / 100)] + ' Hundred ' + convertLessThanThousand(n % 100);
    };
    
    let result = '';
    let n = num;
    
    if (n < 0) {
        result = 'Negative ';
        n = -n;
    }
    
    if (n >= 100000) {
        result += convertLessThanThousand(Math.floor(n / 100000)) + 'Lakh ';
        n %= 100000;
    }
    
    if (n >= 1000) {
        result += convertLessThanThousand(Math.floor(n / 1000)) + 'Thousand ';
        n %= 1000;
    }
    
    result += convertLessThanThousand(n);
    
    return result.trim() + ' Rupees Only';
};

// Calculate invoice details for an item
const calculateItemInvoiceDetails = (item) => {
    const totalAmount = item.price * item.quantity;
    const taxableValue = totalAmount / (1 + TOTAL_GST_RATE);
    const cgst = taxableValue * CGST_RATE;
    const sgst = taxableValue * SGST_RATE;
    const unitPrice = taxableValue / item.quantity;
    
    return {
        productId: item._id,
        description: item.name,
        hsnCode: generateHSNCode(),
        quantity: item.quantity,
        unitPrice: parseFloat(unitPrice.toFixed(2)),
        taxableValue: parseFloat(taxableValue.toFixed(2)),
        cgst: parseFloat(cgst.toFixed(2)),
        sgst: parseFloat(sgst.toFixed(2)),
        total: parseFloat(totalAmount.toFixed(2))
    };
};

// Generate invoice for an order
const generateInvoice = async (order) => {
    try {
        // Calculate invoice items
        const invoiceItems = order.items.map(item => calculateItemInvoiceDetails(item));
        
        // Calculate totals
        const totalTaxableValue = parseFloat(invoiceItems.reduce((sum, item) => sum + item.taxableValue, 0).toFixed(2));
        const totalCgst = parseFloat(invoiceItems.reduce((sum, item) => sum + item.cgst, 0).toFixed(2));
        const totalSgst = parseFloat(invoiceItems.reduce((sum, item) => sum + item.sgst, 0).toFixed(2));
        const totalAmount = parseFloat(invoiceItems.reduce((sum, item) => sum + item.total, 0).toFixed(2));
        
        // Create invoice object
        const invoiceData = {
            orderId: order._id,
            invoiceNumber: generateInvoiceNumber(),
            date: new Date(),
            sellerDetails,
            buyerDetails: {
                name: order.address.firstName + " " + order.address.lastName || 'Customer',
                address: order.address,
                gstin: order.address.gstin || ''
            },
            items: invoiceItems,
            totalTaxableValue,
            totalCgst,
            totalSgst,
            totalAmount,
            amountInWords: numberToWords(Math.round(totalAmount))
        };
        
        // Save invoice to database
        const invoice = new invoiceModel(invoiceData);
        await invoice.save();
        
        return invoice;
    } catch (error) {
        console.error('Error generating invoice:', error);
        throw error;
    }
};

// Get invoice by order id
const getInvoiceByOrderId = async (orderId) => {
    try {
        const invoice = await invoiceModel.findOne({ orderId });
        return invoice;
    } catch (error) {
        console.error('Error fetching invoice:', error);
        throw error;
    }
};

export { generateInvoice, getInvoiceByOrderId };
