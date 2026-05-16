type Props = {
  totalMins: number;
  doneCount: number;
  streak: number;
};

function formatTime(mins: number): { value: string; unit: string } {
  if (mins < 60) return { value: String(mins), unit: "분" };
  const h = Math.floor(mins / 60);
  if (h < 24) return { value: String(h), unit: "시간" };
  return { value: String(Math.floor(h / 24)), unit: "일" };
}

export default function StatsCard({ totalMins, doneCount, streak }: Props) {
  const time = formatTime(totalMins);

  const stats = [
    { value: String(doneCount), unit: "개", label: "완료한 단계" },
    { value: time.value, unit: time.unit, label: "총 집중 시간" },
    { value: String(streak), unit: "일", label: "연속 집중" },
  ];

  return (
    <div className="bg-sf border border-bd2 rounded-2xl px-4 py-5 grid grid-cols-3 divide-x divide-bd2">
      {stats.map(({ value, unit, label }) => (
        <div key={label} className="flex flex-col items-center gap-1 px-2">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[28px] font-black text-tx leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
              {value}
            </span>
            <span className="text-sm font-bold text-mu">{unit}</span>
          </div>
          <span className="text-[11px] font-bold text-mu">{label}</span>
        </div>
      ))}
    </div>
  );
}
