type Props = {
  title: string;
  subtitle?: string;
  className?: string;
};

// 여러 화면의 로딩 상태를 같은 시각 언어로 묶는다.
export default function LoadingState({
  title,
  subtitle,
  className = "",
}: Props) {
  return (
    <div className={`px-4 lg:px-8 py-12 mx-auto w-full text-center ${className}`}>
      <div className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-ac-s2 border-t-ac animate-spin" />
      <div className="text-sm font-black text-tx">{title}</div>
      {subtitle && <div className="mt-1 text-xs text-mu">{subtitle}</div>}
    </div>
  );
}
