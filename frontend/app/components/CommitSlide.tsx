/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

interface Props {
  commit: any;
  explanation: string;
  slideNumber: number;
  total: number;
}

export default function CommitSlide({ commit, explanation, slideNumber, total }: Props) {
  const date = new Date(commit.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">

      {/* Slide number */}
      <div className="text-green-400 text-sm font-mono mb-4">
        Change {slideNumber} of {total}
      </div>

      {/* Plain English explanation — THE STAR */}
      <div className="bg-green-950 border border-green-800 rounded-xl p-5 mb-6">
        <p className="text-xs text-green-500 uppercase tracking-widest mb-2">
          What happened
        </p>
        <p className="text-green-100 text-xl font-medium leading-relaxed">
          {explanation}
        </p>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-green-400 text-2xl font-bold">+{commit.additions}</p>
          <p className="text-gray-500 text-xs mt-1">Lines added</p>
        </div>
        <div className="flex-1 bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-red-400 text-2xl font-bold">-{commit.deletions}</p>
          <p className="text-gray-500 text-xs mt-1">Lines removed</p>
        </div>
        <div className="flex-1 bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-blue-400 text-2xl font-bold">{commit.files_changed}</p>
          <p className="text-gray-500 text-xs mt-1">Files changed</p>
        </div>
      </div>

      {/* Technical details (collapsed) */}
      <div className="border-t border-gray-800 pt-4">
        <p className="text-gray-600 text-xs font-mono">
          {commit.short_id} · {commit.author} · {date}
        </p>
        <p className="text-gray-500 text-sm mt-1 italic">
          &quot;{commit.title}&quot;
        </p>
      </div>
    </div>
  );
}