import z from "zod";

export const HabitSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  name: z.string(),
  category: z.enum(['exercise', 'food', 'routine', 'study']),
  description: z.string().nullable(),
  target_frequency: z.enum(['daily']),
  target_amount: z.number(),
  target_unit: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const HabitEntrySchema = z.object({
  id: z.number(),
  habit_id: z.number(),
  user_id: z.string(),
  entry_date: z.string(),
  amount: z.number(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateHabitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(['exercise', 'food', 'routine', 'study']),
  description: z.string().optional(),
  target_frequency: z.enum(['daily']),
  target_amount: z.number().min(1, "Target amount must be positive"),
  target_unit: z.string().min(1, "Unit is required"),
});

export const CreateHabitEntrySchema = z.object({
  entry_date: z.string(),
  amount: z.number().min(0, "Amount cannot be negative"),
  notes: z.string().optional(),
});

export type Habit = z.infer<typeof HabitSchema>;
export type HabitEntry = z.infer<typeof HabitEntrySchema>;
export type CreateHabit = z.infer<typeof CreateHabitSchema>;
export type CreateHabitEntry = z.infer<typeof CreateHabitEntrySchema>;

export const HABIT_CATEGORIES = [
  { value: 'exercise', label: 'Exercise', icon: '💪', color: 'bg-emerald-500' },
  { value: 'food', label: 'Nutrition', icon: '🥗', color: 'bg-orange-500' },
  { value: 'routine', label: 'Routine', icon: '🔄', color: 'bg-blue-500' },
  { value: 'study', label: 'Study', icon: '📚', color: 'bg-purple-500' },
] as const;

export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
] as const;
