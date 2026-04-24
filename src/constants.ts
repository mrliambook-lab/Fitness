/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DayPlan, Exercise, DietDay } from './types';

export const EXERCISES: Record<string, Omit<Exercise, 'id'>> = {
  jumping_jacks: {
    name: 'Jumping Jacks',
    duration: 30,
    restTime: 10,
    image: 'https://images.unsplash.com/photo-1599058917233-35f69308d8f8?auto=format&fit=crop&q=80&w=400',
    instruction: 'Jump and spread your legs while raising arms above your head.'
  },
  high_knees: {
    name: 'High Knees',
    duration: 45,
    restTime: 10,
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400',
    instruction: 'Run in place, bringing your knees up to your chest level.'
  },
  plank: {
    name: 'Plank',
    duration: 45,
    restTime: 15,
    image: 'https://images.unsplash.com/photo-1566241134883-13eb2393a3cc?auto=format&fit=crop&q=80&w=400',
    instruction: 'Keep your body in a straight line, supported by your forearms and toes.'
  },
  crunches: {
    name: 'Abdominal Crunches',
    duration: 30,
    restTime: 10,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400',
    instruction: 'Lie on your back, knees bent, and lift your shoulders towards your knees.'
  },
  mountain_climbers: {
    name: 'Mountain Climbers',
    duration: 40,
    restTime: 15,
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&q=80&w=400',
    instruction: 'Start in a plank position and alternate driving knees towards your chest.'
  },
  leg_raises: {
    name: 'Leg Raises',
    duration: 30,
    restTime: 15,
    image: 'https://images.unsplash.com/photo-1544126592-807daa2b565b?auto=format&fit=crop&q=80&w=400',
    instruction: 'Lie flat and lift your legs to a 90-degree angle without bending knees.'
  },
  burpees: {
    name: 'Burpees',
    duration: 30,
    restTime: 20,
    image: 'https://images.unsplash.com/photo-1599058917765-aacc9918299e?auto=format&fit=crop&q=80&w=400',
    instruction: 'Drop to a squat, kick feet back, do a pushup, jump back, and leap up.'
  },
  flutter_kicks: {
    name: 'Flutter Kicks',
    duration: 45,
    restTime: 10,
    image: 'https://plus.unsplash.com/premium_photo-1664109999537-088e7d964dd2?auto=format&fit=crop&q=80&w=400',
    instruction: 'Lie on your back and alternate small, fast kicks with legs straight.'
  },
  russian_twist: {
    name: 'Russian Twist',
    duration: 40,
    restTime: 10,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400',
    instruction: 'Sit with knees bent, lean back slightly, and twist your torso side to side.'
  },
  bicycle_crunches: {
    name: 'Bicycle Crunches',
    duration: 45,
    restTime: 10,
    image: 'https://images.unsplash.com/photo-1599058918144-1ffabb6ab9a0?auto=format&fit=crop&q=80&w=400',
    instruction: 'Alternate touching elbows to opposite knees in a cycling motion.'
  },
  plank_jacks: {
    name: 'Plank Jacks',
    duration: 30,
    restTime: 15,
    image: 'https://images.unsplash.com/photo-1566241134883-13eb2393a3cc?auto=format&fit=crop&q=80&w=400',
    instruction: 'In plank position, jump your feet wide and then back together.'
  },
  heel_touches: {
    name: 'Heel Touches',
    duration: 40,
    restTime: 10,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400',
    instruction: 'Lie on your back and alternate reaching for your heels with your hands.'
  },
  side_plank_left: {
    name: 'Side Plank Left',
    duration: 30,
    restTime: 10,
    image: 'https://images.unsplash.com/photo-1566241134883-13eb2393a3cc?auto=format&fit=crop&q=80&w=400',
    instruction: 'Support your body weight on your left forearm and the side of your left foot.'
  },
  side_plank_right: {
    name: 'Side Plank Right',
    duration: 30,
    restTime: 10,
    image: 'https://images.unsplash.com/photo-1566241134883-13eb2393a3cc?auto=format&fit=crop&q=80&w=400',
    instruction: 'Support your body weight on your right forearm and the side of your right foot.'
  },
  butt_kicks: {
    name: 'Butt Kicks',
    duration: 45,
    restTime: 10,
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400',
    instruction: 'Run in place, kicking your heels up towards your glutes.'
  },
  scissors: {
    name: 'Scissors',
    duration: 40,
    restTime: 15,
    image: 'https://images.unsplash.com/photo-1638210335028-17559e21184a?auto=format&fit=crop&q=80&w=400',
    instruction: 'Lie on your back and cross your legs over each other in a scissor-like motion.'
  },
  cobra_stretch: {
    name: 'Cobra Stretch',
    duration: 30,
    restTime: 5,
    image: 'https://images.unsplash.com/photo-1544126592-807daa2b565b?auto=format&fit=crop&q=80&w=400',
    instruction: 'Lie prone and lift your chest off the ground, stretching your abs.'
  }
};

