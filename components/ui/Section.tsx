export default function Section({ title, border, children }: { title: string; border?: boolean; children: React.ReactNode }) {
  return (
    <div className={border ? "border border-border rounded-lg p-4" : ""}>
      <h3 className="text-sm font-semibold text-text mb-2">{title}</h3>
      {children}
    </div>
  );
}
