export default function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-text mb-2">{title}</h3>
      {children}
    </div>
  );
}
