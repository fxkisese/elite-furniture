import React from 'react';

export default function WhatsAppButton() {
  const phoneNumber = process.env.REACT_APP_WHATSAPP_NUMBER || '1234567890';
  const message = encodeURIComponent('Hello, I would like to know more about Elite Furniture products.');
  const href = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a className="whatsapp-button" href={href} target="_blank" rel="noreferrer">
      Chat on WhatsApp
    </a>
  );
}
