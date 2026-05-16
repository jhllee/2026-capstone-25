type PipelineStep = {
  id: string;
  label: string;
};

type Props = {
  title: string;
  subtitle?: string;
  pipeline?: PipelineStep[];
  activeStep?: number;
  className?: string;
};

export const DECOMPOSE_PIPELINE: PipelineStep[] = [
  { id: "intake", label: "INTAKE" },
  { id: "decompose", label: "DECOMPOSE" },
  { id: "validate", label: "VALIDATE" },
  { id: "present", label: "PRESENT" },
];

// 일반 로딩 화면과 AI 분해 4단 progress를 같은 시각 언어로 묶는다.
export default function LoadingState({
  title,
  subtitle,
  pipeline,
  activeStep = 0,
  className = "",
}: Props) {
  return (
    <div className={`px-4 lg:px-8 py-12 mx-auto w-full text-center ${className}`}>
      <div className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-ac-s2 border-t-ac animate-spin" />
      <div className="text-sm font-black text-tx">{title}</div>
      {subtitle && <div className="mt-1 text-xs text-mu">{subtitle}</div>}

      {pipeline && (
        <div className="mt-6 grid grid-cols-4 gap-1.5 text-[10px] font-black text-center">
          {pipeline.map((step, index) => {
            const isDone = index < activeStep;
            const isActive = index === activeStep;
            return (
              <div
                key={step.id}
                className={[
                  "rounded-full border px-1.5 py-1.5 truncate",
                  isDone || isActive
                    ? "border-ac-s2 bg-ac-s text-ac-d"
                    : "border-bd2 bg-sf text-mu",
                ].join(" ")}
              >
                {step.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