export const WORKOUT_PLAN: DayPlan[] = [
  {
    day: 1,
    exercises: [
      { id: 'd1-e1', ...EXERCISES.jumping_jacks },
      { id: 'd1-e2', ...EXERCISES.butt_kicks },
      { id: 'd1-e3', ...EXERCISES.crunches },
      { id: 'd1-e4', ...EXERCISES.heel_touches },
      { id: 'd1-e5', ...EXERCISES.plank },
      { id: 'd1-e6', ...EXERCISES.leg_raises },
      { id: 'd1-e7', ...EXERCISES.mountain_climbers },
      { id: 'd1-e8', ...EXERCISES.russian_twist },
      { id: 'd1-e9', ...EXERCISES.flutter_kicks },
      { id: 'd1-e10', ...EXERCISES.bicycle_crunches },
      { id: 'd1-e11', ...EXERCISES.plank_jacks },
      { id: 'd1-e12', ...EXERCISES.cobra_stretch },
    ],
    isLocked: false,
    isCompleted: false,
  },
  {
    day: 2,
    exercises: [
      { id: 'd2-e1', ...EXERCISES.high_knees },
      { id: 'd2-e2', ...EXERCISES.jumping_jacks },
      { id: 'd2-e3', ...EXERCISES.bicycle_crunches },
      { id: 'd2-e4', ...EXERCISES.scissors },
      { id: 'd2-e5', ...EXERCISES.side_plank_left },
      { id: 'd2-e6', ...EXERCISES.side_plank_right },
      { id: 'd2-e7', ...EXERCISES.mountain_climbers },
      { id: 'd2-e8', ...EXERCISES.leg_raises },
      { id: 'd2-e9', ...EXERCISES.plank },
      { id: 'd2-e10', ...EXERCISES.heel_touches },
      { id: 'd2-e11', ...EXERCISES.burpees },
      { id: 'd2-e12', ...EXERCISES.cobra_stretch },
    ],
    isLocked: true,
    isCompleted: false,
  },
  {
    day: 3,
    exercises: [
      { id: 'd3-e1', ...EXERCISES.butt_kicks },
      { id: 'd3-e2', ...EXERCISES.high_knees },
      { id: 'd3-e3', ...EXERCISES.crunches },
      { id: 'd3-e4', ...EXERCISES.flutter_kicks },
      { id: 'd3-e5', ...EXERCISES.plank_jacks },
      { id: 'd3-e6', ...EXERCISES.mountain_climbers },
      { id: 'd3-e7', ...EXERCISES.russian_twist },
      { id: 'd3-e8', ...EXERCISES.bicycle_crunches },
      { id: 'd3-e9', ...EXERCISES.scissors },
      { id: 'd3-e10', ...EXERCISES.plank },
      { id: 'd3-e11', ...EXERCISES.burpees },
      { id: 'd3-e12', ...EXERCISES.cobra_stretch },
    ],
    isLocked: true,
    isCompleted: false,
  },
  {
    day: 4,
    exercises: [
      { id: 'd4-e1', ...EXERCISES.jumping_jacks },
      { id: 'd4-e2', ...EXERCISES.high_knees },
      { id: 'd4-e3', ...EXERCISES.leg_raises },
      { id: 'd4-e4', ...EXERCISES.crunches },
      { id: 'd4-e5', ...EXERCISES.bicycle_crunches },
      { id: 'd4-e6', ...EXERCISES.plank },
      { id: 'd4-e7', ...EXERCISES.mountain_climbers },
      { id: 'd4-e8', ...EXERCISES.russian_twist },
      { id: 'd4-e9', ...EXERCISES.plank_jacks },
      { id: 'd4-e10', ...EXERCISES.side_plank_left },
      { id: 'd4-e11', ...EXERCISES.side_plank_right },
      { id: 'd4-e12', ...EXERCISES.burpees },
      { id: 'd4-e13', ...EXERCISES.cobra_stretch },
    ],
    isLocked: true,
    isCompleted: false,
  },
  {
    day: 5,
    exercises: [
      { id: 'd5-e1', ...EXERCISES.butt_kicks },
      { id: 'd5-e2', ...EXERCISES.jumping_jacks },
      { id: 'd5-e3', ...EXERCISES.high_knees },
      { id: 'd5-e4', ...EXERCISES.flutter_kicks },
      { id: 'd5-e5', ...EXERCISES.crunches },
      { id: 'd5-e6', ...EXERCISES.mountain_climbers },
      { id: 'd5-e7', ...EXERCISES.bicycle_crunches },
      { id: 'd5-e8', ...EXERCISES.scissors },
      { id: 'd5-e9', ...EXERCISES.plank_jacks },
      { id: 'd5-e10', ...EXERCISES.plank },
      { id: 'd5-e11', ...EXERCISES.heel_touches },
      { id: 'd5-e12', ...EXERCISES.burpees },
      { id: 'd5-e13', ...EXERCISES.cobra_stretch },
    ],
    isLocked: true,
    isCompleted: false,
  },
  {
    day: 6,
    exercises: [
      { id: 'd6-e1', ...EXERCISES.high_knees },
      { id: 'd6-e2', ...EXERCISES.jumping_jacks },
      { id: 'd6-e3', ...EXERCISES.mountain_climbers },
      { id: 'd6-e4', ...EXERCISES.plank_jacks },
      { id: 'd6-e5', ...EXERCISES.crunches },
      { id: 'd6-e6', ...EXERCISES.leg_raises },
      { id: 'd6-e7', ...EXERCISES.russian_twist },
      { id: 'd6-e8', ...EXERCISES.bicycle_crunches },
      { id: 'd6-e9', ...EXERCISES.flutter_kicks },
      { id: 'd6-e10', ...EXERCISES.side_plank_left },
      { id: 'd6-e11', ...EXERCISES.side_plank_right },
      { id: 'd6-e12', ...EXERCISES.plank },
      { id: 'd6-e13', ...EXERCISES.burpees },
      { id: 'd6-e14', ...EXERCISES.cobra_stretch },
    ],
    isLocked: true,
    isCompleted: false,
  },
  {
    day: 7,
    exercises: [
      { id: 'd7-e1', ...EXERCISES.butt_kicks },
      { id: 'd7-e2', ...EXERCISES.high_knees },
      { id: 'd7-e3', ...EXERCISES.jumping_jacks },
      { id: 'd7-e4', ...EXERCISES.mountain_climbers },
      { id: 'd7-e5', ...EXERCISES.scissors },
      { id: 'd7-e6', ...EXERCISES.plank_jacks },
      { id: 'd7-e7', ...EXERCISES.crunches },
      { id: 'd7-e8', ...EXERCISES.bicycle_crunches },
      { id: 'd7-e9', ...EXERCISES.flutter_kicks },
      { id: 'd7-e10', ...EXERCISES.heel_touches },
      { id: 'd7-e11', ...EXERCISES.russian_twist },
      { id: 'd7-e12', ...EXERCISES.plank },
      { id: 'd7-e13', ...EXERCISES.burpees },
      { id: 'd7-e14', ...EXERCISES.cobra_stretch },
    ],
    isLocked: true,
    isCompleted: false,
  },
  {
    day: 8,
    exercises: [
       { id: 'd8-e1', ...EXERCISES.jumping_jacks },
       { id: 'd8-e2', ...EXERCISES.high_knees },
       { id: 'd8-e3', ...EXERCISES.mountain_climbers },
       { id: 'd8-e4', ...EXERCISES.plank_jacks },
       { id: 'd8-e5', ...EXERCISES.burpees },
       { id: 'd8-e6', ...EXERCISES.crunches },
       { id: 'd8-e7', ...EXERCISES.leg_raises },
       { id: 'd8-e8', ...EXERCISES.bicycle_crunches },
       { id: 'd8-e9', ...EXERCISES.flutter_kicks },
       { id: 'd8-e10', ...EXERCISES.russian_twist },
       { id: 'd8-e11', ...EXERCISES.scissors },
       { id: 'd8-e12', ...EXERCISES.heel_touches },
       { id: 'd8-e13', ...EXERCISES.side_plank_left },
       { id: 'd8-e14', ...EXERCISES.side_plank_right },
       { id: 'd8-e15', ...EXERCISES.plank },
       { id: 'd8-e16', ...EXERCISES.cobra_stretch },
    ],
    isLocked: true,
    isCompleted: false,
  },
  {
    day: 9,
    exercises: [
       { id: 'd9-e1', ...EXERCISES.high_knees },
       { id: 'd9-e2', ...EXERCISES.butt_kicks },
       { id: 'd9-e3', ...EXERCISES.jumping_jacks },
       { id: 'd9-e4', ...EXERCISES.mountain_climbers },
       { id: 'd9-e5', ...EXERCISES.plank_jacks },
       { id: 'd9-e6', ...EXERCISES.burpees },
       { id: 'd9-e7', ...EXERCISES.crunches },
       { id: 'd9-e8', ...EXERCISES.bicycle_crunches },
       { id: 'd9-e9', ...EXERCISES.flutter_kicks },
       { id: 'd9-e10', ...EXERCISES.leg_raises },
       { id: 'd9-e11', ...EXERCISES.scissors },
       { id: 'd9-e12', ...EXERCISES.russian_twist },
       { id: 'd9-e13', ...EXERCISES.heel_touches },
       { id: 'd9-e14', ...EXERCISES.side_plank_left },
       { id: 'd9-e15', ...EXERCISES.side_plank_right },
       { id: 'd9-e16', ...EXERCISES.plank },
       { id: 'd9-e17', ...EXERCISES.cobra_stretch },
    ],
    isLocked: true,
    isCompleted: false,
  },
  {
    day: 10,
    exercises: [
       { id: 'd10-e1', ...EXERCISES.jumping_jacks },
       { id: 'd10-e2', ...EXERCISES.high_knees },
       { id: 'd10-e3', ...EXERCISES.mountain_climbers },
       { id: 'd10-e4', ...EXERCISES.plank_jacks },
       { id: 'd10-e5', ...EXERCISES.burpees },
       { id: 'd10-e6', ...EXERCISES.burpees }, // Second round for final day
       { id: 'd10-e7', ...EXERCISES.crunches },
       { id: 'd10-e8', ...EXERCISES.leg_raises },
       { id: 'd10-e9', ...EXERCISES.flutter_kicks },
       { id: 'd10-e10', ...EXERCISES.bicycle_crunches },
       { id: 'd10-e11', ...EXERCISES.scissors },
       { id: 'd10-e12', ...EXERCISES.russian_twist },
       { id: 'd10-e13', ...EXERCISES.heel_touches },
       { id: 'd10-e14', ...EXERCISES.side_plank_left },
       { id: 'd10-e15', ...EXERCISES.side_plank_right },
       { id: 'd10-e16', ...EXERCISES.plank },
       { id: 'd10-e17', ...EXERCISES.cobra_stretch },
    ],
    isLocked: true,
    isCompleted: false,
  }
];


