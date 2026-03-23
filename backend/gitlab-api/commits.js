const express = require('express');
const router = express.Router();
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// GET /api/github/commits/:owner/:repo/all
router.get('/:owner/:repo/all', async (req, res) => {
  try {
    const { owner, repo } = req.params;

    // fetch up to 365 days of commits
    const since = new Date();
    since.setFullYear(since.getFullYear() - 1);

    let allCommits = [];
    let page = 1;

    while (true) {
      const { data } = await octokit.repos.listCommits({
        owner,
        repo,
        since: since.toISOString(),
        per_page: 100,
        page,
      });

      if (data.length === 0) break;
      allCommits = allCommits.concat(data);
      if (data.length < 100) break;
      page++;
    }

    // group commits by date
    const commitsByDate = {};
    allCommits.forEach(commit => {
      const date = commit.commit.author.date.split('T')[0];
      if (!commitsByDate[date]) {
        commitsByDate[date] = [];
      }
      commitsByDate[date].push({
        id: commit.sha,
        short_id: commit.sha.substring(0, 7),
        title: commit.commit.message.split('\n')[0],
        author: commit.commit.author.name,
        time: commit.commit.author.date,
      });
    });

    res.json({
      success: true,
      platform: 'github',
      owner,
      repo,
      total_commits: allCommits.length,
      commits_by_date: commitsByDate,
    });

  } catch (error) {
    console.error('GitHub error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/github/commits/:owner/:repo/detail/:sha
router.get('/:owner/:repo/detail/:sha', async (req, res) => {
  try {
    const { owner, repo, sha } = req.params;

    const { data } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: sha,
    });

    res.json({
      success: true,
      commit: {
        id: data.sha,
        short_id: data.sha.substring(0, 7),
        title: data.commit.message.split('\n')[0],
        message: data.commit.message,
        author: data.commit.author.name,
        date: data.commit.author.date,
        additions: data.stats?.additions || 0,
        deletions: data.stats?.deletions || 0,
        files_changed: data.files?.length || 0,
        files: data.files?.map(f => ({
          name: f.filename,
          status: f.status,
          additions: f.additions,
          deletions: f.deletions,
        })) || [],
      }
    });

  } catch (error) {
    console.error('GitHub detail error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// keep old route for backward compatibility
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
      files: [],
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