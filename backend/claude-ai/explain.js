const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// POST /api/explain
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

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are Kaatupoochi, a friendly assistant that explains Git commits 
        in simple plain English for beginner developers.
        
        Explain each of these commits in ONE simple sentence that even a 
        non-developer can understand. Use simple words. 
        No technical jargon. Make it friendly.
        
        Commits:
        ${commitsText}
        
        Return a JSON array like this:
        [
          { "id": "commit_id", "simple_explanation": "You added a login button to the app" },
          ...
        ]
        Return ONLY the JSON array. Nothing else.`
      }]
    });

    const responseText = message.content[0].text;
    const cleaned = responseText.replace(/```json|```/g, '').trim();
    const explanations = JSON.parse(cleaned);

    res.json({
      success: true,
      explanations
    });

  } catch (error) {
    console.error('Claude error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;