export const DIET_PLANS: DietDay[] = [
  {
    day: 1,
    totalCalories: 1450,
    waterIntake: '2.5 Liters',
    tip: 'Avoid all sugary drinks today.',
    meals: [
      {
        type: 'Breakfast',
        icon: 'Coffee',
        items: [{ food: 'Oatmeal with Berries', quantity: '100g', calories: 180, protein: 6, fiber: 5, carbs: 32, fats: 3 }]
      },
      {
        type: 'Lunch',
        icon: 'Utensils',
        items: [{ food: 'Grilled Chicken Salad', quantity: '150g Chicken', calories: 420, protein: 35, fiber: 4, carbs: 12, fats: 15 }]
      },
      {
        type: 'Snacks',
        icon: 'Apple',
        items: [{ food: 'Greek Yogurt', quantity: '1 Cup', calories: 150, protein: 12, fiber: 0, carbs: 8, fats: 4 }]
      },
      {
        type: 'Dinner',
        icon: 'Moon',
        items: [{ food: 'Baked Salmon & Broccoli', quantity: '120g Salmon', calories: 380, protein: 28, fiber: 6, carbs: 10, fats: 18 }]
      }
    ]
  },
  {
    day: 2,
    totalCalories: 1380,
    waterIntake: '3 Liters',
    tip: 'Include protein in every meal to stay full.',
    meals: [
      {
        type: 'Breakfast',
        icon: 'Coffee',
        items: [{ food: 'Scrambled Eggs (3) & Spinach', quantity: '2 Large Eggs', calories: 220, protein: 18, fiber: 2, carbs: 2, fats: 14 }]
      },
      {
        type: 'Lunch',
        icon: 'Utensils',
        items: [{ food: 'Quinoa & Black Bean Bowl', quantity: '1 Bowl', calories: 450, protein: 15, fiber: 12, carbs: 55, fats: 8 }]
      },
      {
        type: 'Snacks',
        icon: 'Apple',
        items: [{ food: 'Almonds', quantity: '15 Nuts', calories: 100, protein: 4, fiber: 3, carbs: 4, fats: 9 }]
      },
      {
        type: 'Dinner',
        icon: 'Moon',
        items: [{ food: 'Turkey Stir Fry', quantity: '150g Turkey', calories: 350, protein: 32, fiber: 5, carbs: 15, fats: 10 }]
      }
    ]
  },
  {
    day: 3,
    totalCalories: 1420,
    waterIntake: '2.5 Liters',
    tip: 'Fiber is your friend for a flat belly.',
    meals: [
      {
        type: 'Breakfast',
        icon: 'Coffee',
        items: [{ food: 'Chia Seed Pudding', quantity: '1 Jar', calories: 250, protein: 8, fiber: 11, carbs: 18, fats: 16 }]
      },
      {
        type: 'Lunch',
        icon: 'Utensils',
        items: [{ food: 'Tuna Salad (No Mayo)', quantity: '1 Can', calories: 380, protein: 30, fiber: 3, carbs: 5, fats: 12 }]
      },
      {
        type: 'Snacks',
        icon: 'Apple',
        items: [{ food: 'Cottage Cheese & Pineapple', quantity: '1/2 Cup', calories: 160, protein: 14, fiber: 1, carbs: 12, fats: 4 }]
      },
      {
        type: 'Dinner',
        icon: 'Moon',
        items: [{ food: 'Grilled Shrimp & Asparagus', quantity: '10 Shrimp', calories: 320, protein: 25, fiber: 4, carbs: 8, fats: 9 }]
      }
    ]
  },
  {
    day: 4,
    totalCalories: 1480,
    waterIntake: '2.5 Liters',
    tip: 'Green tea can help boost metabolism.',
    meals: [
      {
        type: 'Breakfast',
        icon: 'Coffee',
        items: [{ food: 'Whole Grain Toast & Avocado', quantity: '1 Slice', calories: 280, protein: 6, fiber: 8, carbs: 25, fats: 18 }]
      },
      {
        type: 'Lunch',
        icon: 'Utensils',
        items: [{ food: 'Lentil Soup', quantity: '2 Cups', calories: 400, protein: 18, fiber: 15, carbs: 45, fats: 4 }]
      },
      {
        type: 'Snacks',
        icon: 'Apple',
        items: [{ food: 'Apple with Peanut Butter', quantity: '1 Medium', calories: 210, protein: 5, fiber: 5, carbs: 22, fats: 14 }]
      },
      {
        type: 'Dinner',
        icon: 'Moon',
        items: [{ food: 'Chicken Breast & Roasted Carrots', quantity: '150g', calories: 360, protein: 34, fiber: 5, carbs: 12, fats: 10 }]
      }
    ]
  },
  {
    day: 5,
    totalCalories: 1400,
    waterIntake: '3 Liters',
    tip: 'Focus on chewing your food slowly.',
    meals: [
      {
        type: 'Breakfast',
        icon: 'Coffee',
        items: [{ food: 'Smoothie (Protein + Greens)', quantity: '1 Glass', calories: 220, protein: 22, fiber: 6, carbs: 15, fats: 5 }]
      },
      {
        type: 'Lunch',
        icon: 'Utensils',
        items: [{ food: 'Beef & Broccoli Stir-fry', quantity: '120g Beef', calories: 450, protein: 28, fiber: 4, carbs: 15, fats: 22 }]
      },
      {
        type: 'Snacks',
        icon: 'Apple',
        items: [{ food: 'Hard Boiled Eggs (2)', quantity: '2 Eggs', calories: 140, protein: 13, fiber: 0, carbs: 1, fats: 10 }]
      },
      {
        type: 'Dinner',
        icon: 'Moon',
        items: [{ food: 'Baked Cod & Summer Squash', quantity: '150g Cod', calories: 310, protein: 32, fiber: 3, carbs: 8, fats: 11 }]
      }
    ]
  },
  {
    day: 6,
    totalCalories: 1350,
    waterIntake: '2.5 Liters',
    tip: 'Limit salt intake to reduce bloating.',
    meals: [
      {
        type: 'Breakfast',
        icon: 'Coffee',
        items: [{ food: 'Buckwheat Pancakes (2)', quantity: '2 Small', calories: 240, protein: 8, fiber: 4, carbs: 35, fats: 6 }]
      },
      {
        type: 'Lunch',
        icon: 'Utensils',
        items: [{ food: 'Chickpea Salad Sandwhich (Whole Wheat)', quantity: '1 Sandwich', calories: 420, protein: 12, fiber: 10, carbs: 55, fats: 12 }]
      },
      {
        type: 'Snacks',
        icon: 'Apple',
        items: [{ food: 'Walnuts', quantity: '7 Halves', calories: 130, protein: 3, fiber: 2, carbs: 2, fats: 13 }]
      },
      {
        type: 'Dinner',
        icon: 'Moon',
        items: [{ food: 'Tofu & Mixed Veggie Sauté', quantity: '200g Tofu', calories: 380, protein: 20, fiber: 7, carbs: 18, fats: 22 }]
      }
    ]
  },
  {
    day: 7,
    totalCalories: 1450,
    waterIntake: '3 Liters',
    tip: 'A regular sleep schedule helps fat loss.',
    meals: [
      {
        type: 'Breakfast',
        icon: 'Coffee',
        items: [{ food: 'Egg White Omelet', quantity: '4 Egg Whites', calories: 180, protein: 22, fiber: 3, carbs: 5, fats: 4 }]
      },
      {
        type: 'Lunch',
        icon: 'Utensils',
        items: [{ food: 'Grilled Salmon Burger Patty', quantity: '1 Patty', calories: 390, protein: 26, fiber: 0, carbs: 10, fats: 22 }]
      },
      {
        type: 'Snacks',
        icon: 'Apple',
        items: [{ food: 'Hummus & Celery', quantity: '4 Sticks', calories: 120, protein: 4, fiber: 4, carbs: 12, fats: 8 }]
      },
      {
        type: 'Dinner',
        icon: 'Moon',
        items: [{ food: 'Roasted Cauliflower Steak & Rice', quantity: '1/2 Brown Rice', calories: 440, protein: 10, fiber: 9, carbs: 60, fats: 12 }]
      }
    ]
  },
  {
    day: 8,
    totalCalories: 1400,
    waterIntake: '2.5 Liters',
    tip: 'Consistency is key to seeing results.',
    meals: [
      {
        type: 'Breakfast',
        icon: 'Coffee',
        items: [{ food: 'Ricotta & Tomato Toast', quantity: '1 Slice', calories: 210, protein: 10, fiber: 4, carbs: 22, fats: 9 }]
      },
      {
        type: 'Lunch',
        icon: 'Utensils',
        items: [{ food: 'Chicken Quinoa Soup', quantity: '2 Bowls', calories: 430, protein: 32, fiber: 6, carbs: 32, fats: 12 }]
      },
      {
        type: 'Snacks',
        icon: 'Apple',
        items: [{ food: 'Pear with Low-fat Cheese', quantity: '1 Small', calories: 150, protein: 7, fiber: 5, carbs: 18, fats: 6 }]
      },
      {
        type: 'Dinner',
        icon: 'Moon',
        items: [{ food: 'Steamed Haddock & Peas', quantity: '180g fish', calories: 340, protein: 38, fiber: 6, carbs: 15, fats: 5 }]
      }
    ]
  },
  {
    day: 9,
    totalCalories: 1320,
    waterIntake: '3 Liters',
    tip: 'Stay active even on rest days.',
    meals: [
      {
        type: 'Breakfast',
        icon: 'Coffee',
        items: [{ food: 'Overnight Oats', quantity: '1 Pot', calories: 280, protein: 10, fiber: 7, carbs: 38, fats: 8 }]
      },
      {
        type: 'Lunch',
        icon: 'Utensils',
        items: [{ food: 'Turkey & Swiss Wraps', quantity: '2 Wraps', calories: 360, protein: 28, fiber: 4, carbs: 24, fats: 14 }]
      },
      {
        type: 'Snacks',
        icon: 'Apple',
        items: [{ food: 'Sunflower Seeds', quantity: '28g', calories: 160, protein: 6, fiber: 3, carbs: 6, fats: 14 }]
      },
      {
        type: 'Dinner',
        icon: 'Moon',
        items: [{ food: 'Zucchini Noodles with Pesto', quantity: '2 Cups', calories: 410, protein: 12, fiber: 6, carbs: 18, fats: 32 }]
      }
    ]
  },
  {
    day: 10,
    totalCalories: 1410,
    waterIntake: '3 Liters',
    tip: 'Well done! Maintain these healthy habits.',
    meals: [
      {
        type: 'Breakfast',
        icon: 'Coffee',
        items: [{ food: 'French Toast (Healthy Ver)', quantity: '2 Slices', calories: 310, protein: 14, fiber: 6, carbs: 35, fats: 8 }]
      },
      {
        type: 'Lunch',
        icon: 'Utensils',
        items: [{ food: 'Grilled Lemon Herb Chicken', quantity: '200g', calories: 420, protein: 44, fiber: 3, carbs: 10, fats: 15 }]
      },
      {
        type: 'Snacks',
        icon: 'Apple',
        items: [{ food: 'Protein Bar (Low Sugar)', quantity: '1 Bar', calories: 190, protein: 20, fiber: 8, carbs: 15, fats: 7 }]
      },
      {
        type: 'Dinner',
        icon: 'Moon',
        items: [{ food: 'Lean Steak & Salad', quantity: '120g Steak', calories: 380, protein: 32, fiber: 4, carbs: 8, fats: 22 }]
      }
    ]
  }
];

export const PROGRESS_DATA = [
  { name: 'Day 1', weight: 80, belly: 102 },
  { name: 'Day 2', weight: 79.8, belly: 101.8 },
  { name: 'Day 3', weight: 79.5, belly: 101.5 },
  { name: 'Day 4', weight: 79.2, belly: 101.2 },
  { name: 'Day 5', weight: 78.9, belly: 100.8 },
];
