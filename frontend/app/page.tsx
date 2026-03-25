/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import RepoInput from './components/RepoInput';
import Calendar from './components/Calendar';
import CommitList from './components/CommitList';
import DetailView from './components/DetailView';
import ReadmeView from './components/ReadmeView';
import YearSelector from './components/YearSelector';

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
  const [repoInfo, setRepoInfo] = useState<any>(null);
  const [totalCommits, setTotalCommits] = useState(0);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [loadingBranch, setLoadingBranch] = useState(false);
  const [loadedSince, setLoadedSince] = useState<string>('');
  const [loadedUntil, setLoadedUntil] = useState<string>('');
  const [readmeContent, setReadmeContent] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loadingYear, setLoadingYear] = useState(false);
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');

  // Background load full year
  useEffect(() => {
    if (!started || !owner || !repo || !selectedYear) return;

    const loadFullYear = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/github/commits/${owner}/${repo}/year/${selectedYear}?branch=${selectedBranch}`
        );
        setCommitsByDate(prev => ({
          ...prev,
          ...res.data.commits_by_date,
        }));
        setTotalCommits(res.data.total_commits);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      console.log('Background year load failed');
      }
    };

    const timer = setTimeout(loadFullYear, 2000);
    return () => clearTimeout(timer);
  }, [started, owner, repo, selectedYear, selectedBranch]);

  const handleFetch = async (platform: string, repoDetails: string) => {
    setLoadingRepo(true);
    try {
      const parts = repoDetails.trim().split('/');
      const ownerPart = parts[0]?.trim();
      const repoPart = parts[1]?.trim();

      if (!ownerPart || !repoPart) {
        alert('Please enter as owner/repo');
        setLoadingRepo(false);
        return;
      }

      setOwner(ownerPart);
      setRepo(repoPart);

      // Get repo info first
      const infoRes = await axios.get(
        `http://localhost:3000/api/github/commits/${ownerPart}/${repoPart}/repoinfo`
      );
      setRepoInfo(infoRes.data);

      const latestYear = infoRes.data.latest_commit_year;
      setSelectedYear(latestYear);

      // Get recent month commits
      const res = await axios.get(
        `http://localhost:3000/api/github/commits/${ownerPart}/${repoPart}/all?branch=${infoRes.data.default_branch}`
      );
      setCommitsByDate(res.data.commits_by_date);
      setTotalCommits(res.data.total_commits);
      setLoadedSince(res.data.loaded_since);
      setLoadedUntil(res.data.loaded_until);

      // Get branches
      const branchRes = await axios.get(
        `http://localhost:3000/api/github/commits/${ownerPart}/${repoPart}/branches`
      );
      setBranches(branchRes.data.branches);
      setSelectedBranch(infoRes.data.default_branch);

      // Get README
      try {
        const readmeRes = await axios.get(
          `http://localhost:3000/api/github/commits/${ownerPart}/${repoPart}/readme`
        );
        setReadmeContent(readmeRes.data.content);
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        setReadmeContent('');
      }

      setStarted(true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      alert('Could not fetch repo. Check your details.');
    }
    setLoadingRepo(false);
  };

  const handleDayClick = (date: string, commits: any[]) => {
    setSelectedDate(date);
    setSelectedCommits(commits);
    setSelectedCommitId(null);
    setCommitDetail(null);
    setExplanation('');
  };

  const handleCommitClick = async (commitId: string) => {
    setSelectedCommitId(commitId);
    setLoadingDetail(true);
    setExplanation('');
    setCommitDetail(null);

    try {
      const detailRes = await axios.get(
        `http://localhost:3000/api/github/commits/${owner}/${repo}/detail/${commitId}`
      );
      const detail = detailRes.data.commit;
      setCommitDetail(detail);

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
    setCommitsByDate({});

    try {
      const res = await axios.get(
        `http://localhost:3000/api/github/commits/${owner}/${repo}/all?branch=${branchName}`
      );
      setCommitsByDate(res.data.commits_by_date);
      setTotalCommits(res.data.total_commits);
      setLoadedSince(res.data.loaded_since);
      setLoadedUntil(res.data.loaded_until);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      alert('Could not fetch branch commits.');
    }
    setLoadingBranch(false);
  };

  const handleYearChange = async (year: number) => {
    setSelectedYear(year);
    setLoadingYear(true);
    setSelectedDate(null);
    setSelectedCommits([]);
    setSelectedCommitId(null);
    setCommitDetail(null);
    setExplanation('');
    setCommitsByDate({});

    try {
      const res = await axios.get(
        `http://localhost:3000/api/github/commits/${owner}/${repo}/year/${year}?branch=${selectedBranch}`
      );
      setCommitsByDate(res.data.commits_by_date);
      setTotalCommits(res.data.total_commits);
      setLoadedSince(`${year}-01-01T00:00:00Z`);
      setLoadedUntil(`${year}-12-31T23:59:59Z`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      alert('Could not load year.');
    }
    setLoadingYear(false);
  };

  const handleHomeClick = () => {
    setSelectedDate(null);
    setSelectedCommits([]);
    setSelectedCommitId(null);
    setCommitDetail(null);
    setExplanation('');
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
    setLoadedSince('');
    setLoadedUntil('');
    setReadmeContent('');
    setRepoInfo(null);
    setOwner('');
    setRepo('');
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-green-400">
            Kaatupoochi
          </h1>
          {started && (
            <button
              onClick={handleHomeClick}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700
                         rounded-lg text-gray-400 text-xs transition-all"
              title="Go to README"
            >
              Home
            </button>
          )}
        </div>

        {started && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white text-sm font-medium">
                {owner}/{repo}
              </p>
              <p className="text-gray-500 text-xs">
                {repoInfo?.description || ''}
              </p>
              <p className="text-gray-600 text-xs">
                {totalCommits} commits loaded
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

          {/* Calendar */}
          <div className="bg-gray-900 rounded-2xl p-5">

            {/* Calendar top bar */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">

              {/* Year selector — top left */}
              <YearSelector
                years={repoInfo?.years || []}
                selectedYear={selectedYear}
                onYearChange={handleYearChange}
                loading={loadingYear}
              />

              {/* Center label */}
              <p className="text-gray-500 text-xs uppercase tracking-widest">
                Commit activity — click any green day
              </p>

              {/* Right side — branch */}
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

            {/* Calendar grid */}
            <Calendar
              commitsByDate={commitsByDate}
              onDayClick={handleDayClick}
              selectedDate={selectedDate}
              selectedBranch={selectedBranch}
              loadedSince={loadedSince}
              loadedUntil={loadedUntil}
            />
          </div>

          {/* Bottom panels */}
          {selectedDate ? (
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <CommitList
                  date={selectedDate}
                  commits={selectedCommits}
                  selectedCommit={selectedCommitId}
                  onCommitClick={handleCommitClick}
                />
              </div>
              <div className="col-span-3">
                <DetailView
                  commit={commitDetail}
                  explanation={explanation}
                  loading={loadingDetail}
                />
              </div>
            </div>
          ) : (
            <div>
              {/* README */}
              {readmeContent ? (
                <ReadmeView
                  content={readmeContent}
                  repoName={`${owner}/${repo}`}
                />
              ) : (
                <div className="text-center py-12">
                  {totalCommits === 0 ? (
                    <>
                      <p className="text-gray-600 text-lg">
                        No commits found for this year or branch
                      </p>
                      <p className="text-gray-700 text-sm mt-2">
                        Try selecting a different year or branch
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
        </div>
      )}
    </main>
  );
}