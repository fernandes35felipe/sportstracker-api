export const USER_ROLES = {
  ATHLETE: 'athlete',
  TRAINER: 'trainer',
} as const;

export const GOAL_CATEGORIES = {
  STRENGTH: 'strength',
  ENDURANCE: 'endurance',
  BODY_COMPOSITION: 'body-composition',
  SKILL: 'skill',
} as const;

export const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
} as const;

export const WORKOUT_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export const EXERCISE_CATEGORIES = {
  STRENGTH: 'Força',
  CARDIO: 'Cardio',
  HIIT: 'HIIT',
  FLEXIBILITY: 'Flexibilidade',
  CORE: 'Core',
} as const;