import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema({
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'order', 
        required: true 
    },
    invoiceNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    date: { 
        type: Date, 
        default: Date.now, 
        required: true 
    },
    sellerDetails: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        gstin: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    buyerDetails: {
        name: { type: String, required: true },
        address: { type: Object, required: true },
        gstin: { type: String }
    },
    items: [{
        productId: { type: String, required: true },
        description: { type: String, required: true },
        hsnCode: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        taxableValue: { type: Number, required: true },
        cgst: { type: Number, required: true },
        sgst: { type: Number, required: true },
        total: { type: Number, required: true }
    }],
    totalTaxableValue: { type: Number, required: true },
    totalCgst: { type: Number, required: true },
    totalSgst: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    amountInWords: { type: String, required: true }
})

const invoiceModel = mongoose.models.invoice || mongoose.model('invoice', invoiceSchema)
export default invoiceModel
