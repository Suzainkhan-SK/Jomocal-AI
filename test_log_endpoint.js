const axios = require('axios');

async function testLogEndpoint() {
    try {
        const testData = {
            userId: "test-user-id",
            automationName: "Auto-Reply to Customer Messages",
            action: "Test action",
            status: "success",
            platform: "telegram"
        };
        
        console.log('Testing with data:', testData);
        
        const response = await axios.post('http://localhost:5000/api/logs/n8n', testData);
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testLogEndpoint();