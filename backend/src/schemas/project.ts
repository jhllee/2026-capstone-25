import { z } from "zod";

export const CreateStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  guide: z.string().optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  boundarySignal: z.string().optional(),
  qualityFlags: z.array(z.string()).default([]),
});

export const CreateProjectSchema = z.object({
  rawInput: z.string().min(1),
  primaryType: z.string().optional(),
  secondaryTags: z.array(z.string()).default([]),
  goal: z.string().min(1),
  currentPhase: z.string().optional(),
  color: z.string().optional(),
  startDate: z.string().date().optional(),
  due: z.string().date().optional(),
  isSingle: z.boolean().default(false),
  scale: z.string().optional(),
  templateId: z.string().optional(),
  templateName: z.string().optional(),
  steps: z.array(CreateStepSchema).default([]),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
