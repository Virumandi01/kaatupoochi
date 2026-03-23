/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

interface Props {
  commitsByDate: Record<string, any[]>;
  onDayClick: (date: string, commits: any[]) => void;
  selectedDate: string | null;
}

export default function Calendar({ commitsByDate, onDayClick, selectedDate }: Props) {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Build all days for the year
  const days: string[] = [];
  const current = new Date(oneYearAgo);
  while (current <= today) {
    days.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  const getColor = (date: string) => {
    const count = commitsByDate[date]?.length || 0;
    if (count === 0) return 'bg-gray-800';
    if (count === 1) return 'bg-green-900';
    if (count === 2) return 'bg-green-700';
    if (count === 3) return 'bg-green-500';
    return 'bg-green-400';
  };

  // Group days by week
  const weeks: string[][] = [];
  let week: string[] = [];

  // pad start
  const firstDay = new Date(days[0]).getDay();
  for (let i = 0; i < firstDay; i++) {
    week.push('');
  }

  days.forEach(day => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) weeks.push(week);

  // Month labels
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                   'Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="w-full overflow-x-auto pb-2">
      {/* Month labels */}
      <div className="flex gap-1 mb-1 ml-1">
        {months.map(m => (
          <div key={m} className="text-gray-500 text-xs w-8 text-center">
            {m}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                onClick={() => {
                  if (day && commitsByDate[day]) {
                    onDayClick(day, commitsByDate[day]);
                  }
                }}
                title={day ? `${day}: ${commitsByDate[day]?.length || 0} commits` : ''}
                className={`w-3 h-3 rounded-sm transition-all duration-200
                  ${day ? getColor(day) : 'opacity-0'}
                  ${day && commitsByDate[day] ? 'cursor-pointer hover:ring-1 hover:ring-green-400' : ''}
                  ${selectedDate === day ? 'ring-2 ring-white' : ''}
                `}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 justify-end">
        <span className="text-gray-500 text-xs">Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-800"/>
        <div className="w-3 h-3 rounded-sm bg-green-900"/>
        <div className="w-3 h-3 rounded-sm bg-green-700"/>
        <div className="w-3 h-3 rounded-sm bg-green-500"/>
        <div className="w-3 h-3 rounded-sm bg-green-400"/>
        <span className="text-gray-500 text-xs">More</span>
      </div>
    </div>
  );
}