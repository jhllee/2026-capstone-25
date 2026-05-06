// 단계 목록의 (1)분해 성공 여부 (2) id 중복 여부 검증한다.
// 의미 품질(모호 동사·산출물·주관 부사)은 prompt 책임이라 검사하지 않는다.

import { z } from "zod";
import { StepSchema } from "../schemas/decompose.js";

export type Step = z.infer<typeof StepSchema>;

export type Severity = "blocker" | "warning";

export type ValidationCode =
  | "no_decomposition"
  | "duplicate_id";

export interface ValidationIssue {
  code: ValidationCode;
  severity: Severity;
  message: string;
  step_ids?: string[];
}

export interface ValidateResult {
  ok: boolean;
  issues: ValidationIssue[];
  hasBlocker: boolean;
}

const MIN_STEPS = 2;

export function validate(steps: Step[]): ValidateResult {
  const issues = [
    ...checkDecomposed(steps),
    ...checkDuplicateIds(steps),
  ];
  // hadBlocker : blocker가 하나라도 있는지를 나타내는 boolean
  const hasBlocker = issues.some((i) => i.severity === "blocker");
  return { ok: !hasBlocker, issues, hasBlocker };
}

// (1) 분해 성공 검증 (최소 2단계)
function checkDecomposed(steps: Step[]): ValidationIssue[] {
  if (steps.length >= MIN_STEPS) return [];
  return [{
    code: "no_decomposition",
    severity: "blocker",
    message: `분해가 일어나지 않음: 단계 ${steps.length}개 (최소 ${MIN_STEPS})`,
  }];
}

// (2) 중복 id 검증
function checkDuplicateIds(steps: Step[]): ValidationIssue[] {
  const counts = new Map<string, number>();  // Map<id, count>
  for (const s of steps) counts.set(s.id, (counts.get(s.id) ?? 0) + 1);  // 단계마다 id의 count 증가
  const dups = [...counts.entries()].filter(([, n]) => n > 1).map(([id]) => id);  // 중복된 id만 추리기
  if (dups.length === 0) return [];
  return [{
    code: "duplicate_id",
    severity: "blocker",
    step_ids: dups,
    message: `중복된 step id: ${dups.join(", ")}`,
  }];
}
