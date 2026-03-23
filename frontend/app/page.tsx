/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import axios from 'axios';
import RepoInput from './components/RepoInput';
import Slideshow from './components/Slideshow';

export default function Home() {
  const [commits, setCommits] = useState<any[]>([]);
  const [explanations, setExplanations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const handleFetch = async (
    platform: string,
    repoDetails: string
  ) => {
    setLoading(true);
    try {
      let fetchUrl = '';

      if (platform === 'github') {
        const parts = repoDetails.trim().split('/');
        const owner = parts[0]?.trim();
        const repo = parts[1]?.trim();

        console.log('Owner:', owner);
        console.log('Repo:', repo);

        if (!owner || !repo || repo === 'undefined') {
          alert('Please enter owner and repo name in both boxes');
          setLoading(false);
          return;
        }

        fetchUrl = `http://localhost:3000/api/github/commits/${owner}/${repo}?limit=10`;

      } else {
        fetchUrl = `http://localhost:3000/api/commits/${repoDetails}?limit=10`;
      }

      const res = await axios.get(fetchUrl);
      const fetchedCommits = res.data.commits;
      setCommits(fetchedCommits);

      const explainRes = await axios.post(
        'http://localhost:3000/api/explain',
        { commits: fetchedCommits }
      );
      setExplanations(explainRes.data.explanations);
      setStarted(true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      alert('Could not fetch commits. Check your repo details.');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStarted(false);
    setCommits([]);
    setExplanations([]);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-green-400 mb-2">
          Kaatupoochi
        </h1>
        <p className="text-gray-400 text-lg">
          Git history — made human
        </p>
      </div>

      {!started ? (
        <RepoInput onFetch={handleFetch} loading={loading} />
      ) : (
        <div className="w-full max-w-3xl">
          <Slideshow commits={commits} explanations={explanations} />
          <button
            onClick={handleReset}
            className="mt-6 w-full py-3 bg-gray-800 hover:bg-gray-700
                       rounded-xl text-gray-400 transition-all duration-200"
          >
            Check another repo
          </button>
        </div>
      )}
    </main>
  );
}