'use client';
import { useState } from 'react';
import RepoInput from './components/RepoInput';
import Slideshow from './components/Slideshow';
import axios from 'axios'; 
export default function Home() {
  const [commits, setCommits] = useState([]);
  const [explanations, setExplanations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const handleFetch = async (projectId: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/commits/${projectId}?limit=10`
      );
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
      alert('Could not fetch commits. Check your project ID.');
    }
    setLoading(false);
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
        <Slideshow commits={commits} explanations={explanations} />
      )}
    </main>
  );
}