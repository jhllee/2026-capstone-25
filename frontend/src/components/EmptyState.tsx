type Props = {
  emoji: string;
  title: string;
  subtitle?: string;
};

export default function EmptyState({ emoji, title, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center py-12 gap-2">
      <span className="text-4xl">{emoji}</span>
      <p className="text-sm font-bold text-tx">{title}</p>
      {subtitle && <p className="text-xs text-mu">{subtitle}</p>}
    </div>
  );
}
