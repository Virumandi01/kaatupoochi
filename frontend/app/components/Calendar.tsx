'use client';

interface Props {
  activityMap: Record<string, number>;
  onDayClick: (date: string) => void;
  selectedDate: string | null;
  selectedBranch: string;
  selectedYear: number; // <-- NEW PROP
}

export default function Calendar({ activityMap, onDayClick, selectedDate, selectedYear }: Props) {
  const today = new Date();
  
  // Start on Jan 1st of the selected year
  const startDate = new Date(selectedYear, 0, 1);
  
  // End on Today (if current year) OR Dec 31st (if past year)
  const endDate = selectedYear === today.getFullYear() 
    ? today 
    : new Date(selectedYear, 11, 31);

  const monthGroups: {
    label: string;
    year: number;
    weeks: { date: string | null }[][];
  }[] = [];

  const cursor = new Date(startDate);
  
  while (cursor <= endDate) {
    const monthLabel = cursor.toLocaleString('default', { month: 'short' });
    const year = cursor.getFullYear();
    const weeks: { date: string | null }[][] = [];
    let currentWeek: { date: string | null }[] = [];

    // Pad the first week of the month with empty spaces if it doesn't start on Sunday
    const firstDayOfWeek = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: null });
    }

    const month = cursor.getMonth();
    while (cursor <= endDate && cursor.getMonth() === month) {
      // Adjust for local timezone to avoid date shifting
      const dateStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      currentWeek.push({ date: dateStr });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    // Pad the last week of the month
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ date: null });
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);
    monthGroups.push({ label: monthLabel, year, weeks });
  }

  const getColor = (date: string) => {
    const count = activityMap[date] || 0;
    
    // 0 commits — visible gray box instead of blending into background
    if (count === 0) return 'bg-gray-800'; 
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
                        if (date && activityMap[date]) {
                          onDayClick(date);
                        }
                      }}
                      title={date
                        ? `${date}: ${activityMap[date] || 0} commits`
                        : ''}
                      className={`w-3 h-3 rounded-sm transition-all duration-200
                        ${date ? getColor(date) : 'opacity-0'}
                        ${date && activityMap[date]
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
        <div className="w-3 h-3 rounded-sm bg-gray-800"/>
        <div className="w-3 h-3 rounded-sm bg-green-950"/>
        <div className="w-3 h-3 rounded-sm bg-green-900"/>
        <div className="w-3 h-3 rounded-sm bg-green-700"/>
        <div className="w-3 h-3 rounded-sm bg-green-500"/>
        <div className="w-3 h-3 rounded-sm bg-green-400"/>
        <span className="text-gray-500 text-xs">More</span>
      </div>
    </div>
  );
}