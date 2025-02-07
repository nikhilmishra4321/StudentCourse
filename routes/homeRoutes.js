const express = require('express');
const sendAdminEmail = require('../utils/sendAdminEmail');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const GeneratedCredentials = require('../models/GeneratedCredentials');
require('dotenv').config();
const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
router.get('/', (req, res) => {
    res.render('home'); 
});
const extractEmailsFromExcel = (filePath) => {
    const xlsx = require('xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return data.map(entry => {
        const emailKey = Object.keys(entry).find(key => key.toLowerCase().includes("email"));
        return emailKey ? entry[emailKey] : null;
    }).filter(email => email);
};
const generatePassword = () => {
    return crypto.randomBytes(6).toString('hex'); 
};
router.post('/upload-excel', async (req, res) => {
    if (!req.files || !req.files.excelFile) {
        return res.json({ success: false, message: 'No file uploaded.' });
    }
    try {
        const file = req.files.excelFile;
        const uploadPath = path.join(uploadDir, file.name);

        file.mv(uploadPath, async (err) => {
            if (err) {
                console.error('Error saving file:', err);
                return res.json({ success: false, message: 'Error saving file.' });
            }

            const emails = extractEmailsFromExcel(uploadPath);
            if (fs.existsSync(uploadPath)) {
                fs.unlinkSync(uploadPath); 
            }

            let savedEmails = [];
            for (let email of emails) {
                const existingUser = await GeneratedCredentials.findOne({ email });

                if (!existingUser) {
                    const password = generatePassword();
                    const newCredentials = new GeneratedCredentials({ email, password });
                    await newCredentials.save();
                    savedEmails.push(email);
                } else {
                    console.log(` Email already exists: ${email}, skipping...`);
                }
            }

            return res.json({ success: true, message: 'Emails uploaded successfully!', savedEmails });
        });
    } catch (error) {
        console.error('Error processing file:', error);
        return res.json({ success: false, message: 'An unexpected error occurred.' });
    }
});
router.post('/send-emails', async (req, res) => {
    try {
        const users = await GeneratedCredentials.find();

        if (users.length === 0) {
            return res.json({ 
                success: false, 
                message: 'No users found in the database.', 
                successEmails: [], 
                failedEmails: [] 
            });
        }
        let successEmails = [];
        let failedEmails = [];

        for (let user of users) {
            const result = await sendAdminEmail(
                user.email,
                "Your Login Credentials",
                `Your login details:\nEmail: ${user.email}\nPassword: ${user.password}`
            );

            if (result.status === 'success') {
                successEmails.push(user.email);
            } else {
                failedEmails.push(user.email);
            }
        }

        return res.json({
            success: true,
            message: 'Emails processed.',
            successEmails: successEmails,  
            failedEmails: failedEmails     
        });
    } catch (error) {
        console.error('Error sending emails:', error);
        return res.json({ 
            success: false, 
            message: 'An error occurred while sending emails.', 
            successEmails: [], 
            failedEmails: [] 
        });
    }
    
});
module.exports = router;

