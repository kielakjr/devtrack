'use client';

import Link from 'next/link';

export default function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-lg p-4 overflow-visible">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-wider text-text">{title}</h2>
        {action && (
          <Link href={action.href} className="text-xs text-primary hover:underline">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
