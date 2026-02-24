export function fmt(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function relative(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(diff / 3_600_000);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(diff / 86_400_000);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}


export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (isToday) return time;
  if (isYesterday) return `yesterday ${time}`;

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }) + ` ${time}`;
}

export function fmtTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};
