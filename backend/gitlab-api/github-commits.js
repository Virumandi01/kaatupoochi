const express = require('express');
const router = express.Router();
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// GET /api/github/commits/:owner/:repo
router.get('/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { limit = 10 } = req.query;

    const { data: commits } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: limit,
    });

    const cleanCommits = commits.map(commit => ({
      id: commit.sha,
      short_id: commit.sha.substring(0, 7),
      title: commit.commit.message.split('\n')[0],
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      additions: 0,
      deletions: 0,
      files_changed: 0,
    }));

    res.json({
      success: true,
      platform: 'github',
      owner,
      repo,
      total: cleanCommits.length,
      commits: cleanCommits,
    });

  } catch (error) {
    console.error('GitHub error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;