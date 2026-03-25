'use client';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  repoName: string;
}

export default function ReadmeView({ content, repoName }: Props) {
  if (!content) return null;

  return (
    <div className="bg-gray-900 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
        <span className="text-gray-500 text-xs uppercase tracking-widest">
          README
        </span>
        <span className="text-gray-600 text-xs">·</span>
        <span className="text-gray-500 text-xs">{repoName}</span>
      </div>

      {/* Markdown content */}
      <div className="text-gray-300 text-sm leading-relaxed space-y-3
                      [&_h1]:text-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3
                      [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2
                      [&_h3]:text-white [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2
                      [&_a]:text-green-400 [&_a]:underline [&_a]:hover:text-green-300
                      [&_code]:text-green-300 [&_code]:bg-gray-800 [&_code]:px-1.5
                      [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs
                      [&_pre]:bg-gray-800 [&_pre]:p-4 [&_pre]:rounded-xl
                      [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-gray-700
                      [&_strong]:text-white [&_strong]:font-semibold
                      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
                      [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
                      [&_li]:text-gray-300
                      [&_blockquote]:border-l-4 [&_blockquote]:border-green-400
                      [&_blockquote]:pl-4 [&_blockquote]:text-gray-400
                      [&_img]:rounded-xl [&_img]:max-w-full
                      [&_hr]:border-gray-700">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}