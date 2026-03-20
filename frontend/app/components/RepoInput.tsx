'use client';
import { useState } from 'react';

interface Props {
  onFetch: (projectId: string) => void;
  loading: boolean;
}

export default function RepoInput({ onFetch, loading }: Props) {
  const [projectId, setProjectId] = useState('');

  return (
    <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl">
      <h2 className="text-xl font-semibold mb-2 text-white">
        Enter your GitLab Project ID
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Find it in your GitLab repo under Settings → General
      </p>

      <input
        type="text"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        placeholder="e.g. 12345678"
        className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 mb-4 
                   border border-gray-700 focus:outline-none focus:border-green-400"
      />

      <button
        onClick={() => onFetch(projectId)}
        disabled={loading || !projectId}
        className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700
                   text-black font-bold py-3 rounded-xl transition-all duration-200"
      >
        {loading ? 'Loading your history...' : 'Show my Git story'}
      </button>
    </div>
  );
}