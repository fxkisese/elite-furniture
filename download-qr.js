const fs = require('fs');
const https = require('https');

https.get("https://quickchart.io/qr?text=https://elitefurniture.co.ke&size=500", (res) => {
  const file = fs.createWriteStream("website-qr.png");
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log("QR Code saved successfully to website-qr.png");
  });
}).on('error', (err) => {
  console.error("Error: ", err.message);
});
