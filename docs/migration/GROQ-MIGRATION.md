# GROQ API Configuration Instructions

## What to update in your .env file

Replace the entire DeepSeek section with the following Groq configuration:

```env
# Groq API Configuration
GROQ_API_KEY=gsk_YOUR_GROQ_API_KEY_HERE
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_MAX_TOKENS=2000
GROQ_TEMPERATURE=0.7
```

## Steps to complete the migration:

1. **Open your `.env` file**

2. **Remove or comment out the old DeepSeek lines:**
   ```env
   # DEEPSEEK_API_KEY=sk-96471d62f45345c6bb2c3e49f7243bcc
   # DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
   # DEEPSEEK_MODEL=deepseek-chat
   # DEEPSEEK_MAX_TOKENS=2000
   # DEEPSEEK_TEMPERATURE=0.7
   ```

3. **Add the new Groq configuration** (paste your Groq API key):
   ```env
   GROQ_API_KEY=gsk_YOUR_ACTUAL_KEY_HERE
   GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
   GROQ_MODEL=llama-3.3-70b-versatile
   GROQ_MAX_TOKENS=2000
   GROQ_TEMPERATURE=0.7
   ```

4. **Save the file**

5. **The server will automatically restart** (it's running with --watch flag)

## Available Groq Models:

You can change `GROQ_MODEL` to any of these (as of Dec 2025):

- `llama-3.3-70b-versatile` (default - newest, best balance)
- `llama-3.1-8b-instant` (fastest, good for simple tasks)
- `mixtral-8x7b-32768` (great for long contexts - 32K tokens)
- `gemma2-9b-it` (Google's Gemma model)
- `qwen/qwen3-32b` (Alibaba's Qwen model)

## Testing your setup:

After updating the .env file, run:
```bash
node scripts/test-groq-api.js
```

This will verify your API key is working correctly.
