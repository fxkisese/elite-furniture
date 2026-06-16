import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatPrice } from '@/lib/utils';

/**
 * Helper to load an image from URL and convert it to base64 so jsPDF can embed it
 */
const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(null);
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      try {
        const dataURL = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataURL);
      } catch (err) {
        console.warn("Could not convert image to base64 for PDF", err);
        resolve(null); // Return null on error so PDF still generates
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

/**
 * Generate a professional PDF invoice for the cart or order
 */
export async function generateInvoicePDF(orderData, items) {
  const doc = new jsPDF();
  
  const orderNumber = orderData.order_number || `INV-${Math.floor(Date.now() / 1000)}`;
  const date = new Date().toLocaleDateString('en-KE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // 1. Add Header & Branding
  doc.setFontSize(24);
  doc.setTextColor(10, 10, 10);
  doc.text('ELITE FURNITURE', 14, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Nairobi, Kenya', 14, 32);
  doc.text('Tel: +254 793 816 450', 14, 38);
  doc.text('Email: info@furnitureelitespace.com', 14, 44);

  // 2. Add Invoice Details
  doc.setFontSize(20);
  doc.setTextColor(10, 10, 10);
  doc.text('INVOICE', 140, 25);
  
  doc.setFontSize(10);
  doc.text(`Invoice Number: ${orderNumber}`, 140, 32);
  doc.text(`Date: ${date}`, 140, 38);

  // 3. Add Customer Details if available
  if (orderData.customer_name) {
    doc.setFontSize(12);
    doc.setFont('', 'bold');
    doc.text('Billed To:', 14, 60);
    
    doc.setFontSize(10);
    doc.setFont('', 'normal');
    doc.text(orderData.customer_name, 14, 66);
    if (orderData.customer_phone) doc.text(orderData.customer_phone, 14, 72);
    if (orderData.customer_email) doc.text(orderData.customer_email, 14, 78);
    if (orderData.delivery_location) doc.text(orderData.delivery_location, 14, 84);
  }

  // 4. Pre-load item images
  const loadedImages = await Promise.all(
    items.map(async (item) => {
      const imgUrl = item.imageUrl || item.image;
      return await loadImageAsBase64(imgUrl);
    })
  );

  // 5. Generate Table Body
  const tableBody = items.map((item, idx) => {
    return [
      '', // Placeholder for image
      item.title || item.name,
      item.quantity.toString(),
      formatPrice(item.price),
      formatPrice(item.price * item.quantity)
    ];
  });

  const startY = orderData.customer_name ? 95 : 60;

  // 6. Draw Table
  doc.autoTable({
    startY: startY,
    head: [['Image', 'Item Description', 'Qty', 'Unit Price', 'Total']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [10, 10, 10], textColor: [255, 255, 255] },
    columnStyles: {
      0: { cellWidth: 25, minCellHeight: 25, halign: 'center', valign: 'middle' },
      1: { cellWidth: 'auto', valign: 'middle' },
      2: { cellWidth: 15, halign: 'center', valign: 'middle' },
      3: { cellWidth: 35, halign: 'right', valign: 'middle' },
      4: { cellWidth: 40, halign: 'right', valign: 'middle' }
    },
    styles: { fontSize: 10, cellPadding: 3 },
    didDrawCell: function(data) {
      // Draw the image inside the first column
      if (data.section === 'body' && data.column.index === 0) {
        const base64Img = loadedImages[data.row.index];
        if (base64Img) {
          // Calculate center position for image
          const dim = 20; // 20x20 mm image
          const x = data.cell.x + (data.cell.width - dim) / 2;
          const y = data.cell.y + (data.cell.height - dim) / 2;
          try {
            doc.addImage(base64Img, 'JPEG', x, y, dim, dim);
          } catch(e) {
            console.warn("Failed to draw image to PDF");
          }
        }
      }
    }
  });

  // 7. Add Totals
  const finalY = doc.lastAutoTable.finalY + 15;
  
  const subtotal = orderData.subtotal || items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const delivery = orderData.delivery_fee || 0;
  const grandTotal = orderData.grand_total || (subtotal + delivery);

  doc.setFontSize(10);
  doc.setTextColor(10, 10, 10);
  
  // Align totals to right side
  const rightColX = 140;
  const valueColX = 195;
  
  doc.text('Subtotal:', rightColX, finalY);
  doc.text(formatPrice(subtotal), valueColX, finalY, { align: 'right' });
  
  if (delivery > 0) {
    doc.text('Delivery:', rightColX, finalY + 8);
    doc.text(formatPrice(delivery), valueColX, finalY + 8, { align: 'right' });
  }

  doc.setFontSize(12);
  doc.setFont('', 'bold');
  const totalY = finalY + (delivery > 0 ? 18 : 10);
  doc.text('GRAND TOTAL:', rightColX, totalY);
  doc.text(formatPrice(grandTotal), valueColX, totalY, { align: 'right' });

  // 8. Add Footer & Payment Instructions
  doc.setFontSize(10);
  doc.setFont('', 'normal');
  doc.setTextColor(100, 100, 100);
  
  const footerY = doc.internal.pageSize.height - 30;
  doc.line(14, footerY, 196, footerY); // Horizontal line
  
  doc.text('Payment Instructions:', 14, footerY + 8);
  doc.text('Pay via M-PESA Till Number: XXXXXX', 14, footerY + 14);
  doc.text('Thank you for your business!', 14, footerY + 20);

  // 9. Save PDF
  doc.save(`Invoice_${orderNumber}.pdf`);
}
