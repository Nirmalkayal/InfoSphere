const Razorpay = require('razorpay');
const crypto = require('crypto');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/env');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const { broadcast } = require('../services/webhookService');

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID || 'dummy',
    key_secret: RAZORPAY_KEY_SECRET || 'dummy'
});

exports.createOrder = async (req, res) => {
    const { amount, slotIds, customerName, customerPhone } = req.body;

    try {
        // 1. Create a Pending Booking
        // In a real app, calculate amount from slots. For now, trust frontend or use passed amount.
        // Also, slots should be 'locked' first.

        // Create Booking
        const booking = await Booking.create({
            turf: req.user?.turfId || '65c27a29f8d9a8c123456789', // Hardcoded or from user for now
            slots: slotIds,
            user: req.user.id,
            customerName,
            customerPhone,
            amount,
            status: 'pending',
            paymentStatus: 'pending',
            paymentSource: 'online'
        });

        // 2. Create Razorpay Order
        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_${booking._id}`,
        };

        const order = await razorpay.orders.create(options);

        // 3. Save Payment Record
        await Payment.create({
            booking: booking._id,
            orderId: order.id,
            amount: amount * 100,
            currency: 'INR',
            status: 'created'
        });

        res.json(order);
    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).send(error);
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET || 'dummy')
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Database updates here
        const payment = await Payment.findOne({ orderId: razorpay_order_id });
        if (payment) {
            payment.paymentId = razorpay_payment_id;
            payment.signature = razorpay_signature;
            payment.status = 'captured';
            await payment.save();

            // Confirm Booking
            const booking = await Booking.findById(payment.booking);
            booking.status = 'confirmed';
            booking.paymentStatus = 'paid';
            await booking.save();

            // Update Slots
            await Slot.updateMany(
                { _id: { $in: booking.slots } },
                {
                    $set: {
                        status: 'booked',
                        customerName: booking.customerName || 'Online User',
                        booking: booking._id
                    }
                }
            );

            // Broadcast Update
            booking.slots.forEach(slotId => {
                broadcast('SLOT_LOCKED', {
                    slotId,
                    status: 'booked',
                    customerName: booking.customerName
                });
            });
        }

        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, error: "Invalid Signature" });
    }
};
