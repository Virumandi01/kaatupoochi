/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

interface Props {
  commitsByDate: Record<string, any[]>;
  onDayClick: (date: string, commits: any[]) => void;
  selectedDate: string | null;
  selectedBranch: string;
  loadedSince: string;
  loadedUntil: string;
}

export default function Calendar({ commitsByDate, onDayClick, selectedDate, selectedBranch: _selectedBranch, loadedSince, loadedUntil }: Props) { // eslint-disable-line @typescript-eslint/no-unused-vars
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  oneYearAgo.setDate(oneYearAgo.getDate() + 1);

  const monthGroups: {
    label: string;
    year: number;
    weeks: { date: string | null }[][];
  }[] = [];

  const cursor = new Date(oneYearAgo);

  while (cursor <= today) {
    const monthLabel = cursor.toLocaleString('default', { month: 'short' });
    const year = cursor.getFullYear();
    const weeks: { date: string | null }[][] = [];
    let currentWeek: { date: string | null }[] = [];

    const firstDayOfWeek = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: null });
    }

    const month = cursor.getMonth();
    while (cursor <= today && cursor.getMonth() === month) {
      currentWeek.push({ date: cursor.toISOString().split('T')[0] });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ date: null });
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    monthGroups.push({ label: monthLabel, year, weeks });
  }

  const getColor = (date: string) => {
    const count = commitsByDate[date]?.length || 0;
    const dateObj = new Date(date);
    const since = loadedSince ? new Date(loadedSince) : null;
    const until = loadedUntil ? new Date(loadedUntil) : null;

    // Not yet loaded — gray
    if (since && until && (dateObj < since || dateObj > until)) {
      return 'bg-gray-700 opacity-40';
    }

    // Loaded but no commits — dark
    if (count === 0) return 'bg-gray-900';

    // 6 shades of green
    if (count === 1) return 'bg-green-950';
    if (count === 2) return 'bg-green-900';
    if (count === 3) return 'bg-green-700';
    if (count <= 5) return 'bg-green-600';
    if (count <= 9) return 'bg-green-500';
    return 'bg-green-400';
  };
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-3">

        {/* Day labels */}
        <div className="flex flex-col gap-1 mt-6 mr-1">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div
              key={i}
              className="text-gray-600 h-3 flex items-center"
              style={{ fontSize: '9px' }}
            >
              {i % 2 === 1 ? d : ''}
            </div>
          ))}
        </div>

        {/* Month groups */}
        {monthGroups.map((group, gi) => (
          <div key={gi} className="flex flex-col">

            {/* Month + year label */}
            <div className="flex items-center gap-1 mb-1">
              <span className="text-gray-400 text-xs font-medium">
                {group.label}
              </span>
              <span className="text-gray-600 text-xs">
                {group.year}
              </span>
            </div>

            {/* Weeks grid */}
            <div className="flex gap-1">
              {group.weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map(({ date }, di) => (
                    <div
                      key={di}
                      onClick={() => {
                        if (date && commitsByDate[date]) {
                          onDayClick(date, commitsByDate[date]);
                        }
                      }}
                      title={date
                        ? `${date}: ${commitsByDate[date]?.length || 0} commits`
                        : ''}
                      className={`w-3 h-3 rounded-sm transition-all duration-200
                        ${date ? getColor(date) : 'opacity-0'}
                        ${date && commitsByDate[date]
                          ? 'cursor-pointer hover:ring-1 hover:ring-green-400'
                          : ''}
                        ${selectedDate === date ? 'ring-2 ring-white' : ''}
                      `}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
<div className="flex items-center gap-2 mt-3 justify-end">
  <span className="text-gray-500 text-xs">Less</span>
  <div className="w-3 h-3 rounded-sm bg-gray-900"/>
  <div className="w-3 h-3 rounded-sm bg-green-950"/>
  <div className="w-3 h-3 rounded-sm bg-green-900"/>
  <div className="w-3 h-3 rounded-sm bg-green-700"/>
  <div className="w-3 h-3 rounded-sm bg-green-500"/>
  <div className="w-3 h-3 rounded-sm bg-green-400"/>
  <span className="text-gray-500 text-xs">More</span>
  <span className="text-gray-500 text-xs ml-4">Gray = not loaded</span>
</div>
    </div>
  );
}