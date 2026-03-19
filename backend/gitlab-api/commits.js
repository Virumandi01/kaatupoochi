const express = require('express');
const router = express.Router();
const { Gitlab } = require('@gitbeaker/rest');

const gitlab = new Gitlab({
  token: process.env.GITLAB_TOKEN,
  host: process.env.GITLAB_URL,
});

// GET /api/commits/:projectId
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 10 } = req.query;

    const commits = await gitlab.Commits.all(projectId, {
      maxPages: 1,
      perPage: limit,
    });

    const cleanCommits = commits.map(commit => ({
      id: commit.id,
      short_id: commit.short_id,
      title: commit.title,
      message: commit.message,
      author: commit.author_name,
      date: commit.created_at,
      files_changed: commit.stats?.total || 0,
      additions: commit.stats?.additions || 0,
      deletions: commit.stats?.deletions || 0,
    }));

    res.json({
      success: true,
      project: projectId,
      total: cleanCommits.length,
      commits: cleanCommits
    });

  } catch (error) {
    console.error('GitLab error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;