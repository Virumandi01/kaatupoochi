/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

interface Props {
  date: string;
  commits: any[];
  selectedCommit: string | null;
  onCommitClick: (commitId: string) => void;
}

export default function CommitList({ date, commits, selectedCommit, onCommitClick }: Props) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-4 h-full">
      {/* Date header */}
      <div className="mb-4 border-b border-gray-800 pb-3">
        <p className="text-green-400 text-xs uppercase tracking-widest mb-1">
          Selected day
        </p>
        <p className="text-white font-medium">
          {formatDate(date)}
        </p>
        <p className="text-gray-500 text-xs mt-1">
          {commits.length} commit{commits.length > 1 ? 's' : ''} this day
        </p>
      </div>

      {/* Commit list */}
      <div className="space-y-2 overflow-y-auto max-h-96">
        {commits.map((commit) => (
          <div
            key={commit.id}
            onClick={() => onCommitClick(commit.id)}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200
              ${selectedCommit === commit.id
                ? 'bg-green-900 border border-green-600'
                : 'bg-gray-800 hover:bg-gray-700 border border-transparent'
              }`}
          >
            {/* Commit title */}
            <p className="text-white text-sm font-medium truncate mb-1">
              {commit.title}
            </p>

            {/* Author and time */}
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-xs truncate">
                {commit.author}
              </p>
              <p className="text-gray-600 text-xs ml-2 shrink-0">
                {formatTime(commit.time)}
              </p>
            </div>

            {/* Short ID */}
            <p className="text-gray-600 text-xs font-mono mt-1">
              {commit.short_id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}