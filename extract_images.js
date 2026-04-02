const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Match base64 for logo
const logoMatch = html.match(/<img[^>]*src=["'](data:image\/[^;]+;base64,([^"']+))["'][^>]*alt=["']Logo Kiaçaí["']/i);
if (logoMatch) {
    const base64Data = logoMatch[2];
    fs.writeFileSync('logo.jpg', Buffer.from(base64Data, 'base64'));
    console.log("logo.jpg extracted!");
}

// Match base64 for bottle
const bottleMatch = html.match(/<img[^>]*class=["']bottle-img["'][^>]*src=["'](data:image\/[^;]+;base64,([^"']+))["']/i);
if (bottleMatch) {
    const base64Data = bottleMatch[2];
    fs.writeFileSync('garrafa.jpg', Buffer.from(base64Data, 'base64'));
    console.log("garrafa.jpg extracted!");
}
