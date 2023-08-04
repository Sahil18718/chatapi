const express = require('express');
const bodyParser = require('body-parser');
const openai = require('openai');
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 2000;
app.use(cors());
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


// Handle code quality assessment requests
app.post('/assess-quality', async (req, res) => {
  const { code } = req.body;

  const prompt = `
    Evaluate the quality of the following code:
    Code Consistency: <Assess code for consistent style, naming conventions, and formatting>
    Code Performance: <Assess code for efficient algorithms, optimized data structures, and overall performance>
    Code Documentation: <Review code for comments, inline documentation, and clear explanations of logic>
    Error Handling: <Examine code for proper error handling and graceful error recovery>
    Code Testability: <Evaluate code for ease of testing, mocking, and overall testability>
    Code Modularity: <Assess code for modular design, separation of concerns, and reusability>
    Code Complexity: <Analyze code for complexity, convoluted logic, and potential code smells>
    Code Duplication: <Identify code duplication and assess its impact on maintainability>
    Code Readability: <Evaluate code for readability, clarity, and adherence to coding best practices>
    Code:
    ${code}
  `;

  try {
    const response = await openai.Completion.create({
      engine: 'davinci-codex',
      prompt: prompt,
      max_tokens: 150,
    });

    const qualityAssessment = response.choices[0].text.trim();
    res.json({ qualityAssessment });
  } catch (error) {
    console.error('Code quality assessment failed:', error);
    res.status(500).json({ error: 'Code quality assessment failed' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
