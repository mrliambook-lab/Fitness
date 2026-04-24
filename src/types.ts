/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen = 
  | 'splash'
  | 'onboarding' 
  | 'dashboard' 
  | 'workoutPlan'
  | 'dayDetails'
  | 'exerciseTimer' 
  | 'dietPlan' 
  | 'progress' 
  | 'profile'
  | 'earnPoints'
  | 'personalInfo'
  | 'healthData'
  | 'workoutHistory'
  | 'notifications'
  | 'helpSupport'
  | 'referEarn';

export interface UserData {
  name: string;
  gender: 'male' | 'female' | '';
  age: string;
  height: string;
  heightUnit: 'cm' | 'ft';
  weight: string;
  weightUnit: 'kg' | 'lb';
  goal: string;
  activityLevel: string;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  hasDisease: boolean;
  diseaseInfo: string;
  medicalConditions: {
    diabetes: boolean;
    heartIssues: boolean;
    injuries: boolean;
  };
  onboardingComplete: boolean;
  points: number;
  referralsCount: number;
  referralPointsEarned: number;
  profileImage: string;
  notifications: {
    workoutReminders: boolean;
    dietReminders: boolean;
    motivation: boolean;
  };
}

export interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  restTime: number; // in seconds
  image: string;
  instruction: string;
}

export interface DayPlan {
  day: number;
  exercises: Exercise[];
  isLocked: boolean;
  isCompleted: boolean;
  unlockTimestamp?: number;
}

export interface MealDetail {
  food: string;
  quantity: string;
  calories: number;
  protein: number;
  fiber: number;
  carbs?: number;
  fats?: number;
}

export interface Meal {
  type: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  icon: string;
  items: MealDetail[];
}

export interface DietDayProgress {
  day: number;
  isLocked: boolean;
  isCompleted: boolean;
  unlockTimestamp?: number;
}

export interface DietDay {
  day: number;
  totalCalories: number;
  waterIntake: string;
  tip: string;
  meals: Meal[];
}
