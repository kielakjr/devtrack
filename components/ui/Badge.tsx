export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs border border-border text-text">
      {children}
    </span>
  );
}
