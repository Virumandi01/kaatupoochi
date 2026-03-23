const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

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
      `Index ${i}: "${c.title}" by ${c.author} on ${new Date(c.date).toDateString()}.
       Changes: +${c.additions} lines added, -${c.deletions} lines removed, ${c.files_changed} files changed.`
    ).join('\n');

    const prompt = `You are Kaatupoochi, a professional code change reporter.
    
    For each Git commit below, write a professional summary as if reporting 
    to a team leader. Include what changed, why it matters, and who benefits.
    Keep each explanation 2-3 sentences. Simple clear language.
    
    Commits:
    ${commitsText}
    
    Return a JSON array. Use the exact index number provided.
    Example format:
    [
      { "index": 0, "simple_explanation": "The team fixed a bug in the login screen that was causing crashes. This improves stability for all users trying to sign in." },
      { "index": 1, "simple_explanation": "A new feature was added to the dashboard showing user activity. This helps team leaders monitor usage patterns." }
    ]
    Return ONLY the JSON array. No markdown. No backticks. No extra text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text;
    console.log('Gemini raw response:', responseText);
    
    const cleaned = responseText.replace(/```json|```/g, '').trim();
    const explanations = JSON.parse(cleaned);

    // Map index back to commit id
    const mapped = explanations.map((e) => ({
      id: commits[e.index]?.id,
      simple_explanation: e.simple_explanation,
    }));

    res.json({
      success: true,
      explanations: mapped
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