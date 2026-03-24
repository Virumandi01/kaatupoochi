/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import axios from 'axios';
import RepoInput from './components/RepoInput';
import Calendar from './components/Calendar';
import CommitList from './components/CommitList';
import DetailView from './components/DetailView';

export default function Home() {
const [commitsByDate, setCommitsByDate] = useState<Record<string, any[]>>({});
const [selectedDate, setSelectedDate] = useState<string | null>(null);
const [selectedCommits, setSelectedCommits] = useState<any[]>([]);
const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);
const [commitDetail, setCommitDetail] = useState<any>(null);
const [explanation, setExplanation] = useState('');
const [loadingRepo, setLoadingRepo] = useState(false);
const [loadingDetail, setLoadingDetail] = useState(false);
const [started, setStarted] = useState(false);
const [repoInfo, setRepoInfo] = useState({ platform: '', owner: '', repo: '' });
const [totalCommits, setTotalCommits] = useState(0);
const [branches, setBranches] = useState<any[]>([]);
const [selectedBranch, setSelectedBranch] = useState('main');
const [loadingBranch, setLoadingBranch] = useState(false);
  // Fetch all commits for the year
  const handleFetch = async (platform: string, repoDetails: string) => {
    setLoadingRepo(true);
    try {
      const parts = repoDetails.trim().split('/');
      const owner = parts[0]?.trim();
      const repo = parts[1]?.trim();

      if (!owner || !repo) {
        alert('Please enter as owner/repo');
        setLoadingRepo(false);
        return;
      }

      const res = await axios.get(
        `http://localhost:3000/api/github/commits/${owner}/${repo}/all`
      );

      setCommitsByDate(res.data.commits_by_date);
setTotalCommits(res.data.total_commits);
setRepoInfo({ platform, owner, repo });

// fetch branches
const branchRes = await axios.get(
  `http://localhost:3000/api/github/commits/${owner}/${repo}/branches`
);
setBranches(branchRes.data.branches);

// set default branch
const defaultBranch = branchRes.data.branches.find(
  (b: any) => b.isDefault
)?.name || 'main';
setSelectedBranch(defaultBranch);
setStarted(true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      alert('Could not fetch repo. Check your details.');
    }
    setLoadingRepo(false);
  };

  // When a day is clicked on calendar
  const handleDayClick = (date: string, commits: any[]) => {
    setSelectedDate(date);
    setSelectedCommits(commits);
    setSelectedCommitId(null);
    setCommitDetail(null);
    setExplanation('');
  };

  // When a commit is clicked on left panel
  const handleCommitClick = async (commitId: string) => {
    setSelectedCommitId(commitId);
    setLoadingDetail(true);
    setExplanation('');
    setCommitDetail(null);

    try {
      // Get commit details
      const detailRes = await axios.get(
        `http://localhost:3000/api/github/commits/${repoInfo.owner}/${repoInfo.repo}/detail/${commitId}`
      );
      const detail = detailRes.data.commit;
      setCommitDetail(detail);

      // Get AI explanation
      const explainRes = await axios.post(
        'http://localhost:3000/api/explain',
        { commits: [detail] }
      );
      const exp = explainRes.data.explanations[0]?.simple_explanation || 'No explanation available';
      setExplanation(exp);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setExplanation('Could not load explanation.');
    }
    setLoadingDetail(false);
  };
  const handleBranchChange = async (branchName: string) => {
  setSelectedBranch(branchName);
  setLoadingBranch(true);
  setSelectedDate(null);
  setSelectedCommits([]);
  setSelectedCommitId(null);
  setCommitDetail(null);
  setExplanation('');

  try {
    const res = await axios.get(
      `http://localhost:3000/api/github/commits/${repoInfo.owner}/${repoInfo.repo}/all?branch=${branchName}`
    );
    setCommitsByDate(res.data.commits_by_date);
    setTotalCommits(res.data.total_commits);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    alert('Could not fetch branch commits.');
  }
  setLoadingBranch(false);
};
  const handleReset = () => {
  setStarted(false);
  setCommitsByDate({});
  setSelectedDate(null);
  setSelectedCommits([]);
  setSelectedCommitId(null);
  setCommitDetail(null);
  setExplanation('');
  setBranches([]);
  setSelectedBranch('main');
};

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-400">
            Kaatupoochi
          </h1>
          <p className="text-gray-500 text-sm">
            Git history — made human
          </p>
        </div>
        {started && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white text-sm font-medium">
                {repoInfo.owner}/{repoInfo.repo}
              </p>
              <p className="text-gray-500 text-xs">
                {totalCommits} commits in the past year
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700
                         rounded-xl text-gray-400 text-sm transition-all"
            >
              Change repo
            </button>
          </div>
        )}
      </div>

      {!started ? (
        <div className="flex items-center justify-center min-h-96">
          <RepoInput onFetch={handleFetch} loading={loadingRepo} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* Calendar — full width on top */}
<div className="bg-gray-900 rounded-2xl p-5">
  <div className="flex items-center justify-between mb-4">
    <p className="text-gray-500 text-xs uppercase tracking-widest">
      Commit activity — click any green day
    </p>

    {/* Branch selector */}
    <div className="flex items-center gap-2">
      {loadingBranch && (
        <span className="text-gray-500 text-xs">Loading...</span>
      )}
      <select
        value={selectedBranch}
        onChange={(e) => handleBranchChange(e.target.value)}
        className="bg-gray-800 text-white text-sm rounded-xl
                   px-3 py-2 border border-gray-700
                   focus:outline-none focus:border-green-400
                   cursor-pointer max-w-48"
      >
        {branches.map((branch: any) => (
          <option key={branch.name} value={branch.name}>
            {branch.name}
          </option>
        ))}
      </select>
    </div>
  </div>

  <Calendar
    commitsByDate={commitsByDate}
    onDayClick={handleDayClick}
    selectedDate={selectedDate}
    selectedBranch={selectedBranch}
  />
</div>

          {/* Bottom — left panel + right panel */}
          {selectedDate && (
            <div className="grid grid-cols-4 gap-4">
              {/* Left — commit list */}
              <div className="col-span-1">
                <CommitList
                  date={selectedDate}
                  commits={selectedCommits}
                  selectedCommit={selectedCommitId}
                  onCommitClick={handleCommitClick}
                />
              </div>

              {/* Right — detail view */}
              <div className="col-span-3">
                <DetailView
                  commit={commitDetail}
                  explanation={explanation}
                  loading={loadingDetail}
                />
              </div>
            </div>
          )}

         {/* No day selected message */}
          {!selectedDate && (
            <div className="text-center py-12">
              {totalCommits === 0 ? (
                <>
                  <p className="text-gray-600 text-lg">
                    No commits in the past year for this branch
                  </p>
                  <p className="text-gray-700 text-sm mt-2">
                    Try selecting a different branch from the dropdown
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-lg">
                    Click any green square on the calendar above
                  </p>
                  <p className="text-gray-700 text-sm mt-2">
                    Green days have commits — darker green means more commits
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}