export default function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-border rounded-lg p-5 space-y-2">
      <h3 className="text-sm font-medium text-primary">{title}</h3>
      <p className="text-xs text-text leading-relaxed">{description}</p>
    </div>
  );
}
