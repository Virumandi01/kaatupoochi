const express = require('express');
const router = express.Router();
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// 1. repoinfo
router.get('/:owner/:repo/repoinfo', async (req, res) => {
  try {
    const { owner, repo } = req.params;

    const { data } = await octokit.repos.get({
      owner,
      repo,
    });

    const createdYear = new Date(data.created_at).getFullYear();
    const currentYear = new Date().getFullYear();

    const years = [];
    for (let y = currentYear; y >= createdYear; y--) {
      years.push(y);
    }

    const latestCommitRes = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 1,
    });

    const latestCommitYear = latestCommitRes.data.length > 0
      ? new Date(latestCommitRes.data[0].commit.author.date).getFullYear()
      : currentYear;

    res.json({
      success: true,
      name: data.full_name,
      description: data.description,
      created_year: createdYear,
      latest_commit_year: latestCommitYear,
      years,
      default_branch: data.default_branch,
    });

  } catch (error) {
    console.error('Repo info error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. readme
router.get('/:owner/:repo/readme', async (req, res) => {
  try {
    const { owner, repo } = req.params;

    const { data } = await octokit.repos.getReadme({
      owner,
      repo,
    });

    const content = Buffer.from(data.content, 'base64').toString('utf8');

    res.json({
      success: true,
      content,
      name: data.name,
    });

  } catch (error) {
    console.error('README error:', error.message);
    res.status(404).json({ success: false, error: 'No README found' });
  }
});

// 3. branches
router.get('/:owner/:repo/branches', async (req, res) => {
  try {
    const { owner, repo } = req.params;

    const { data } = await octokit.repos.listBranches({
      owner,
      repo,
      per_page: 100,
    });

    const branches = data.map(b => ({
      name: b.name,
      isDefault: b.name === 'main' || b.name === 'master',
    }));

    res.json({ success: true, branches });

  } catch (error) {
    console.error('Branches error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. all commits with date range
router.get('/:owner/:repo/all', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { branch = 'main', months = 3, since: sinceParam, until: untilParam } = req.query;

    const since = sinceParam
      ? new Date(sinceParam)
      : new Date(new Date().setMonth(new Date().getMonth() - Number(months)));

    const until = untilParam
      ? new Date(untilParam)
      : new Date();

    let allCommits = [];
    let page = 1;

    while (true) {
      const { data } = await octokit.repos.listCommits({
        owner,
        repo,
        sha: branch,
        since: since.toISOString(),
        until: until.toISOString(),
        per_page: 100,
        page,
      });

      if (data.length === 0) break;
      allCommits = allCommits.concat(data);
      if (data.length < 100) break;
      page++;
    }

    const commitsByDate = {};
    allCommits.forEach(commit => {
      const date = commit.commit.author.date.split('T')[0];
      if (!commitsByDate[date]) commitsByDate[date] = [];
      commitsByDate[date].push({
        id: commit.sha,
        short_id: commit.sha.substring(0, 7),
        title: commit.commit.message.split('\n')[0],
        author: commit.commit.author.name,
        time: commit.commit.author.date,
      });
    });

    const oldestInRange = allCommits[allCommits.length - 1];
    let hasMore = false;

    if (oldestInRange) {
      const checkOlder = await octokit.repos.listCommits({
        owner,
        repo,
        sha: branch,
        until: since.toISOString(),
        per_page: 1,
      });
      hasMore = checkOlder.data.length > 0;
    }

    res.json({
      success: true,
      platform: 'github',
      owner,
      repo,
      total_commits: allCommits.length,
      commits_by_date: commitsByDate,
      has_more: hasMore,
      loaded_since: since.toISOString(),
      loaded_until: until.toISOString(),
    });

  } catch (error) {
    console.error('GitHub error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. year commits
router.get('/:owner/:repo/year/:year', async (req, res) => {
  try {
    const { owner, repo, year } = req.params;
    const { branch = 'main' } = req.query;

    const since = new Date(`${year}-01-01T00:00:00Z`);
    const until = new Date(`${year}-12-31T23:59:59Z`);

    let allCommits = [];
    let page = 1;

    while (true) {
      const { data } = await octokit.repos.listCommits({
        owner,
        repo,
        sha: branch,
        since: since.toISOString(),
        until: until.toISOString(),
        per_page: 100,
        page,
      });

      if (data.length === 0) break;
      allCommits = allCommits.concat(data);
      if (data.length < 100) break;
      page++;
    }

    const commitsByDate = {};
    allCommits.forEach(commit => {
      const date = commit.commit.author.date.split('T')[0];
      if (!commitsByDate[date]) commitsByDate[date] = [];
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
      year,
      total_commits: allCommits.length,
      commits_by_date: commitsByDate,
    });

  } catch (error) {
    console.error('Year commits error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. single commit detail
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
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. LAST — basic commits list
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
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;