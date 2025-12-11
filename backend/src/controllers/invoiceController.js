const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { generateInvoice } = require('../services/invoiceService');

exports.downloadInvoice = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId).populate('slots');
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const payment = await Payment.findOne({ booking: booking._id });

        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${bookingId}.pdf`);

        generateInvoice(booking, payment, res);
    } catch (err) {
        console.error('Invoice generation error:', err);
        res.status(500).json({ error: 'Could not generate invoice' });
    }
};
