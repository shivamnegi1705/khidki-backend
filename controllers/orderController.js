import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
// import Stripe from 'stripe' - commented out as Stripe is not supported for now
import razorpay from 'razorpay'
import { generateInvoice } from "../utils/invoiceGenerator.js";

// global variables
const currency = 'inr'
const deliveryCharge = 10

// Helper function to update product quantities
const updateProductQuantities = async (items) => {
    try {
        for (const item of items) {
            const product = await productModel.findById(item._id);
            if (product) {
                // Decrease the quantity by the ordered amount
                const newQuantity = Math.max(0, product.quantity - item.quantity);
                await productModel.findByIdAndUpdate(item._id, { quantity: newQuantity });
            }
        }
    } catch (error) {
        console.log("Error updating product quantities:", error);
        throw error;
    }
}

// gateway initialize
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY) - commented out as Stripe is not supported for now

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
})

// Placing orders using COD Method
const placeOrder = async (req,res) => {
    
    try {
        
        const { userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        // Update product quantities
        await updateProductQuantities(items);

        // Generate invoice for the order
        try {
            const invoice = await generateInvoice(newOrder);
            // Update order with invoice reference
            await orderModel.findByIdAndUpdate(newOrder._id, { invoice: invoice._id });
        } catch (invoiceError) {
            console.error("Error generating invoice:", invoiceError);
            // Continue with order placement even if invoice generation fails
        }

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Stripe Method - commented out as Stripe is not supported for now
/*
const placeOrderStripe = async (req,res) => {
    try {
        
        const { userId, items, amount, address} = req.body
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true,session_url:session.url});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
*/

// Verify Stripe - commented out as Stripe is not supported for now
/*
const verifyStripe = async (req,res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            // Get the order to access items
            const order = await orderModel.findById(orderId);
            if (order) {
                // Update product quantities
                await updateProductQuantities(order.items);
            }
            
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}
*/

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {
    try {
        
        const { userId, items, amount, address} = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Razorpay",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt : newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error,order)=>{
            if (error) {
                console.log(error)
                return res.json({success:false, message: error})
            }
            res.json({success:true,order})
        })

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const verifyRazorpay = async (req,res) => {
    try {
        
        const { userId, razorpay_order_id  } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            // Get the order to access items
            const order = await orderModel.findById(orderInfo.receipt);
            if (order) {
                // Update product quantities
                await updateProductQuantities(order.items);
            }
            
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderInfo.receipt,
            { payment: true },
            { new: true }
        );

        // Generate invoice for the order if payment is successful
        try {
            if (!updatedOrder.invoice) {
                const invoice = await generateInvoice(updatedOrder);
                // Update order with invoice reference
                await orderModel.findByIdAndUpdate(updatedOrder._id, { invoice: invoice._id });
            }
        } catch (invoiceError) {
            console.error("Error generating invoice:", invoiceError);
            // Continue with payment verification even if invoice generation fails
        }

        await userModel.findByIdAndUpdate(userId,{cartData:{}})
        res.json({ success: true, message: "Payment Successful" })
        } else {
             res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Export without Stripe functions as Stripe is not supported for now
export {verifyRazorpay, /* verifyStripe, */ placeOrder, /* placeOrderStripe, */ placeOrderRazorpay, allOrders, userOrders, updateStatus}
