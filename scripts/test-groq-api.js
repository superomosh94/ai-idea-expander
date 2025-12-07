// Test DeepSeek API connection using OpenAI SDK
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const OpenAI = require('openai');

async function testDeepSeekAPI() {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    console.log('\n🔍 Testing DeepSeek API Connection using OpenAI SDK...\n');
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'NOT SET');
    console.log('Model:', process.env.DEEPSEEK_MODEL || 'deepseek-chat');

    if (!apiKey || apiKey === 'your-deepseek-api-key-here') {
        console.log('\n❌ API key not configured in .env file');
        console.log('Please update DEEPSEEK_API_KEY in your .env file\n');
        process.exit(1);
    }

    try {
        // Initialize OpenAI client with DeepSeek base URL (as per official docs)
        const openai = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: apiKey
        });

        console.log('\n📡 Sending test request...\n');

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Say "API test successful!" if you can read this.' }
            ],
            model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
            max_tokens: 50
        });

        console.log('✅ API Connection Successful!\n');
        console.log('Response:', completion.choices[0].message.content);
        console.log('\nUsage:');
        console.log('  - Prompt tokens:', completion.usage.prompt_tokens);
        console.log('  - Completion tokens:', completion.usage.completion_tokens);
        console.log('  - Total tokens:', completion.usage.total_tokens);
        console.log('\n✨ Your DeepSeek API is configured correctly!\n');

    } catch (error) {
        console.log('\n❌ API Error:', error.message);

        if (error.status) {
            console.log('Status code:', error.status);
        }

        if (error.message.includes('Insufficient')) {
            console.log('\n💡 TIP: Your API key is valid but your account needs credits.');
            console.log('   Visit: https://platform.deepseek.com/top_up');
        } else if (error.message.includes('invalid')) {
            console.log('\n💡 TIP: Your API key appears to be invalid.');
            console.log('   Visit: https://platform.deepseek.com/api_keys');
        }

        console.log('\n');
    }
}

testDeepSeekAPI();
