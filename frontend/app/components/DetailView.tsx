/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

interface Props {
  commit: any;
  explanation: string;
  loading: boolean;
}

export default function DetailView({ commit, explanation, loading }: Props) {
  if (!commit) {
    return (
      <div className="bg-gray-900 rounded-2xl p-8 h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-2">
            Select a commit to see details
          </p>
          <p className="text-gray-700 text-sm">
            Click any commit from the list on the left
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filesCreated = commit.files?.filter(
    (f: any) => f.status === 'added'
  ).length || 0;

  const filesDeleted = commit.files?.filter(
    (f: any) => f.status === 'removed'
  ).length || 0;

  const filesModified = commit.files?.filter(
    (f: any) => f.status === 'modified'
  ).length || 0;

  const folders = [...new Set(
    commit.files?.map((f: any) => {
      const parts = f.name.split('/');
      return parts.length > 1 ? parts[0] : 'root';
    }) || []
  )];

  return (
    <div className="bg-gray-900 rounded-2xl p-6 h-full overflow-y-auto">

      {/* Header */}
      <div className="mb-4 border-b border-gray-800 pb-4">
        <p className="text-gray-500 text-xs font-mono mb-1">
          {commit.short_id} · {commit.author} · {formatDate(commit.date)}
        </p>
        <p className="text-white font-medium text-lg leading-snug">
          {commit.title}
        </p>
      </div>

      {/* AI Explanation */}
      <div className="bg-green-950 border border-green-800 rounded-xl p-4 mb-5">
        <p className="text-green-400 text-xs uppercase tracking-widest mb-2">
          What happened
        </p>
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"/>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100"/>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"/>
          </div>
        ) : (
          <p className="text-green-100 text-base leading-relaxed">
            {explanation}
          </p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-green-400 text-2xl font-bold">
            +{commit.additions}
          </p>
          <p className="text-gray-500 text-xs mt-1">Lines added</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-red-400 text-2xl font-bold">
            -{commit.deletions}
          </p>
          <p className="text-gray-500 text-xs mt-1">Lines removed</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-blue-400 text-2xl font-bold">
            {filesCreated}
          </p>
          <p className="text-gray-500 text-xs mt-1">Files created</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-red-400 text-2xl font-bold">
            {filesDeleted}
          </p>
          <p className="text-gray-500 text-xs mt-1">Files deleted</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-yellow-400 text-2xl font-bold">
            {filesModified}
          </p>
          <p className="text-gray-500 text-xs mt-1">Files modified</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-purple-400 text-2xl font-bold">
            {folders.length}
          </p>
          <p className="text-gray-500 text-xs mt-1">Folders affected</p>
        </div>
      </div>

      {/* Folders affected */}
      {folders.length > 0 && (
        <div className="mb-5">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
            Folders affected
          </p>
          <div className="flex flex-wrap gap-2">
            {folders.map((folder: any, i: number) => (
              <span
                key={i}
                className="bg-gray-800 text-gray-300 text-xs
                           font-mono px-3 py-1 rounded-full"
              >
                {folder}/
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Files list */}
      {commit.files && commit.files.length > 0 && (
        <div className="mb-5">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
            Files changed
          </p>
          <div className="space-y-1">
            {commit.files.map((file: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between
                           bg-gray-800 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className={`text-xs font-bold shrink-0 ${
                    file.status === 'added' ? 'text-green-400' :
                    file.status === 'removed' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {file.status === 'added' ? 'NEW' :
                     file.status === 'removed' ? 'DEL' : 'MOD'}
                  </span>
                  <span className="text-gray-300 text-xs font-mono truncate">
                    {file.name}
                  </span>
                </div>
                <div className="flex gap-2 ml-2 shrink-0">
                  <span className="text-green-400 text-xs">
                    +{file.additions}
                  </span>
                  <span className="text-red-400 text-xs">
                    -{file.deletions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View on GitHub button */}
      {commit.github_url && (<a
        
          href={commit.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2
                     w-full py-3 bg-gray-800 hover:bg-gray-700
                     border border-gray-700 hover:border-green-400
                     rounded-xl text-gray-300 hover:text-green-400
                     text-sm font-medium transition-all duration-200"
        >
          View this commit on GitHub →
        </a>
      )}
    </div>
  );
}