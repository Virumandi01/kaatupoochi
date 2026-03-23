const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

// Anthropic kept for later
// const Anthropic = require('@anthropic-ai/sdk');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { commits } = req.body;

    if (!commits || commits.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No commits provided'
      });
    }

    const commitsText = commits.map((c, i) =>
      `Commit ${i + 1}: "${c.title}" by ${c.author} on ${new Date(c.date).toDateString()}.
       Changes: +${c.additions} lines added, -${c.deletions} lines removed.`
    ).join('\n');

    const prompt = `You are Kaatupoochi, a professional code change reporter.
    
    For each Git commit below, write a professional summary as if reporting 
    to a team leader or project manager. Include:
    
    1. What was changed — in simple clear words
    2. Why it matters — impact on the project
    3. Who will benefit — developers, users, or both
    
    Keep each explanation between 3-4 sentences.
    Use professional but simple language.
    No technical jargon. Anyone should understand it.
    
    Commits:
    ${commitsText}
    
    Return a JSON array like this:
    [
      { 
        "id": "commit_id", 
        "simple_explanation": "The team updated the login system to prevent crashes when a user tries to sign in without an account. This fix improves app stability and prevents users from seeing error screens. Both the development team and end users benefit from this change as it makes the app more reliable."
      }
    ]
    Return ONLY the JSON array. Nothing else. No markdown, no backticks.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text;
    const cleaned = responseText.replace(/```json|```/g, '').trim();
    const explanations = JSON.parse(cleaned);

    res.json({
      success: true,
      explanations
    });

  } catch (error) {
    console.error('Gemini error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;