export default function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-text mt-1">{label}</p>
    </div>
  );
}
