'use client';

import { useMemo } from 'react';
import { fmt } from '@/util/dateFormatting';

interface Props {
  sessions: {
    startedAt: Date | string;
    durationMinutes: number | null;
  }[];
  accountCreatedAt: Date | string;
}

interface GraphDay {
  date: Date;
  minutes: number;
  key: string;
}

interface MonthLabel {
  label: string;
  col: number;
}

interface GraphData {
  weeks: GraphDay[][];
  maxMinutes: number;
  monthLabels: MonthLabel[];
  totalMinutes: number;
  activeDays: number;
}

const LEVEL_COLORS = [
  'bg-secondary/30',
  'bg-primary/20',
  'bg-primary/40',
  'bg-primary/65',
  'bg-primary',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getLevel(minutes: number): number {
  if (minutes === 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function buildGraphData(
  sessions: Props['sessions'],
  accountCreatedAt: Date | string
): GraphData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(accountCreatedAt);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  const dayMap = new Map<string, number>();
  const activeDaysSet = new Set<string>();

  for (const s of sessions) {
    const d = new Date(s.startedAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    dayMap.set(key, (dayMap.get(key) || 0) + (s.durationMinutes || 0));
    activeDaysSet.add(key);
  }

  const weeks: GraphDay[][] = [];
  let currentWeek: GraphDay[] = [];

  const cursor = new Date(start);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + (6 - today.getDay()));

  while (cursor <= endDate) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    currentWeek.push({ date: new Date(cursor), minutes: dayMap.get(key) || 0, key });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  if (currentWeek.length > 0) weeks.push(currentWeek);

  let maxMinutes = 0;
  for (const week of weeks) {
    for (const day of week) {
      if (day.minutes > maxMinutes) maxMinutes = day.minutes;
    }
  }

  const monthLabels: MonthLabel[] = [];
  let lastLabelCol = -4;

  weeks.forEach((week, i) => {
    const firstOfMonth = week.find((d) => d.date.getDate() === 1);
    if (!firstOfMonth) return;
    if (i - lastLabelCol < 3) return;

    monthLabels.push({
      label: firstOfMonth.date.toLocaleDateString('en-US', { month: 'short' }),
      col: i,
    });
    lastLabelCol = i;
  });

  return {
    weeks,
    maxMinutes: maxMinutes || 1,
    monthLabels,
    totalMinutes: sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
    activeDays: activeDaysSet.size,
  };
}

export default function SessionGraph({ sessions, accountCreatedAt }: Props) {
  const data = useMemo(
    () => buildGraphData(sessions, accountCreatedAt),
    [sessions, accountCreatedAt]
  );

  const accountStart = new Date(accountCreatedAt);
  accountStart.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-4 text-xs text-text">
        <span>
          <span className="text-primary font-medium">{fmt(data.totalMinutes)}</span> total
        </span>
        <span>
          <span className="text-primary font-medium">{data.activeDays}</span> active days
        </span>
        <span>
          <span className="text-primary font-medium">{sessions.length}</span> sessions
        </span>
      </div>

      <div className="pt-7">
        <div className="inline-flex flex-col gap-0">
          <div className="flex ml-8 mb-1">
            {data.monthLabels.map((m, i) => {
              const nextCol = data.monthLabels[i + 1]?.col;
              const span = nextCol !== undefined ? nextCol - m.col : data.weeks.length - m.col;
              return (
                <span key={i} className="text-[10px] text-text/50" style={{ width: `${span * 14}px` }}>
                  {m.label}
                </span>
              );
            })}
          </div>

          <div className="flex gap-0">
            <div className="flex flex-col gap-0.75 mr-2">
              {DAY_LABELS.map((label, i) => (
                <span
                  key={label}
                  className="text-[10px] text-text/40 h-2.75 leading-2.75"
                  style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex gap-0.75">
              {data.weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.75">
                  {week.map((day) => {
                    const isFuture = day.date > new Date();
                    const isBeforeAccount = day.date < accountStart;
                    const isInteractive = !isFuture && !isBeforeAccount;
                    const level = getLevel(day.minutes);

                    return (
                      <div
                        key={day.key}
                        className={`group/cell relative size-2.75 rounded-sm z-0 hover:z-50 ${
                          isInteractive ? LEVEL_COLORS[level] : 'bg-transparent'
                        } ${isToday(day.date) ? 'ring-1 ring-primary/50' : ''}`}
                      >
                        {isInteractive && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/cell:flex flex-col items-center pointer-events-none">
                            <div className="bg-background border border-border rounded-md px-3 py-2 shadow-xl shadow-black/40 whitespace-nowrap">
                              <p className="text-xs text-primary font-medium">
                                {day.minutes > 0 ? fmt(day.minutes) : 'No sessions'}
                              </p>
                              <p className="text-[10px] text-text/60">
                                {day.date.toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="size-2 bg-background border-r border-b border-border rotate-45 -mt-1" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 mt-2 ml-8">
            <span className="text-[10px] text-text/40 mr-1">Less</span>
            {LEVEL_COLORS.map((color, i) => (
              <div key={i} className={`size-2.75 rounded-sm ${color}`} />
            ))}
            <span className="text-[10px] text-text/40 ml-1">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
