'use client';

interface Props {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  loading: boolean;
}

export default function YearSelector({ years, selectedYear, onYearChange, loading }: Props) {
  return (
    <div className="flex items-center gap-2">
      {loading && (
        <span className="text-gray-500 text-xs animate-pulse">
          Loading...
        </span>
      )}
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        disabled={loading}
        className="bg-gray-800 text-white text-sm font-medium
                   rounded-xl px-3 py-2 border border-gray-700
                   focus:outline-none focus:border-green-400
                   cursor-pointer disabled:opacity-50"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}