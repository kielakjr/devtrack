export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const daySet = new Set<string>();
  for (const d of dates) {
    const date = new Date(d);
    daySet.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  let cursor = new Date(today);
  if (!daySet.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
    const yKey = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!daySet.has(yKey)) return 0;
  }

  let streak = 0;
  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!daySet.has(key)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
