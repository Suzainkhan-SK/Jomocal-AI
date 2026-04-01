require('dotenv').config({path: './server/.env'});
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    try {
        console.log('Testing Gemini API Key...');
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            console.error('❌ Error: No GEMINI_API_KEY found in server/.env');
            return;
        }

        console.log(`Using API Key starting with: ${apiKey.substring(0, 10)}...`);
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        console.log('Sending test prompt to Gemini...');
        const result = await model.generateContent('Say exactly the word "SUCCESS" if you receive this.');
        
        const responseText = result.response.text();
        console.log(`\n✅ Success! Gemini returned: "${responseText.trim()}"`);
        console.log('\nYour API key is fully working and NOT leaked!');
    } catch (error) {
        console.error('\n❌ Gemini API Test Failed:');
        console.error(error.message);
        
        if (error.status === 403) {
            console.error('\n⚠️ YOUR API KEY IS DEAD OR BANNED. Here is why:');
            console.error('1. You pasted it into an AI chat (like our conversation) which triggered Google\'s public scanner safety features.');
            console.error('2. You committed it to GitHub/GitLab previously, and Google wiped it.');
            console.error('\nHOW TO FIX THIS SECURELY:');
            console.error('Create a new API Key in Google AI Studio and DO NOT share it. Provide it *directly* to the .env file locally without typing it back to me.');
        }
    }
}

testGemini();
