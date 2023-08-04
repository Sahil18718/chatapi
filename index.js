const express = require('express');
const bodyParser = require('body-parser');
const openai = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Set your OpenAI API key
openai.apiKey = process.env.OPENAI_API_KEY;

// Handle code conversion requests
app.post('/convert', async (req, res) => {
  const { code, targetLanguage } = req.body;

  const prompt = `Convert the following code to ${targetLanguage}:\n${code}`;

  try {
    const response = await openai.Completion.create({
      engine: 'davinci-codex',
      prompt: prompt,
      max_tokens: 100,
    });

    const convertedCode = response.choices[0].text.trim();
    res.json({ convertedCode });
  } catch (error) {
    console.error('Code conversion failed:', error);
    res.status(500).json({ error: 'Code conversion failed' });
  }
});


// Handle code debugging requests
app.post('/debug', async (req, res) => {
  const { code } = req.body;

  const prompt = `Debug the following code:\n${code}`;

  try {
    const response = await openai.Completion.create({
      engine: 'davinci-codex',
      prompt: prompt,
      max_tokens: 100,
    });

    const debugOutput = response.choices[0].text.trim();
    res.json({ debugOutput });
  } catch (error) {
    console.error('Code debugging failed:', error);
    res.status(500).json({ error: 'Code debugging failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
