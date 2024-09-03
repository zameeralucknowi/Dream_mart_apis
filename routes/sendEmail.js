const axios = require('axios')
require('dotenv').config();


const sendSignUpEmail =  async(toEmail,subject,message)=>{

    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { email: 'zameeralucknowi@gmail.com', name: 'Dream Mart' },
                to: [{ email: toEmail }],
                subject: subject,
                htmlContent: `<html><body><h3>${message}</h3></body></html>`, // Use HTML content for better formatting
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                },
            }
        );
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.data : error.message);
    }
}

module.exports = sendSignUpEmail;