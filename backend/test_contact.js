const axios = require('axios');

const testContactForm = async () => {
    try {
        console.log('🚀 Sending test contact form request to http://localhost:5000/api/site/contact...');
        const response = await axios.post('http://localhost:5000/api/site/contact', {
            name: "Test Agent",
            email: "agent@test.com",
            subject: "Verification",
            message: "Verifying the implementation of the contact form."
        });
        console.log('✅ Success! Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
};

testContactForm();
