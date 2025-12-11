const PDFDocument = require('pdfkit');

function generateInvoice(booking, payment, res) {
    const doc = new PDFDocument({ margin: 50 });

    // Stream to response
    doc.pipe(res);

    // Header
    doc
        .fontSize(20)
        .text('TurfHub', { align: 'center' })
        .fontSize(10)
        .text('123, Sports Avenue, Koramangala', { align: 'center' })
        .text('Bangalore, KA - 560034', { align: 'center' })
        .text('GSTIN: 29AAAAA0000A1Z5', { align: 'center' })
        .moveDown();

    // Invoice Details
    doc
        .fontSize(12)
        .text(`Invoice Number: INV-${booking._id.toString().slice(-6).toUpperCase()}`, { align: 'right' })
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
        .moveDown();

    // Bill To
    doc
        .fontSize(12)
        .text('Bill To:', { underline: true })
        .fontSize(10)
        .text(`Name: ${booking.customerName || 'N/A'}`)
        .text(`Phone: ${booking.customerPhone || 'N/A'}`)
        .moveDown();

    // Table Header
    const tableTop = 250;
    const itemX = 50;
    const priceX = 400;

    doc
        .fontSize(10)
        .text('Item Description', itemX, tableTop, { bold: true })
        .text('Amount (INR)', priceX, tableTop, { bold: true });

    doc
        .moveTo(itemX, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

    // Items
    let y = tableTop + 30;

    // Slot Charge
    doc
        .text(`Turf Booking (${booking.slots.length} slots)`, itemX, y)
        .text(booking.amount.toFixed(2), priceX, y);

    // GST Breakdown
    const gstRate = 0.18;
    const baseAmount = booking.amount / (1 + gstRate);
    const gstAmount = booking.amount - baseAmount;

    y += 20;
    doc
        .fontSize(8)
        .text(`Base Amount: ${baseAmount.toFixed(2)}`, itemX + 20, y, { color: 'gray' })
        .text(`GST (18%): ${gstAmount.toFixed(2)}`, itemX + 20, y + 10, { color: 'gray' })

    // Total
    y += 40;
    doc
        .fontSize(10)
        .fillColor('black')
        .moveTo(itemX, y)
        .lineTo(550, y)
        .stroke()
        .fontSize(12)
        .text('Total', itemX, y + 10, { bold: true })
        .text(booking.amount.toFixed(2), priceX, y + 10, { bold: true });

    // Footer
    doc
        .fontSize(10)
        .text('Payment Status: ' + (booking.paymentStatus || 'Pending').toUpperCase(), 50, 700, { align: 'center', color: booking.paymentStatus === 'paid' ? 'green' : 'red' })
        .text('Thank you for booking with us!', 50, 720, { align: 'center', color: 'black' });

    doc.end();
}

module.exports = { generateInvoice };
