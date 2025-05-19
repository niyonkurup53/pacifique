const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/ussd', (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';

    if (text === '') {
        // First request
        response = `CON What would you want to check\n`;
        response += `1. My Account\n`;
        response += `2. My phone number`;

    } else if (text === '1') {
        // First level submenu
        response = `CON Choose account information you want to view\n`;
        response += `1. Account number`;

    } else if (text === '2') {
        // Terminal request - display phone number
        response = `END Your phone number is ${phoneNumber}`;

    } else if (text === '1*1') {
        // Terminal request - show account number
        const accountNumber = "ACC1001";
        response = `END Your account number is ${accountNumber}`;
    } else {
        response = `END Invalid choice. Try again.`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`USSD app listening on port ${PORT}`);
});
