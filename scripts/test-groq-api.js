// Test Groq API connection using OpenAI SDK
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const OpenAI = require('openai');

async function testGroqAPI() {
    const apiKey = process.env.GROQ_API_KEY;

    console.log('\n🔍 Testing Groq API Connection using OpenAI SDK...\n');
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'NOT SET');
    console.log('Model:', process.env.GROQ_MODEL || 'llama-3.3-70b-versatile');

    if (!apiKey || apiKey === 'your-groq-api-key-here') {
        console.log('\n❌ API key not configured in .env file');
        console.log('Please update GROQ_API_KEY in your .env file\n');
        process.exit(1);
    }

    try {
        // Initialize OpenAI client with Groq base URL
        const openai = new OpenAI({
            baseURL: 'https://api.groq.com/openai/v1',
            apiKey: apiKey
        });

        console.log('\n📡 Sending test request...\n');

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Say "API test successful!" if you can read this.' }
            ],
            model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
            max_tokens: 50
        });

        console.log('✅ API Connection Successful!\n');
        console.log('Response:', completion.choices[0].message.content);
        console.log('\nUsage:');
        console.log('  - Prompt tokens:', completion.usage.prompt_tokens);
        console.log('  - Completion tokens:', completion.usage.completion_tokens);
        console.log('  - Total tokens:', completion.usage.total_tokens);
        console.log('\n✨ Your Groq API is configured correctly!\n');

    } catch (error) {
        console.log('\n❌ API Error:', error.message);

        if (error.status) {
            console.log('Status code:', error.status);
        }

        if (error.message.includes('rate limit')) {
            console.log('\n💡 TIP: You hit the rate limit. Wait a moment and try again.');
            console.log('   Visit: https://console.groq.com/settings/limits');
        } else if (error.message.includes('invalid') || error.message.includes('Unauthorized')) {
            console.log('\n💡 TIP: Your API key appears to be invalid.');
            console.log('   Visit: https://console.groq.com/keys');
        }

        console.log('\n');
    }
}

testGroqAPI();
