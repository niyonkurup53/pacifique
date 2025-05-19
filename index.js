const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sample district -> cells mapping (add more districts as needed)
const districts = {
    '1': { name: 'Gasabo', cells: ['Kimironko', 'Remera', 'Kacyiru'] },
    '2': { name: 'Kicukiro', cells: ['Kagarama', 'Gatenga', 'Nyarugunga'] },
    '3': { name: 'Nyarugenge', cells: ['Nyamirambo', 'Kigali', 'Gitega'] }
};

app.post('/ussd', (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';
    const inputs = text.split('*');

    if (text === '') {
        response = `CON Choose Language / Hitamo ururimi\n`;
        response += `1. English\n`;
        response += `2. Ikinyarwanda`;

    } else if (inputs[0] === '1') {
        // English Menu
        if (inputs.length === 1) {
            // Show districts in English
            response = `CON Choose your District:\n`;
            for (const [key, district] of Object.entries(districts)) {
                response += `${key}. ${district.name}\n`;
            }

        } else if (inputs.length === 2) {
            const districtKey = inputs[1];
            const district = districts[districtKey];
            if (district) {
                response = `CON Choose Sector in ${district.name}:\n`;
                district.cells.forEach((cell, i) => {
                    response += `${i + 1}. ${cell}\n`;
                });
            } else {
                response = `END Invalid district selection.`;
            }

        } else if (inputs.length === 3) {
            const districtKey = inputs[1];
            const cellIndex = parseInt(inputs[2]) - 1;
            const district = districts[districtKey];
            if (district && district.cells[cellIndex]) {
                const cell = district.cells[cellIndex];
                response = `END You selected ${cell} sector in ${district.name} district.`;
            } else {
                response = `END Invalid sector choice.`;
            }

        } else {
            response = `END Invalid input.`;
        }

    } else if (inputs[0] === '2') {
        // Kinyarwanda Menu
        if (inputs.length === 1) {
            // Show districts in Kinyarwanda
            response = `CON Hitamo akarere:\n`;
            for (const [key, district] of Object.entries(districts)) {
                response += `${key}. ${district.name}\n`;
            }

        } else if (inputs.length === 2) {
            const districtKey = inputs[1];
            const district = districts[districtKey];
            if (district) {
                response = `CON Hitamo umurenge muri ${district.name}:\n`;
                district.cells.forEach((cell, i) => {
                    response += `${i + 1}. ${cell}\n`;
                });
            } else {
                response = `END Akarere mwahisemo ntikabaho.`;
            }

        } else if (inputs.length === 3) {
            const districtKey = inputs[1];
            const cellIndex = parseInt(inputs[2]) - 1;
            const district = districts[districtKey];
            if (district && district.cells[cellIndex]) {
                const cell = district.cells[cellIndex];
                response = `END Wahisemo umurenge wa ${cell} mu karere ka ${district.name}.`;
            } else {
                response = `END Umurenge wahisemo ntubaho.`;
            }

        } else {
            response = `END Hitamo si yo. Ongera ugerageze.`;
        }

    } else {
        response = `END Invalid selection.`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`USSD app running on port ${PORT}`);
});
