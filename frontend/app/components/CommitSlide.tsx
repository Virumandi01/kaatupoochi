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
       <p className="text-green-100 text-lg font-medium leading-relaxed whitespace-pre-line">
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

     {/* Files changed list */}
{commit.files && commit.files.length > 0 && (
  <div className="border-t border-gray-800 pt-4 mb-4">
    <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
      Files changed
    </p>
    <div className="space-y-1">
      {commit.files.map((file: any, i: number) => (
        <div key={i} className="flex items-center justify-between
                                bg-gray-800 rounded-lg px-3 py-2">
          <span className="text-gray-300 text-xs font-mono truncate flex-1">
            {file.name}
          </span>
          <div className="flex gap-2 ml-2 shrink-0">
            <span className="text-green-400 text-xs">+{file.additions}</span>
            <span className="text-red-400 text-xs">-{file.deletions}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{/* Technical details */}
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