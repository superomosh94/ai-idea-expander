// Comprehensive Groq API Test
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const OpenAI = require('openai');

async function testGroqComprehensive() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('      🧪 COMPREHENSIVE GROQ API INTEGRATION TEST');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    console.log('📋 Configuration:');
    console.log(`   API Key: ${apiKey ? `${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 4)}` : '❌ NOT SET'}`);
    console.log(`   Model: ${model}`);
    console.log(`   Max Tokens: ${process.env.GROQ_MAX_TOKENS || 2000}`);
    console.log(`   Temperature: ${process.env.GROQ_TEMPERATURE || 0.7}\n`);

    if (!apiKey || apiKey.includes('YOUR') || apiKey.includes('your')) {
        console.log('❌ ERROR: API key not configured properly in .env file');
        console.log('   Please update GROQ_API_KEY in your .env file\n');
        console.log('   Get your key from: https://console.groq.com/keys\n');
        process.exit(1);
    }

    try {
        // Test 1: Basic Connection
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('TEST 1: Basic Connection Test');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        const openai = new OpenAI({
            baseURL: 'https://api.groq.com/openai/v1',
            apiKey: apiKey
        });

        console.log('📡 Sending basic test request...');
        const startTime = Date.now();

        const basicTest = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Say "Hello! API test successful!" and nothing else.' }
            ],
            model: model,
            max_tokens: 20
        });

        const responseTime = Date.now() - startTime;

        console.log('\n✅ Connection successful!');
        console.log(`   Response: "${basicTest.choices[0].message.content}"`);
        console.log(`   Response time: ${responseTime}ms`);
        console.log(`   Tokens used: ${basicTest.usage.total_tokens} (${basicTest.usage.prompt_tokens} prompt + ${basicTest.usage.completion_tokens} completion)\n`);

        // Test 2: Idea Expansion (Full Test)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('TEST 2: Idea Expansion Test (Real Use Case)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        const testIdea = 'A mobile app for learning programming through interactive coding challenges';

        console.log(`📝 Test Idea: "${testIdea}"`);
        console.log('📡 Sending expansion request...\n');

        const expansionStart = Date.now();

        const expansion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an expert product strategist. Analyze business ideas with these sections:

## Problem Statement
Define the problem and market gaps.

## Target Users
Describe ideal users, demographics, and needs.

## Core Features
List essential features, prioritize MVP.

## User Workflow  
Outline user journey and interactions.

## Risks & Challenges
Identify obstacles and market risks.

## Success Metrics
Define KPIs and success measures.

Use clear markdown formatting.`
                },
                {
                    role: 'user',
                    content: `Expand and analyze: "${testIdea}"`
                }
            ],
            model: model,
            max_tokens: parseInt(process.env.GROQ_MAX_TOKENS) || 2000,
            temperature: parseFloat(process.env.GROQ_TEMPERATURE) || 0.7
        });

        const expansionTime = Date.now() - expansionStart;
        const expandedContent = expansion.choices[0].message.content;

        console.log('✅ Expansion successful!');
        console.log(`   Response time: ${expansionTime}ms`);
        console.log(`   Tokens used: ${expansion.usage.total_tokens}\n`);

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('EXPANDED IDEA CONTENT:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log(expandedContent);
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Test section parsing
        const sections = {
            problem: expandedContent.match(/##\s*Problem Statement\s*\n([\s\S]*?)(?=##|$)/i)?.[1]?.trim(),
            users: expandedContent.match(/##\s*Target Users\s*\n([\s\S]*?)(?=##|$)/i)?.[1]?.trim(),
            features: expandedContent.match(/##\s*Core Features\s*\n([\s\S]*?)(?=##|$)/i)?.[1]?.trim(),
            workflow: expandedContent.match(/##\s*User Workflow\s*\n([\s\S]*?)(?=##|$)/i)?.[1]?.trim(),
            risks: expandedContent.match(/##\s*Risks?\s*(?:&|and)?\s*Challenges?\s*\n([\s\S]*?)(?=##|$)/i)?.[1]?.trim(),
            metrics: expandedContent.match(/##\s*Success Metrics\s*\n([\s\S]*?)(?=##|$)/i)?.[1]?.trim()
        };

        console.log('📊 Section Parsing Results:');
        console.log(`   ✓ Problem Statement: ${sections.problem ? '✅ Found' : '❌ Not found'}`);
        console.log(`   ✓ Target Users: ${sections.users ? '✅ Found' : '❌ Not found'}`);
        console.log(`   ✓ Core Features: ${sections.features ? '✅ Found' : '❌ Not found'}`);
        console.log(`   ✓ User Workflow: ${sections.workflow ? '✅ Found' : '❌ Not found'}`);
        console.log(`   ✓ Risks & Challenges: ${sections.risks ? '✅ Found' : '❌ Not found'}`);
        console.log(`   ✓ Success Metrics: ${sections.metrics ? '✅ Found' : '❌ Not found'}\n`);

        // Final summary
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('                    ✅ ALL TESTS PASSED!');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('\n📈 Performance Summary:');
        console.log(`   • Basic test: ${responseTime}ms`);
        console.log(`   • Idea expansion: ${expansionTime}ms`);
        console.log(`   • Average speed: ~${Math.round((basicTest.usage.completion_tokens / (responseTime / 1000)) + (expansion.usage.completion_tokens / (expansionTime / 1000))) / 2} tokens/sec`);
        console.log('\n💰 Token Usage:');
        console.log(`   • Basic test: ${basicTest.usage.total_tokens} tokens`);
        console.log(`   • Idea expansion: ${expansion.usage.total_tokens} tokens`);
        console.log(`   • Total: ${basicTest.usage.total_tokens + expansion.usage.total_tokens} tokens`);
        console.log('\n✨ Your Groq API integration is working perfectly!');
        console.log('   The app is ready to expand ideas using Groq AI.\n');

    } catch (error) {
        console.log('\n❌ TEST FAILED');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log(`Error: ${error.message}\n`);

        if (error.status) {
            console.log(`Status Code: ${error.status}`);
        }

        if (error.message.includes('rate limit')) {
            console.log('\n💡 TIP: You hit the rate limit. Wait a moment and try again.');
            console.log('   Visit: https://console.groq.com/settings/limits');
        } else if (error.message.includes('invalid') || error.message.includes('Unauthorized')) {
            console.log('\n💡 TIP: Your API key appears to be invalid.');
            console.log('   Visit: https://console.groq.com/keys to get a new key');
        } else if (error.message.includes('decommissioned') || error.message.includes('deprecated')) {
            console.log('\n💡 TIP: The model is deprecated. Update GROQ_MODEL in .env to:');
            console.log('   GROQ_MODEL=llama-3.3-70b-versatile');
        }

        console.log('\n');
        process.exit(1);
    }
}

testGroqComprehensive();
