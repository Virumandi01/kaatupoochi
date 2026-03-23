'use client';
import { useState } from 'react';

interface Props {
  onFetch: (platform: string, repoDetails: string) => void;
  loading: boolean;
}

export default function RepoInput({ onFetch, loading }: Props) {
  const [platform, setPlatform] = useState('github');
  const [repoDetails, setRepoDetails] = useState('');

  const placeholder = platform === 'github'
    ? 'owner/repo — e.g. facebook/react'
    : 'Project ID — e.g. 12345678';

  const hint = platform === 'github'
    ? 'Enter as: owner/reponame'
    : 'Find Project ID in GitLab → Settings → General';

  return (
    <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl">

      {/* Platform selector */}
      <p className="text-gray-400 text-sm mb-3">
        Choose your platform
      </p>
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setPlatform('github')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200
            ${platform === 'github'
              ? 'bg-green-500 text-black'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
        >
          GitHub
        </button>
        <button
          onClick={() => setPlatform('gitlab')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200
            ${platform === 'gitlab'
              ? 'bg-orange-500 text-black'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
        >
          GitLab
        </button>
      </div>

      {/* Two separate inputs */}
<p className="text-gray-500 text-xs mb-2">Owner / Username</p>
<input
  type="text"
  value={repoDetails.split('/')[0] || ''}
  onChange={(e) => {
    const repo = repoDetails.split('/')[1] || '';
    setRepoDetails(`${e.target.value}/${repo}`);
  }}
  placeholder="e.g. facebook"
  autoComplete="off"
  autoCorrect="off"
  autoCapitalize="off"
  spellCheck="false"
  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 mb-3
             border border-gray-700 focus:outline-none focus:border-green-400"
/>

<p className="text-gray-500 text-xs mb-2">Repository name</p>
<input
  type="text"
  value={repoDetails.split('/')[1] || ''}
  onChange={(e) => {
    const owner = repoDetails.split('/')[0] || '';
    setRepoDetails(`${owner}/${e.target.value}`);
  }}
  placeholder="e.g. react"
  autoComplete="off"
  autoCorrect="off"
  autoCapitalize="off"
  spellCheck="false"
  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 mb-4
             border border-gray-700 focus:outline-none focus:border-green-400"
/>

      {/* Submit button */}
      <button
        onClick={() => onFetch(platform, repoDetails)}
        disabled={loading || !repoDetails}
        className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700
                   text-black font-bold py-3 rounded-xl transition-all duration-200"
      >
        {loading ? 'Loading your history...' : 'Show my Git story'}
      </button>
    </div>
  );
}