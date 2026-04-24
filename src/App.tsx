/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ChevronLeft, 
  Flame, 
  Timer, 
  TrendingUp, 
  Calendar, 
  Utensils, 
  User, 
  Play, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  Scale,
  Clock,
  Heart,
  Settings,
  AlertCircle,
  Dumbbell,
  Zap,
  UserPlus,
  Apple,
  Moon,
  Camera,
  X,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Screen, UserData, DayPlan, Exercise as ExerciseType, DietDayProgress } from './types';
import { WORKOUT_PLAN, DIET_PLANS, PROGRESS_DATA } from './constants';

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg');
};

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  className, 
  variant = 'primary',
  disabled = false
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
}) => {
  const variants = {
    primary: 'orange-gradient text-white shadow-lg shadow-orange-500/20',
    secondary: 'bg-dark text-white shadow-lg',
    outline: 'border-2 border-primary text-primary bg-transparent',
    ghost: 'bg-transparent text-gray-500 hover:text-dark'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all active:opacity-90 disabled:opacity-50',
        variants[variant],
        className
      )}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className, onClick }: any) => (
  <motion.div 
    whileTap={onClick ? { scale: 0.98 } : undefined}
    onClick={onClick}
    className={cn('bg-white rounded-3xl p-6 shadow-soft transition-all', className)}
  >
    {children}
  </motion.div>
);

// --- App Entry ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [prevScreen, setPrevScreen] = useState<Screen>('splash');
  const [userData, setUserData] = useState<UserData>({
    name: 'Fitness Pro',
    gender: 'male',
    age: '24',
    height: '175',
    heightUnit: 'cm',
    weight: '75',
    weightUnit: 'kg',
    goal: 'Lose belly fat',
    activityLevel: 'Moderate',
    fitnessLevel: 'Intermediate',
    hasDisease: false,
    diseaseInfo: '',
    medicalConditions: {
      diabetes: false,
      heartIssues: false,
      injuries: false
    },
    onboardingComplete: false,
    points: 0,
    referralsCount: 0,
    referralPointsEarned: 0,
    profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
    notifications: {
      workoutReminders: true,
      dietReminders: true,
      motivation: true
    }
  });

  const [currentDay, setCurrentDay] = useState(1);
  const [workoutProgress, setWorkoutProgress] = useState<DayPlan[]>(WORKOUT_PLAN);
  const [dietProgress, setDietProgress] = useState<DietDayProgress[]>(
    DIET_PLANS.map((plan, idx) => ({
      day: plan.day,
      isLocked: idx !== 0,
      isCompleted: false,
    }))
  );
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);

  const [showRewardToast, setShowRewardToast] = useState(false);
  const [lastRewardType, setLastRewardType] = useState('');

  const triggerRewardToast = (type: string) => {
    setLastRewardType(type);
    setShowRewardToast(true);
    setTimeout(() => setShowRewardToast(false), 3000);
  };

  // Load persistence
  useEffect(() => {
    const savedUserData = localStorage.getItem('fit_belly_user_data');
    const savedWorkoutProgress = localStorage.getItem('fit_belly_workout_progress');
    const savedDietProgress = localStorage.getItem('fit_belly_diet_progress');

    if (savedUserData) {
      try {
        setUserData(JSON.parse(savedUserData));
      } catch (e) {
        console.error('Failed to load user data', e);
      }
    }
    if (savedWorkoutProgress) {
      try {
        setWorkoutProgress(JSON.parse(savedWorkoutProgress));
      } catch (e) {
        console.error('Failed to load workout progress', e);
      }
    }
    if (savedDietProgress) {
      try {
        setDietProgress(JSON.parse(savedDietProgress));
      } catch (e) {
        console.error('Failed to load diet progress', e);
      }
    }
  }, []);

  // Save persistence
  useEffect(() => {
    if (userData.onboardingComplete) {
      localStorage.setItem('fit_belly_user_data', JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (userData.onboardingComplete) {
      localStorage.setItem('fit_belly_workout_progress', JSON.stringify(workoutProgress));
    }
  }, [workoutProgress, userData.onboardingComplete]);

  useEffect(() => {
    if (userData.onboardingComplete) {
      localStorage.setItem('fit_belly_diet_progress', JSON.stringify(dietProgress));
    }
  }, [dietProgress, userData.onboardingComplete]);

  // Persistence simulation (in-memory for demo)
  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => {
        setScreen(userData.onboardingComplete ? 'dashboard' : 'onboarding');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [screen, userData.onboardingComplete]);

  const navigate = (to: Screen) => {
    setPrevScreen(screen);
    setScreen(to);
  };

  const handleOnboardingSubmit = () => {
    setUserData(prev => ({ ...prev, onboardingComplete: true }));
    navigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start sm:py-8">
      {/* Mobile Wrapper */}
      <div className="w-full max-w-[420px] aspect-[9/19.5] bg-white sm:rounded-[3rem] sm:shadow-2xl shadow-black/20 overflow-hidden relative border-8 border-gray-900 ring-4 ring-gray-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-50"></div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full overflow-y-auto no-scrollbar pt-8 pb-24"
          >
            {screen === 'splash' && <SplashScreen />}
            {screen === 'onboarding' && (
              <OnboardingFlow 
                userData={userData} 
                setUserData={setUserData} 
                onComplete={handleOnboardingSubmit} 
              />
            )}
            {screen === 'dashboard' && (
              <Dashboard 
                userData={userData} 
                workoutProgress={workoutProgress} 
                navigate={navigate} 
              />
            )}
            {screen === 'workoutPlan' && (
              <WorkoutPlan 
                userData={userData}
                setUserData={setUserData}
                workoutProgress={workoutProgress} 
                setWorkoutProgress={setWorkoutProgress}
                navigate={navigate}
                onSelectWorkout={(day: number) => {
                  setCurrentDay(day);
                  navigate('dayDetails');
                }}
              />
            )}
            {screen === 'dayDetails' && (
              <DayDetails 
                userData={userData}
                day={currentDay}
                workoutProgress={workoutProgress}
                navigate={navigate}
                onStart={() => navigate('exerciseTimer')}
              />
            )}
            {screen === 'exerciseTimer' && (
              <ExerciseTimer 
                day={currentDay} 
                workoutProgress={workoutProgress} 
                onComplete={(day) => {
                  const dayIdx = day - 1;
                  const alreadyCompleted = workoutProgress[dayIdx].isCompleted;
                  
                  const updated = [...workoutProgress];
                  updated[dayIdx].isCompleted = true;
                  
                  // Set unlock timer for next day if it exists
                  if (day < 10) {
                    const nextDayIdx = day;
                    if (updated[nextDayIdx].isLocked && !updated[nextDayIdx].unlockTimestamp) {
                      updated[nextDayIdx].unlockTimestamp = Date.now() + 12 * 60 * 60 * 1000;
                    }
                  }
                  
                  setWorkoutProgress(updated);
                  
                  // Award points only if not previously completed
                  if (!alreadyCompleted) {
                    setUserData(prev => ({ ...prev, points: prev.points + 2 }));
                    triggerRewardToast('Workout Reward');
                  }
                  
                  navigate('workoutPlan');
                }}
                onClose={() => navigate('dayDetails')}
              />
            )}
            {screen === 'dietPlan' && (
              <DietPlan 
                navigate={navigate} 
                userData={userData}
                setUserData={setUserData}
                dietProgress={dietProgress}
                setDietProgress={setDietProgress}
                triggerRewardToast={triggerRewardToast}
              />
            )}
            {screen === 'progress' && <ProgressTracking navigate={navigate} />}
            {screen === 'profile' && <ProfileScreen userData={userData} navigate={navigate} setUserData={setUserData} />}
            {screen === 'personalInfo' && (
              <PersonalInformation 
                userData={userData} 
                setUserData={setUserData} 
                navigate={navigate} 
              />
            )}
            {screen === 'healthData' && (
              <HealthData 
                userData={userData} 
                setUserData={setUserData} 
                navigate={navigate} 
              />
            )}
            {screen === 'workoutHistory' && (
              <WorkoutHistory 
                workoutProgress={workoutProgress} 
                navigate={navigate} 
              />
            )}
            {screen === 'notifications' && (
              <NotificationSettings 
                userData={userData} 
                setUserData={setUserData} 
                navigate={navigate} 
              />
            )}
            {screen === 'helpSupport' && <HelpSupport navigate={navigate} />}
            {screen === 'referEarn' && <ReferEarn userData={userData} navigate={navigate} />}
            {screen === 'earnPoints' && (
              <EarnPoints 
                userData={userData} 
                setUserData={setUserData} 
                navigate={navigate} 
                triggerRewardToast={triggerRewardToast}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Global Reward Toast */}
        <AnimatePresence>
          {showRewardToast && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-24 left-6 right-6 z-50 pointer-events-none"
            >
              <div className="bg-dark text-white px-6 py-4 rounded-3xl flex items-center justify-between shadow-2xl">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-xl">
                      <Zap size={16} fill="white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">{lastRewardType}</div>
                      <div className="text-sm font-black">+2 Points Earned 🎉</div>
                    </div>
                 </div>
                 <CheckCircle2 className="text-green-500" size={24} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Bottom Navigation */}
        {!['splash', 'onboarding', 'exerciseTimer'].includes(screen) && (
          <div className="absolute bottom-6 left-6 right-6 h-16 glass rounded-2xl flex items-center justify-around px-4 shadow-xl z-40">
            <NavIcon 
              active={screen === 'dashboard'} 
              icon={<Calendar size={20} />} 
              onClick={() => navigate('dashboard')} 
            />
            <NavIcon 
              active={screen === 'workoutPlan'} 
              icon={<Dumbbell size={20} />} 
              onClick={() => navigate('workoutPlan')} 
            />
            <NavIcon 
              active={screen === 'dietPlan'} 
              icon={<Utensils size={20} />} 
              onClick={() => navigate('dietPlan')} 
            />
            <NavIcon 
              active={screen === 'progress'} 
              icon={<TrendingUp size={20} />} 
              onClick={() => navigate('progress')} 
            />
            <NavIcon 
              active={screen === 'profile'} 
              icon={<User size={20} />} 
              onClick={() => navigate('profile')} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

const NavIcon = ({ active, icon, onClick }: { active: boolean; icon: React.ReactNode; onClick: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={cn(
      'p-3 rounded-xl transition-colors',
      active ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600'
    )}
  >
    {icon}
  </motion.button>
);

// --- Screen Components ---

const SplashScreen = () => (
  <div className="h-full flex flex-col items-center justify-center p-8 orange-gradient text-white">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-white/20 p-6 rounded-[2.5rem] backdrop-blur-xl mb-6 shadow-2xl"
    >
      <Flame size={64} fill="white" strokeWidth={0} />
    </motion.div>
    <motion.h1 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-4xl font-bold text-center leading-tight mb-2"
    >
      Lose Belly Fat<br/>in 10 Days
    </motion.h1>
    <motion.p 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-white/80 text-center"
    >
      Personalized for your body
    </motion.p>
    
    <div className="absolute bottom-12 flex gap-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
          className="w-2 h-2 bg-white rounded-full"
        />
      ))}
    </div>
  </div>
);

const OnboardingFlow = ({ userData, setUserData, onComplete }: { userData: UserData; setUserData: any; onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else onComplete();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button onClick={prevStep} className={cn("p-2 rounded-full bg-gray-100", step === 1 && "invisible")}>
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={cn("h-1.5 rounded-full transition-all duration-300", 
                i + 1 <= step ? "w-6 bg-primary" : "w-1.5 bg-gray-200"
              )} 
            />
          ))}
        </div>
        <div className="w-8 h-8" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="flex-1"
        >
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">What's your gender?</h2>
              <p className="text-gray-500">We will adjust the plan based on your physiology.</p>
              <div className="grid grid-cols-1 gap-4 pt-4">
                <OnboardingCard 
                  selected={userData.gender === 'male'} 
                  onClick={() => setUserData({ ...userData, gender: 'male' })}
                  title="Male"
                  subtitle="Strong & Lean"
                  image="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200"
                />
                <OnboardingCard 
                  selected={userData.gender === 'female'} 
                  onClick={() => setUserData({ ...userData, gender: 'female' })}
                  title="Female"
                  subtitle="Tone & Shape"
                  image="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">How old are you?</h2>
              <div className="flex flex-col items-center justify-center h-48">
                <div className="text-6xl font-black text-primary mb-4">{userData.age || '25'}</div>
                <input 
                  type="range" 
                  min="13" 
                  max="80" 
                  value={userData.age || 25}
                  onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                  className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">Physical info</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Height (cm)</label>
                  <input 
                    type="number" 
                    placeholder="175"
                    value={userData.height}
                    onChange={(e) => setUserData({ ...userData, height: e.target.value })}
                    className="w-full bg-gray-100 p-4 rounded-2xl text-xl font-bold outline-none border-2 border-transparent focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Weight (kg)</label>
                  <input 
                    type="number" 
                    placeholder="75"
                    value={userData.weight}
                    onChange={(e) => setUserData({ ...userData, weight: e.target.value })}
                    className="w-full bg-gray-100 p-4 rounded-2xl text-xl font-bold outline-none border-2 border-transparent focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Fitness goal</h2>
              <div className="grid gap-4">
                {['Lose belly fat', 'Weight loss', 'Build muscle', 'Stay active'].map(goal => (
                  <button
                    key={goal}
                    onClick={() => setUserData({ ...userData, goal })}
                    className={cn(
                      "p-5 rounded-2xl border-2 text-left font-semibold transition-all",
                      userData.goal === goal ? "border-primary bg-primary/5 text-primary" : "border-gray-100 text-gray-600"
                    )}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Activity level</h2>
              <div className="grid gap-4">
                {['Sedentary', 'Lightly Active', 'Moderate', 'Very Active'].map(level => (
                  <button
                    key={level}
                    onClick={() => setUserData({ ...userData, activityLevel: level })}
                    className={cn(
                      "p-5 rounded-2xl border-2 text-left font-semibold transition-all",
                      userData.activityLevel === level ? "border-primary bg-primary/5 text-primary" : "border-gray-100 text-gray-600"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex gap-4">
                <AlertCircle className="text-red-500 shrink-0" />
                <div className="text-sm text-red-800">
                  <span className="font-bold">Medical Disclaimer:</span> Please consult with a doctor before starting any intense workout program.
                </div>
              </div>
              <h2 className="text-2xl font-bold">Any health issues?</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-2xl bg-gray-100">
                  <span className="font-semibold">Heart issues, diabetes, or injuries?</span>
                  <button 
                    onClick={() => setUserData({ ...userData, hasDisease: !userData.hasDisease })}
                    className={cn(
                      "w-12 h-6 rounded-full relative transition-all duration-300",
                      userData.hasDisease ? "bg-primary" : "bg-gray-300"
                    )}
                  >
                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm", userData.hasDisease ? "right-1" : "left-1")} />
                  </button>
                </div>
                {userData.hasDisease && (
                  <textarea 
                    placeholder="Tell us more about your condition..."
                    value={userData.diseaseInfo}
                    onChange={(e) => setUserData({ ...userData, diseaseInfo: e.target.value })}
                    className="w-full bg-gray-100 p-4 rounded-2xl min-h-[100px] outline-none border-2 border-transparent focus:border-primary transition-all"
                  />
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="pt-8 bg-white pb-4">
        <Button onClick={nextStep}>
          {step === totalSteps ? 'Get Started' : 'Continue'}
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};

const OnboardingCard = ({ selected, onClick, title, subtitle, image }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "relative h-32 rounded-3xl overflow-hidden flex items-center transition-all duration-300 ring-4",
      selected ? "ring-primary" : "ring-transparent"
    )}
  >
    <img src={image} className="absolute inset-0 w-full h-full object-cover brightness-50" />
    <div className="relative z-10 px-6 text-left">
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-white/70 text-sm">{subtitle}</p>
    </div>
    {selected && (
      <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
        <CheckCircle2 size={16} />
      </div>
    )}
  </button>
);

const PointsBadge = ({ points, onClick }: { points: number; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-orange-100 px-3 py-2 rounded-2xl flex items-center gap-2 border border-orange-200 active:scale-95 transition-transform"
  >
    <Zap size={18} className="text-primary" fill="currentColor" />
    <span className="font-black text-primary text-sm">{points} PTS</span>
  </button>
);

const Dashboard = ({ userData, workoutProgress, navigate }: { userData: UserData; workoutProgress: DayPlan[]; navigate: any }) => {
  const completedDays = workoutProgress.filter(d => d.isCompleted).length;
  const nextDay = workoutProgress.find(d => !d.isCompleted)?.day || 10;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-500 text-sm">Welcome back,</h2>
          <h1 className="text-2xl font-bold">{userData.name}! 👋</h1>
        </div>
        <div className="flex items-center gap-3">
          <PointsBadge points={userData.points} onClick={() => navigate('earnPoints')} />
          <div 
            onClick={() => navigate('profile')}
            className="w-12 h-12 rounded-2xl overflow-hidden shadow-soft border-2 border-white cursor-pointer active:scale-95 transition-transform"
          >
            <img src={userData.profileImage} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <Card className="orange-gradient text-white !p-0 overflow-hidden relative">
        <div className="p-6 space-y-4 relative z-10 w-2/3">
          <h2 className="text-3xl font-black leading-tight">Stay Consistent, <br/>Stay Strong!</h2>
          <p className="text-white/80 text-xs">You've completed {completedDays} out of 10 days.</p>
          <Button 
            variant="secondary" 
            className="!py-2 !rounded-xl text-sm !w-40 bg-white text-primary mt-2"
            onClick={() => navigate('exerciseTimer')}
          >
            Daily Workout <ArrowRight size={16} />
          </Button>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1548691905-57c36cc8d93f?auto=format&fit=crop&q=80&w=200" 
          className="absolute bottom-0 right-0 h-48 object-contain scale-x-[-1] opacity-60"
        />
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<Flame className="text-orange-500" />} label="Calories" value="1,240" unit="kcal" />
        <StatCard icon={<Timer className="text-blue-500" />} label="Total Time" value="180" unit="min" />
      </div>

      {/* Workout Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">My 10-Day Program</h3>
          <button onClick={() => navigate('workoutPlan')} className="text-primary text-sm font-semibold flex items-center gap-1">
            See all <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {workoutProgress.map((day) => (
            <DayProgressCircle key={day.day} day={day} active={day.day === nextDay} />
          ))}
        </div>
      </div>

      {/* Progress Chart Mockup */}
      <Card className="!p-4 overflow-hidden h-40">
        <h4 className="font-bold text-sm mb-4">Weight Trend</h4>
        <div className="h-full w-full -ml-8">
          <ResponsiveContainer width="115%" height="100%">
            <LineChart data={PROGRESS_DATA}>
              <Line type="monotone" dataKey="weight" stroke="#FF6B00" strokeWidth={3} dot={{ r: 4, fill: '#FF6B00' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <div className="h-10" />
    </div>
  );
};

const StatCard = ({ icon, label, value, unit }: any) => (
  <Card className="space-y-2 !p-4">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-gray-100 rounded-xl">{icon}</div>
      <ArrowRight size={14} className="text-gray-300" />
    </div>
    <div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label} ({unit})</div>
    </div>
  </Card>
);

const DayProgressCircle = ({ day, active }: { day: DayPlan; active: boolean; key?: any }) => (
  <div className="flex flex-col items-center gap-2 min-w-[64px]">
    <div className={cn(
      "w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm",
      day.isCompleted ? "bg-green-500 border-green-500 text-white" : 
      active ? "bg-primary border-primary text-white shadow-lg shadow-orange-200" : 
      day.isLocked ? "bg-gray-50 border-gray-100 text-gray-300" : "bg-white border-gray-100 text-gray-800"
    )}>
      {day.isCompleted ? <CheckCircle2 size={24} /> : 
       day.isLocked ? <Lock size={18} /> : 
       <span className="font-bold">{day.day}</span>}
    </div>
    <span className={cn("text-[10px] font-bold uppercase", active ? "text-primary" : "text-gray-400")}>Day {day.day}</span>
  </div>
);

const WorkoutPlan = ({ userData, setUserData, workoutProgress, setWorkoutProgress, navigate, onSelectWorkout }: any) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePointUnlock = (dayNum: number) => {
    if (userData.points >= 5) {
      setUserData((prev: any) => ({ ...prev, points: prev.points - 5 }));
      const updated = [...workoutProgress];
      updated[dayNum - 1].isLocked = false;
      updated[dayNum - 1].unlockTimestamp = undefined;
      setWorkoutProgress(updated);
    }
  };

  const formatCountdown = (target: number) => {
    const diff = Math.max(0, target - now);
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('dashboard')} className="p-2 rounded-xl bg-gray-100">
            <ChevronLeft />
          </button>
          <h1 className="text-2xl font-bold">10-Day Plan</h1>
        </div>
        <PointsBadge points={userData.points} onClick={() => navigate('earnPoints')} />
      </div>

      <div className="space-y-4">
        {workoutProgress.map((day: DayPlan) => {
          const isTimerActive = day.unlockTimestamp && day.unlockTimestamp > now;
          const isNaturallyUnlocked = day.unlockTimestamp && day.unlockTimestamp <= now;
          
          // Actually unlock if timer is done
          if (isNaturallyUnlocked && day.isLocked) {
             const updated = [...workoutProgress];
             updated[day.day - 1].isLocked = false;
             updated[day.day - 1].unlockTimestamp = undefined;
             setWorkoutProgress(updated);
          }

          const isAvailable = !day.isLocked && !day.isCompleted;

          return (
            <motion.div
              key={day.day}
              whileTap={isAvailable ? { scale: 0.98 } : undefined}
              onClick={() => isAvailable && onSelectWorkout(day.day)}
              className={cn(
                "p-4 rounded-3xl border-2 transition-all overflow-hidden relative min-h-24",
                day.isCompleted ? "bg-green-50 border-green-100" :
                isAvailable ? "bg-white border-gray-100 shadow-soft" : 
                "bg-gray-50 border-transparent opacity-60 grayscale-[0.5]"
              )}
            >
              <div className="flex items-center gap-4 relative z-10 w-full">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0",
                  day.isCompleted ? "bg-green-500 text-white" :
                  isAvailable ? "bg-primary text-white" : "bg-gray-200 text-gray-400"
                )}>
                  {day.day}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Belly Burn Day {day.day}</h3>
                    {day.isCompleted && <CheckCircle2 className="text-green-500" size={14} />}
                  </div>
                  
                  {isAvailable || day.isCompleted ? (
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Clock size={12} /> {Math.ceil(day.exercises.reduce((acc, e) => acc + e.duration + e.restTime, 0) / 60)} mins • {day.exercises.length} Exercises
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 mt-1">
                       {isTimerActive ? (
                         <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-100 px-2 py-0.5 rounded-full self-start">
                           <Timer size={10} /> Unlocks in {formatCountdown(day.unlockTimestamp!)}
                         </div>
                       ) : (
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                           <Lock size={10} /> Locked
                         </span>
                       )}
                    </div>
                  )}
                </div>

                <div className="relative z-10 shrink-0">
                  {day.isCompleted ? <CheckCircle2 className="text-green-500" size={28} /> : 
                   isAvailable ? <div className="p-3 bg-primary/10 rounded-xl text-primary"><Play size={20} fill="currentColor" /></div> : 
                   isTimerActive ? (
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         handlePointUnlock(day.day);
                       }}
                       disabled={userData.points < 5}
                       className={cn(
                         "flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all",
                         userData.points >= 5 ? "bg-orange-50 border-primary/20 text-primary" : "bg-gray-100 border-transparent text-gray-300"
                       )}
                     >
                        <Zap size={16} fill={userData.points >= 5 ? "currentColor" : "none"} />
                        <span className="text-[8px] font-black">Skip: 5pts</span>
                     </button>
                   ) : (
                     <Lock className="text-gray-300" size={24} />
                   )
                  }
                </div>
              </div>

              {/* Visual fluff */}
              {!day.isLocked && (
                <img 
                  src={day.exercises[0].image} 
                  className="absolute right-0 top-0 h-full w-32 object-cover opacity-10 grayscale" 
                />
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="h-10" />
    </div>
  );
};

const DayDetails = ({ userData, day, workoutProgress, navigate, onStart }: any) => {
  const currentDayPlan = workoutProgress[day - 1];
  const totalDuration = Math.ceil(currentDayPlan.exercises.reduce((acc: number, e: any) => acc + e.duration + e.restTime, 0) / 60);

  return (
    <div className="h-full bg-white flex flex-col">
       <div className="relative h-72 shrink-0">
          <img src={currentDayPlan.exercises[0].image} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <button 
            onClick={() => navigate('workoutPlan')}
            className="absolute top-8 left-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="absolute top-8 right-6">
             <PointsBadge points={userData.points} onClick={() => navigate('earnPoints')} />
          </div>
          <div className="absolute bottom-8 left-6 right-6">
             <div className="text-primary font-black uppercase tracking-widest text-xs mb-1">Day {day} • {currentDayPlan.day > 1 ? 'Intermediate' : 'Beginner'}</div>
             <h1 className="text-4xl font-black text-white uppercase tracking-tight">Belly Fat Burn</h1>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100">
                <div className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-1">Duration</div>
                <div className="font-black text-primary text-xl flex items-center gap-2">
                   <Clock size={20} />
                   {totalDuration} mins
                </div>
             </div>
             <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
                <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Exercises</div>
                <div className="font-black text-blue-600 text-xl flex items-center gap-2">
                   <Zap size={20} />
                   {currentDayPlan.exercises.length} total
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="font-black text-lg uppercase tracking-tight">Workout list</h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gradual Progression</span>
             </div>
             
             <div className="space-y-3">
                {currentDayPlan.exercises.map((ex: any, idx: number) => (
                   <Card key={ex.id} className="!p-3 flex items-center gap-4 hover:border-primary transition-all group">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                         <img src={ex.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1">
                         <div className="text-[10px] font-black text-gray-400 mb-1">#{idx + 1}</div>
                         <h4 className="font-black text-sm uppercase tracking-tight">{ex.name}</h4>
                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{ex.duration}s workout • {ex.restTime}s rest</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-xl text-gray-300">
                         <Play size={16} fill="currentColor" />
                      </div>
                   </Card>
                ))}
             </div>
          </div>
       </div>

       <div className="p-6 pt-2">
          <button 
             onClick={onStart}
             className="w-full h-16 orange-gradient rounded-[2rem] text-white font-black text-xl shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
             <Play size={24} fill="white" />
             Start Training
          </button>
       </div>
    </div>
  );
};

const ExerciseTimer = ({ day, workoutProgress, onComplete, onClose }: any) => {
  const exercises = workoutProgress[day - 1].exercises;
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercises[0].duration);
  const [isActive, setIsActive] = useState(true); // Start automatically for guided flow
  const [isResting, setIsResting] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      if (!isResting) {
        setIsResting(true);
        setTimeLeft(exercises[index].restTime);
        // Play notification sound here if needed
      } else {
        if (index < exercises.length - 1) {
          setIsResting(false);
          setIndex(index + 1);
          setTimeLeft(exercises[index + 1].duration);
        } else {
          setIsActive(false);
          onComplete(day);
        }
      }
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, index, isResting, exercises, day, onComplete]);

  const current = exercises[index];
  const next = index < exercises.length - 1 ? exercises[index + 1] : null;
  
  const progress = isResting 
    ? (timeLeft / current.restTime) * 100 
    : (timeLeft / current.duration) * 100;

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Timer Header */}
      <div className="p-8 pb-4 flex items-center justify-between">
        <button onClick={onClose} className="p-2 rounded-xl bg-gray-100">
          <ChevronLeft />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-black text-dark">Day {day} Workout</span>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            {index + 1} of {exercises.length} Exercises
          </span>
        </div>
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-xs text-primary">
          {Math.round((index / exercises.length) * 100)}%
        </div>
      </div>

      <div className="flex-1 flex flex-col px-8 overflow-y-auto no-scrollbar">
        {/* Main Exercise View */}
        <div className="relative mb-6">
          <motion.div 
            key={index}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-gray-50"
          >
            <img src={current.image} className="w-full h-full object-cover" />
            {isResting && (
              <div className="absolute inset-0 bg-green-500/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                <Clock size={48} className="mb-4 animate-bounce" />
                <h3 className="text-3xl font-black uppercase">Rest Time</h3>
                <p className="text-white/80 font-medium">Coming up: {next?.name}</p>
              </div>
            )}
          </motion.div>
          
          {/* Progress Bar Top */}
          <div className="absolute -bottom-1 left-8 right-8 h-2 bg-gray-100 rounded-full overflow-hidden shadow-sm">
            <motion.div 
               className={cn("h-full transition-all duration-1000", isResting ? "bg-green-500" : "bg-primary")}
               animate={{ width: `${100 - progress}%` }} 
            />
          </div>
        </div>

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-dark leading-none">
            {isResting ? 'Get Ready' : current.name}
          </h2>
          <p className="text-gray-500 max-w-xs mx-auto text-sm font-medium line-clamp-1">{current.instruction}</p>
        </div>

        {/* Big Timer Display */}
        <div className="flex justify-center mb-8">
           <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="88" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
                <motion.circle 
                  cx="96" 
                  cy="96" 
                  r="88" 
                  fill="transparent" 
                  stroke={isResting ? '#22c55e' : '#FF6B00'} 
                  strokeWidth="12" 
                  strokeDasharray="552.9"
                  animate={{ strokeDashoffset: (552.9 * progress) / 100 }}
                  transition={{ duration: 1, ease: "linear" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-6xl font-black tabular-nums tracking-tighter">{timeLeft}</span>
                <span className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">Seconds</span>
              </div>
           </div>
        </div>

        {/* Upcoming Preview */}
        {next && !isResting && (
          <Card className="!p-3 bg-gray-50 border border-gray-100 mb-8 flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                <img src={next.image} className="w-full h-full object-cover grayscale" />
             </div>
             <div className="flex-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">NextUp</div>
                <div className="text-sm font-black text-dark">{next.name}</div>
             </div>
             <div className="text-xs font-bold text-gray-400">{next.duration}s</div>
          </Card>
        )}

        {/* Interaction List */}
        <div className="space-y-4 pb-8">
           <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Session Progress</h4>
           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 pt-2">
              {exercises.map((ex, i) => (
                <div 
                  key={ex.id}
                  className={cn(
                    "min-w-28 p-3 rounded-2xl border-2 transition-all relative flex flex-col gap-1",
                    i === index ? "bg-orange-50 border-primary shadow-md scale-105 z-10" : 
                    i < index ? "bg-green-50 border-green-200" : "bg-white border-gray-100 opacity-40"
                  )}
                >
                  <div className="text-[8px] font-black uppercase tracking-wider text-gray-400">
                    {i < index ? 'Completed' : i === index ? (isResting ? 'Preparing' : 'Active') : 'Upcoming'}
                  </div>
                  <div className={cn("text-xs font-black line-clamp-1", i === index ? "text-primary" : i < index ? "text-green-600" : "text-dark")}>
                    {ex.name}
                  </div>
                  {i < index && <CheckCircle2 size={12} className="absolute top-2 right-2 text-green-500" />}
                  {i === index && !isResting && <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />}
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Persistent Controls Overlay */}
      <div className="p-8 pt-4 bg-white border-t border-gray-100 flex items-center gap-4 z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => {
            if (index > 0) {
              setIndex(index - 1);
              setTimeLeft(exercises[index - 1].duration);
              setIsResting(false);
              setIsActive(false); // Pause on manual go back for safety
            }
          }}
          className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-dark transition-all active:scale-90 shrink-0"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={() => setIsActive(!isActive)}
          className={cn(
            "flex-1 h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95",
            isActive ? "bg-dark text-white shadow-dark/20" : "orange-gradient text-white shadow-primary/20"
          )}
        >
          {isActive ? <Lock size={20} className="rotate-180" /> : <Play size={20} fill="white" />}
          {isActive ? 'Pause Workout' : 'Start Workout'}
        </button>

        <button 
          disabled={!isResting && isActive}
          onClick={() => {
            if (index < exercises.length - 1) {
              setIndex(index + 1);
              setTimeLeft(exercises[index + 1].duration);
              setIsResting(false);
            } else {
              onComplete(day);
            }
          }}
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 active:scale-90",
            (!isResting && isActive) ? "bg-gray-50 text-gray-200 cursor-not-allowed" : "bg-gray-100 text-gray-400 hover:text-dark"
          )}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

const DietPlan = ({ navigate, userData, setUserData, dietProgress, setDietProgress, triggerRewardToast }: any) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const currentProgress = dietProgress[selectedDay - 1];
  const currentPlan = DIET_PLANS[selectedDay - 1];
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (target: number) => {
    const diff = target - now;
    if (diff <= 0) return "00:00:00";
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isNaturallyUnlocked = currentProgress.unlockTimestamp && currentProgress.unlockTimestamp <= now;
  
  if (isNaturallyUnlocked && currentProgress.isLocked) {
    const updated = [...dietProgress];
    updated[selectedDay - 1].isLocked = false;
    updated[selectedDay - 1].unlockTimestamp = undefined;
    setDietProgress(updated);
  }

  const handlePointUnlock = () => {
    if (userData.points >= 5) {
      const updated = [...dietProgress];
      updated[selectedDay - 1].isLocked = false;
      updated[selectedDay - 1].unlockTimestamp = undefined;
      setDietProgress(updated);
      setUserData({ ...userData, points: userData.points - 5 });
    }
  };

  const handleCompleteDay = () => {
    const alreadyCompleted = dietProgress[selectedDay - 1].isCompleted;
    const updated = [...dietProgress];
    updated[selectedDay - 1].isCompleted = true;
    
    // Set unlock timer for next day if it exists
    if (selectedDay < 10) {
      const nextDayIdx = selectedDay; // array index is day number since day 1 is index 0
      if (updated[nextDayIdx].isLocked && !updated[nextDayIdx].unlockTimestamp) {
        updated[nextDayIdx].unlockTimestamp = Date.now() + 12 * 60 * 60 * 1000;
      }
    }
    
    setDietProgress(updated);

    // Award points only if not previously completed
    if (!alreadyCompleted) {
      setUserData(prev => ({ ...prev, points: prev.points + 2 }));
      triggerRewardToast('Diet Reward');
    }
  };

  const isLocked = currentProgress.isLocked && !isNaturallyUnlocked;

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen pb-32">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase leading-none">Diet Plan</h1>
          <div className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 mt-2">
             <Zap size={14} fill="currentColor" />
             Fuel your transformation
          </div>
        </div>
        <PointsBadge points={userData.points} onClick={() => navigate('earnPoints')} />
      </div>

      {/* Day Selector */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
        {dietProgress.map((p: any) => (
          <button
            key={p.day}
            onClick={() => setSelectedDay(p.day)}
            className={cn(
              "min-w-[64px] h-14 rounded-[1.5rem] font-black text-sm transition-all duration-500 border-2 relative flex items-center justify-center",
              selectedDay === p.day 
                ? "bg-primary border-primary text-white shadow-xl shadow-orange-100 scale-105" 
                : "bg-white border-transparent text-gray-400 shadow-sm"
            )}
          >
            {p.isLocked && !p.isCompleted && (
              <Lock size={10} className="absolute top-2 right-2 text-gray-300" />
            )}
            {p.isCompleted && (
              <CheckCircle2 size={10} className="absolute top-2 right-2 text-green-500" />
            )}
            D{p.day}
          </button>
        ))}
      </div>

      {isLocked ? (
        <Card className="!p-8 text-center space-y-6 bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-200">
           <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Lock size={32} />
           </div>
           <div>
              <h3 className="text-xl font-bold uppercase tracking-tight">Day {selectedDay} is Locked</h3>
              <p className="text-gray-500 text-sm">Complete Day {selectedDay - 1} or use points to unlock instantly.</p>
           </div>
           
           {currentProgress.unlockTimestamp ? (
             <div className="space-y-4">
                <div className="bg-orange-50 px-4 py-3 rounded-2xl inline-block border border-orange-100">
                   <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Unlocks in</div>
                   <div className="font-mono text-2xl font-black text-primary">{formatCountdown(currentProgress.unlockTimestamp)}</div>
                </div>
                
                <div className="h-[1px] bg-gray-100 w-full" />
                
                <div className="space-y-3">
                   <Button 
                     onClick={handlePointUnlock}
                     disabled={userData.points < 5}
                     className={cn(
                       "!py-4 !rounded-2xl flex flex-col items-center gap-1",
                       userData.points < 5 && "opacity-50 grayscale"
                     )}
                   >
                     <div className="flex items-center gap-2">
                        <Zap size={18} fill="currentColor" />
                        <span>Unlock with 5 Points</span>
                     </div>
                     {userData.points < 5 && <span className="text-[10px] opacity-70">Not enough points</span>}
                   </Button>
                </div>
             </div>
           ) : (
             <p className="text-sm font-bold text-gray-400 bg-gray-50 py-3 rounded-2xl">Must complete Day {selectedDay - 1} first</p>
           )}
        </Card>
      ) : (
        <>
          {/* Daily Summary Header */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="!p-4 bg-white border-none shadow-soft space-y-1 overflow-hidden relative">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 relative z-10">
                <Flame size={12} className="text-orange-500" /> Target
              </div>
              <div className="text-xl font-black text-dark relative z-10">{currentPlan.totalCalories} <span className="text-[10px] font-bold text-gray-400">kcal</span></div>
              <div className="absolute -right-2 -bottom-2 text-orange-50/50 scale-[3]">
                 <Flame size={40} />
              </div>
            </Card>
            <Card className="!p-4 bg-white border-none shadow-soft space-y-1 relative overflow-hidden">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 relative z-10">
                <Zap size={12} className="text-blue-500" /> Daily Tip
              </div>
              <div className="text-[10px] font-bold text-gray-500 leading-tight relative z-10 line-clamp-2">{currentPlan.tip}</div>
              <div className="absolute -right-4 -bottom-4 text-blue-50/50 scale-[2.5]">
                 <Zap size={40} />
              </div>
            </Card>
          </div>

          {/* Expert Note Card */}
          <Card className="orange-gradient text-white !p-6 flex gap-5 items-center relative overflow-hidden shadow-xl shadow-orange-100 ring-4 ring-white">
            <div className="p-4 bg-white/20 rounded-[1.5rem] backdrop-blur-md relative z-10 shrink-0 border border-white/20">
              <AlertCircle size={28} />
            </div>
            <div className="relative z-10">
              <h4 className="font-black text-lg uppercase tracking-tight">Hydration</h4>
              <p className="text-white/80 text-[11px] font-semibold leading-relaxed tracking-tight">Drink <b>{currentPlan.waterIntake}</b> today for optimal fat loss results.</p>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl font-[1px]">.</div>
          </Card>

          {/* Meals List */}
          <div className="space-y-10">
            {currentPlan.meals.map((meal) => (
              <div key={meal.type} className="space-y-5">
                 <div className="flex items-center gap-4 px-2">
                    <div className="w-10 h-10 bg-white rounded-2xl shadow-soft flex items-center justify-center text-primary border border-gray-50">
                       {meal.type === 'Breakfast' && <Clock size={20} />}
                       {meal.type === 'Lunch' && <Utensils size={20} />}
                       {meal.type === 'Snacks' && <Apple size={20} />}
                       {meal.type === 'Dinner' && <Moon size={20} />}
                    </div>
                    <h3 className="font-black text-xl uppercase tracking-tighter text-gray-800">{meal.type}</h3>
                    <div className="h-[2px] bg-gray-100 flex-1 rounded-full text-transparent">.</div>
                 </div>

                 <div className="space-y-4">
                    {meal.items.map((item, idx) => (
                       <Card key={idx} className="!p-6 bg-white border-none shadow-soft hover:shadow-xl transition-all duration-500 group relative">
                          <div className="flex justify-between items-start mb-5">
                             <div>
                                <h4 className="font-black text-xl text-dark mb-1 group-hover:text-primary transition-colors duration-300 tracking-tight">{item.food}</h4>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 opacity-80">
                                   <Scale size={12} className="text-primary/60" /> Portion: <span className="text-dark font-black tracking-tight">{item.quantity}</span>
                                </div>
                             </div>
                             <div className="bg-gray-100/50 px-4 py-2 rounded-2xl border border-gray-100/80 shadow-inner shrink-0">
                                <span className="text-lg font-black text-dark tracking-tighter">{item.calories}</span>
                                <span className="text-[10px] font-black text-gray-400 ml-1.5 uppercase">Kcal</span>
                             </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                             <div className="text-center bg-orange-50/50 px-3 py-3 rounded-[1.2rem] border border-orange-100/50">
                                <div className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1.5">Protein</div>
                                <div className="text-sm font-black text-primary">{item.protein}g</div>
                             </div>
                             <div className="text-center bg-blue-50/50 px-3 py-3 rounded-[1.2rem] border border-blue-100/50">
                                <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1.5">Fiber</div>
                                <div className="text-sm font-black text-blue-600 font-mono">{item.fiber}g</div>
                             </div>
                             <div className="text-center bg-green-50/50 px-3 py-3 rounded-[1.2rem] border border-green-100/50">
                                <div className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-1.5">Carbs</div>
                                <div className="text-sm font-black text-green-600 font-mono">{item.carbs || 0}g</div>
                             </div>
                          </div>
                       </Card>
                    ))}
                 </div>
              </div>
            ))}
          </div>

          <div className="pt-6">
             <Button 
               onClick={handleCompleteDay}
               disabled={currentProgress.isCompleted}
               className={cn(
                 "!py-6 !rounded-[2rem] shadow-xl shadow-orange-100",
                 currentProgress.isCompleted && "bg-green-500 hover:bg-green-600"
               )}
             >
                {currentProgress.isCompleted ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={24} />
                    <span>Day {selectedDay} Completed!</span>
                  </div>
                ) : (
                  <span>Mark Day {selectedDay} Completed</span>
                )}
             </Button>
          </div>
        </>
      )}
      <div className="h-10 text-transparent">.</div>
    </div>
  );
};
const ProgressTracking = ({ navigate }: any) => {
  const stats = [
    { label: 'Start Weight', value: '82.5', unit: 'kg' },
    { label: 'Current Weight', value: '78.9', unit: 'kg' },
    { label: 'Weight Gained', value: '-3.6', unit: 'kg', trend: 'down' },
    { label: 'Belly Size', value: '100.8', unit: 'cm' },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Progress</h1>

      <div className="grid grid-cols-2 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="!p-4">
             <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">{s.label}</div>
             <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black">{s.value}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{s.unit}</span>
             </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">Belly Fat Reduction</h3>
        <Card className="h-64 !p-2 pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PROGRESS_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="belly" 
                stroke="#FF6B00" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#FF6B00', strokeWidth: 3, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#FF6B00' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">Before & After</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] rounded-3xl bg-gray-200 overflow-hidden relative group">
             <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
             <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Day 1</div>
          </div>
          <div className="aspect-[3/4] rounded-3xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
             <div className="flex flex-col items-center gap-2 text-gray-400">
                <CheckCircle2 size={32} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Day 10</span>
             </div>
          </div>
        </div>
      </div>
      <div className="h-10" />
    </div>
  );
};

const ProfileScreen = ({ userData, navigate, setUserData }: any) => {
  const [showOptions, setShowOptions] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setShowCropper(true);
        setShowOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setUserData({ ...userData, profileImage: croppedImage });
    setShowCropper(false);
    setImageToCrop(null);
  };

  const options = [
    {
      label: 'Take Photo',
      icon: <Camera size={20} />,
      onClick: () => cameraInputRef.current?.click()
    },
    {
      label: 'Upload from Gallery',
      icon: <ImageIcon size={20} />,
      onClick: () => fileInputRef.current?.click()
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Hidden Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={cameraInputRef} 
        onChange={onFileChange} 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
      />

      <AnimatePresence>
        {showCropper && imageToCrop && (
          <ImageCropModal 
            image={imageToCrop} 
            onCropComplete={handleCropComplete} 
            onClose={() => setShowCropper(false)} 
          />
        )}
      </AnimatePresence>

      <BottomActionSheet 
        isOpen={showOptions} 
        onClose={() => setShowOptions(false)} 
        options={options} 
      />

      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4">
         <div className="relative">
            <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden ring-4 ring-primary/10 ring-offset-4 ring-offset-white shadow-xl">
               <img src={userData.profileImage} className="w-full h-full object-cover transition-opacity duration-300" />
            </div>
            <button 
              onClick={() => setShowOptions(true)}
              className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-2xl border-4 border-white shadow-lg active:scale-90 transition-transform"
            >
              <Camera size={18} />
            </button>
         </div>
         <div className="text-center">
            <h2 className="text-2xl font-black uppercase tracking-tight">{userData.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
               <Zap size={14} className="text-primary" fill="currentColor" />
               <span className="text-primary font-black text-xs uppercase tracking-widest">{userData.points} Total Points Earned</span>
            </div>
            <button 
               onClick={() => navigate('referEarn')}
               className="mt-4 flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-all active:scale-95"
            >
               <UserPlus size={14} />
               Invite Friends & Earn
            </button>
         </div>
      </div>

      {/* Health Info Summary */}
      <div className="flex gap-4">
         <div className="flex-1 bg-white p-4 rounded-3xl text-center shadow-soft border border-gray-50">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 opacity-60 font-mono italic">HEIGHT</div>
            <div className="font-black text-dark">{userData.height} {userData.heightUnit}</div>
         </div>
         <div className="flex-1 bg-white p-4 rounded-3xl text-center shadow-soft border border-gray-50">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 opacity-60 font-mono italic">WEIGHT</div>
            <div className="font-black text-dark">{userData.weight} {userData.weightUnit}</div>
         </div>
         <div className="flex-1 bg-white p-4 rounded-3xl text-center shadow-soft border border-gray-50">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 opacity-60 font-mono italic">AGE</div>
            <div className="font-black text-dark">{userData.age} yrs</div>
         </div>
      </div>

      {/* Settings List */}
      <div className="space-y-4">
         <Card 
            onClick={() => navigate('earnPoints')}
            className="bg-primary/5 border-2 border-primary/10 !p-4 cursor-pointer hover:bg-primary/10 transition-colors group"
         >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
                  <TrendingUp />
               </div>
               <div className="flex-1">
                  <h4 className="font-bold text-sm">Earned Rewards</h4>
                  <p className="text-[10px] text-gray-500 font-medium tracking-tight">Tap to earn more points</p>
               </div>
               <div className="text-right">
                  <div className="text-lg font-black text-primary leading-none">{userData.points}</div>
                  <div className="text-[8px] font-bold text-primary/60 uppercase">Points</div>
               </div>
               <ChevronRight size={16} className="text-primary/40 group-hover:translate-x-1 transition-transform" />
            </div>
         </Card>

         <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 ml-2">Settings</h3>
         <div className="bg-white rounded-[2rem] shadow-soft overflow-hidden border border-gray-50">
            <ProfileItem icon={<User size={18} />} label="Personal Information" onClick={() => navigate('personalInfo')} />
            <ProfileItem icon={<Heart size={18} />} label="Health Data" onClick={() => navigate('healthData')} />
            <ProfileItem icon={<Clock size={18} />} label="Workout History" onClick={() => navigate('workoutHistory')} />
            <ProfileItem icon={<Settings size={18} />} label="Notification Settings" onClick={() => navigate('notifications')} />
            <ProfileItem icon={<AlertCircle size={18} />} label="Help & Support" className="border-none" onClick={() => navigate('helpSupport')} />
         </div>
      </div>
      <div className="h-10 text-transparent">.</div>
    </div>
  );
};

const PersonalInformation = ({ userData, setUserData, navigate }: any) => {
  const [formData, setFormData] = useState(userData);
  const [errors, setErrors] = useState<any>({});

  const handleSave = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.age) newErrors.age = 'Required';
    if (!formData.height) newErrors.height = 'Required';
    if (!formData.weight) newErrors.weight = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setUserData(formData);
    navigate('profile');
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50 pb-32">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('profile')} className="p-2 rounded-xl bg-white shadow-sm">
          <ChevronLeft />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tight">Personal Info</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Name</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={cn(
              "w-full bg-white p-4 rounded-2xl border-2 outline-none transition-all",
              errors.name ? "border-red-500" : "border-transparent focus:border-primary"
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Age</label>
              <input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className={cn(
                  "w-full bg-white p-4 rounded-2xl border-2 outline-none transition-all",
                  errors.age ? "border-red-500" : "border-transparent focus:border-primary"
                )}
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Gender</label>
              <select 
                value={formData.gender}
                onChange={(e: any) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-white p-4 rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all appearance-none"
              >
                 <option value="male">Male</option>
                 <option value="female">Female</option>
              </select>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Height</label>
                 <div className="flex bg-gray-100 rounded-lg p-0.5">
                    {['cm', 'ft'].map(u => (
                      <button 
                        key={u}
                        onClick={() => setFormData({ ...formData, heightUnit: u })}
                        className={cn("px-2 py-0.5 rounded-md text-[8px] font-black uppercase transition-all", formData.heightUnit === u ? "bg-white text-primary shadow-sm" : "text-gray-400")}
                      >
                        {u}
                      </button>
                    ))}
                 </div>
              </div>
              <input 
                type="number" 
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className={cn(
                  "w-full bg-white p-4 rounded-2xl border-2 outline-none transition-all",
                  errors.height ? "border-red-500" : "border-transparent focus:border-primary"
                )}
              />
           </div>
           <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Weight</label>
                 <div className="flex bg-gray-100 rounded-lg p-0.5">
                    {['kg', 'lb'].map(u => (
                      <button 
                        key={u}
                        onClick={() => setFormData({ ...formData, weightUnit: u })}
                        className={cn("px-2 py-0.5 rounded-md text-[8px] font-black uppercase transition-all", formData.weightUnit === u ? "bg-white text-primary shadow-sm" : "text-gray-400")}
                      >
                        {u}
                      </button>
                    ))}
                 </div>
              </div>
              <input 
                type="number" 
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className={cn(
                  "w-full bg-white p-4 rounded-2xl border-2 outline-none transition-all",
                  errors.weight ? "border-red-500" : "border-transparent focus:border-primary"
                )}
              />
           </div>
        </div>
      </div>

      <Button onClick={handleSave} className="!py-6 !rounded-[2rem] shadow-xl shadow-orange-100 fixed bottom-28 left-6 right-6 w-auto z-50">
        Save Changes
      </Button>
    </div>
  );
};

const HealthData = ({ userData, setUserData, navigate }: any) => {
  const handleToggle = (condition: keyof UserData['medicalConditions']) => {
    setUserData({
      ...userData,
      medicalConditions: {
        ...userData.medicalConditions,
        [condition]: !userData.medicalConditions[condition]
      }
    });
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50 pb-32">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('profile')} className="p-2 rounded-xl bg-white shadow-sm">
          <ChevronLeft />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tight">Health Data</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Medical Conditions</h3>
          <div className="space-y-4">
            <HealthToggle 
              label="Diabetes" 
              active={userData.medicalConditions.diabetes} 
              onToggle={() => handleToggle('diabetes')} 
            />
            <HealthToggle 
              label="Heart Issues" 
              active={userData.medicalConditions.heartIssues} 
              onToggle={() => handleToggle('heartIssues')} 
            />
            <HealthToggle 
              label="Injuries" 
              active={userData.medicalConditions.injuries} 
              onToggle={() => handleToggle('injuries')} 
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Fitness Level</h3>
          <div className="grid grid-cols-1 gap-3">
             {['Beginner', 'Intermediate', 'Advanced'].map((level: any) => (
               <button
                 key={level}
                 onClick={() => setUserData({ ...userData, fitnessLevel: level })}
                 className={cn(
                   "p-4 rounded-2xl border-2 transition-all text-left flex justify-between items-center px-6",
                   userData.fitnessLevel === level 
                    ? "bg-white border-primary shadow-soft scale-[1.02]" 
                    : "bg-white border-transparent text-gray-400"
                 )}
               >
                  <span className={cn("font-bold", userData.fitnessLevel === level ? "text-dark" : "text-gray-400")}>{level}</span>
                  {userData.fitnessLevel === level && <CheckCircle2 className="text-primary" size={18} />}
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const HealthToggle = ({ label, active, onToggle }: any) => (
  <button 
    onClick={onToggle}
    className={cn(
      "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all px-6",
      active ? "bg-white border-primary/20 shadow-soft" : "bg-white border-transparent"
    )}
  >
    <span className={cn("font-bold", active ? "text-dark" : "text-gray-400")}>{label}</span>
    <div className={cn(
      "w-12 h-6 rounded-full relative transition-all duration-300",
      active ? "bg-primary" : "bg-gray-200"
    )}>
      <div className={cn(
        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
        active ? "right-1" : "left-1"
      )} />
    </div>
  </button>
);

const WorkoutHistory = ({ workoutProgress, navigate }: any) => {
  const completedDays = workoutProgress.filter((d: DayPlan) => d.isCompleted);
  const completionRate = Math.round((completedDays.length / 10) * 100);

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50 pb-32">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('profile')} className="p-2 rounded-xl bg-white shadow-sm">
          <ChevronLeft />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tight">Workout History</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <Card className="!p-6 text-center space-y-2">
            <div className="text-3xl font-black text-primary">{completionRate}%</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completion</div>
         </Card>
         <Card className="!p-6 text-center space-y-2">
            <div className="text-3xl font-black text-blue-600">{completedDays.length}</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Days Done</div>
         </Card>
      </div>

      <div className="space-y-4">
         <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Recent Success</h3>
         {completedDays.length === 0 ? (
           <Card className="!p-8 text-center text-gray-400 italic font-medium">
             No workouts completed yet.<br/>Start your journey today!
           </Card>
         ) : (
           <div className="space-y-3">
             {completedDays.map((day: DayPlan) => (
               <Card key={day.day} className="flex items-center gap-4 border-none shadow-soft">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center font-bold">
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">Belly Burn Day {day.day}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      Completed • April 22, 2026
                    </p>
                  </div>
                  <div className="text-right">
                     <div className="text-xs font-black text-dark tracking-tighter">120 Kcal</div>
                     <div className="text-[8px] font-bold text-gray-400 uppercase">Burned</div>
                  </div>
               </Card>
             ))}
           </div>
         )}
      </div>
    </div>
  );
};

const NotificationSettings = ({ userData, setUserData, navigate }: any) => {
  const handleToggle = (key: keyof UserData['notifications']) => {
    setUserData({
      ...userData,
      notifications: {
        ...userData.notifications,
        [key]: !userData.notifications[key]
      }
    });
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50 pb-32">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('profile')} className="p-2 rounded-xl bg-white shadow-sm">
          <ChevronLeft />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tight">Notifications</h1>
      </div>

      <div className="bg-white rounded-[2rem] shadow-soft overflow-hidden border border-gray-50">
         <NotificationToggle 
           icon={<Dumbbell size={18} />} 
           label="Workout Reminders" 
           active={userData.notifications.workoutReminders}
           onToggle={() => handleToggle('workoutReminders')}
         />
         <NotificationToggle 
           icon={<Utensils size={18} />} 
           label="Diet Plan Reminders" 
           active={userData.notifications.dietReminders}
           onToggle={() => handleToggle('dietReminders')}
         />
         <NotificationToggle 
           icon={<Zap size={18} />} 
           label="Daily Motivation" 
           active={userData.notifications.motivation}
           className="border-none"
           onToggle={() => handleToggle('motivation')}
         />
      </div>
    </div>
  );
};

const NotificationToggle = ({ icon, label, active, onToggle, className }: any) => (
  <div className={cn("p-6 border-b border-gray-50 flex items-center justify-between", className)}>
    <div className="flex items-center gap-4 text-gray-600">
      <div className="text-primary">{icon}</div>
      <span className="font-semibold">{label}</span>
    </div>
    <button 
      onClick={onToggle}
      className={cn(
        "w-12 h-6 rounded-full relative transition-all duration-300",
        active ? "bg-primary" : "bg-gray-200"
      )}
    >
      <div className={cn(
        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
        active ? "right-1" : "left-1"
      )} />
    </button>
  </div>
);

const HelpSupport = ({ navigate }: any) => {
  const faqs = [
    { q: "How to earn points?", a: "You can earn points by completing daily workouts, marking your diet plan as complete, watching ads, or referring friends." },
    { q: "Can I skip a day?", a: "Yes, you can skip to the next day by using 5 points, or wait for the automatic 12-hour unlock timer." },
    { q: "Is the diet plan safe?", a: "Our diet plans are designed by nutritionists for general fat loss. If you have medical conditions, please consult a doctor." }
  ];

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50 pb-32">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('profile')} className="p-2 rounded-xl bg-white shadow-sm">
          <ChevronLeft />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tight">Help & Support</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">FAQ</h3>
          <div className="space-y-3">
             {faqs.map((faq, idx) => (
               <Card key={idx} className="space-y-2 border-none shadow-soft">
                  <h4 className="font-bold text-dark">{faq.q}</h4>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{faq.a}</p>
               </Card>
             ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Contact Us</h3>
          <Card className="flex flex-col items-center text-center p-8 space-y-4 border-none shadow-soft">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <AlertCircle size={32} />
             </div>
             <div>
                <h4 className="font-black text-xl uppercase tracking-tighter">Need more help?</h4>
                <p className="text-xs text-gray-400">Our support team is available 24/7</p>
             </div>
             <a href="mailto:support@fitbelly10.com" className="w-full bg-dark text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                Send Email
             </a>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ReferEarn = ({ userData, navigate }: any) => {
  const referralLink = `https://fit-belly-10.app/invite/${userData.gender + userData.age + Math.floor(Math.random() * 1000)}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on Fit Belly 10!',
        text: 'Lose belly fat in 10 days with this awesome app. Use my link to join:',
        url: referralLink
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(referralLink);
      alert('Referral link copied to clipboard!');
    }
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50 pb-32">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('profile')} className="p-2 rounded-xl bg-white shadow-sm">
          <ChevronLeft />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tight">Refer & Earn</h1>
      </div>

      <Card className="blue-gradient text-white !p-8 text-center space-y-6 relative overflow-hidden shadow-2xl shadow-blue-200">
         <div className="p-4 bg-white/20 rounded-[2rem] inline-block backdrop-blur-md relative z-10">
            <UserPlus size={40} fill="white" />
         </div>
         <div className="space-y-2 relative z-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Invite Friends</h2>
            <p className="text-white/70 text-sm font-medium">Earn <span className="text-white font-black">2 Points</span> for every successful referral.</p>
         </div>
         <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </Card>

      <div className="space-y-4">
         <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Your Referral Link</label>
            <div className="flex gap-2">
               <div className="flex-1 bg-white p-4 rounded-2xl border-2 border-gray-100 font-mono text-[10px] truncate text-gray-400 overflow-hidden">
                  {referralLink}
               </div>
               <button 
                 onClick={handleShare}
                 className="bg-dark text-white px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
               >
                 Share
               </button>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <Card className="!p-6 text-center space-y-1">
               <div className="text-3xl font-black text-dark">{userData.referralsCount}</div>
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Successful</div>
            </Card>
            <Card className="!p-6 text-center space-y-1">
               <div className="text-3xl font-black text-primary">+{userData.referralPointsEarned}</div>
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Points Earned</div>
            </Card>
         </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-[2.5rem] border-2 border-orange-100 shadow-sm">
         <div className="flex items-start gap-4">
            <div className="p-2 bg-primary rounded-xl text-white">
               <Zap size={20} fill="white" />
            </div>
            <div>
               <h4 className="font-bold text-dark">Pro Tip!</h4>
               <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Referrals are credited once your friend completes their onboarding process.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, className, onClick }: any) => (
  <div 
    onClick={onClick}
    className={cn("p-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer", className)}
  >
    <div className="flex items-center gap-4 text-gray-600">
      {icon}
      <span className="font-semibold">{label}</span>
    </div>
    <ChevronRight size={18} className="text-gray-300" />
  </div>
);

const EarnPoints = ({ userData, setUserData, navigate, triggerRewardToast }: any) => {
  const referralLink = `https://fit-belly-10.app/invite/${userData.gender + userData.age + Math.floor(Math.random() * 1000)}`;

  const handleAction = (type: 'ad' | 'refer') => {
    if (type === 'ad') {
      // Simulate ad watching
      setUserData((prev: any) => ({ ...prev, points: prev.points + 1 }));
      triggerRewardToast('Ad Reward');
    } else {
      // Handle referral sharing
      if (navigator.share) {
        navigator.share({
          title: 'Join me on Fit Belly 10!',
          text: 'Lose belly fat in 10 days with this awesome app. Use my link to join:',
          url: referralLink
        }).catch(err => console.log('Error sharing:', err));
      } else {
        navigator.clipboard.writeText(referralLink);
        alert('Referral link copied to clipboard!');
      }

      // FOR DEMO: Simulate a successful referral after a short delay
      setTimeout(() => {
        setUserData((prev: any) => ({
          ...prev,
          points: prev.points + 2,
          referralsCount: prev.referralsCount + 1,
          referralPointsEarned: prev.referralPointsEarned + 2
        }));
        triggerRewardToast('Referral Reward');
      }, 5000);
    }
  };

  return (
    <div className="p-6 space-y-8 min-h-full bg-gray-50 relative">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('dashboard')} className="p-2 rounded-xl bg-white shadow-sm">
          <ChevronLeft />
        </button>
        <h1 className="text-2xl font-bold">Earn Points</h1>
      </div>

      {/* Points Balance Card */}
      <Card className="orange-gradient text-white !p-6 flex flex-col items-center">
        <div className="p-3 bg-white/20 rounded-full mb-4">
          <Zap size={32} fill="white" />
        </div>
        <div className="text-4xl font-black">{userData.points}</div>
        <div className="text-white/80 font-bold uppercase tracking-widest text-xs mt-1">Current Points</div>
        
        <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-white/20">
           <div className="text-center">
              <div className="text-lg font-bold">{userData.referralsCount}</div>
              <div className="text-[10px] text-white/60 font-black uppercase tracking-wider">Referrals</div>
           </div>
           <div className="text-center">
              <div className="text-lg font-bold">+{userData.referralPointsEarned}</div>
              <div className="text-[10px] text-white/60 font-black uppercase tracking-wider">Earned</div>
           </div>
        </div>
      </Card>

      <div className="space-y-4">
         <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400">Available Missions</h3>
         
         <Card className="flex items-center gap-4 border-2 border-transparent hover:border-primary/20 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
               <Play size={24} fill="currentColor" />
            </div>
            <div className="flex-1">
               <h4 className="font-bold">Watch Ad</h4>
               <p className="text-[10px] text-gray-500 font-medium">Earn +1 Point instantly</p>
            </div>
            <button 
               onClick={() => handleAction('ad')}
               className="bg-primary text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-md shadow-orange-100"
            >
               Watch
            </button>
         </Card>

         <Card className="flex items-center gap-4 border-2 border-transparent hover:border-blue-200 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
               <UserPlus size={24} />
            </div>
            <div className="flex-1">
               <h4 className="font-bold">Refer a Friend</h4>
               <p className="text-[10px] text-gray-500 font-medium">Earn +2 Points per referral</p>
            </div>
            <button 
               onClick={() => handleAction('refer')}
               className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-md shadow-blue-100"
            >
               Invite
            </button>
         </Card>
      </div>

      <div className="p-4 bg-blue-50 rounded-3xl border border-blue-100 text-center">
         <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest leading-loose">
           Referral Terms:<br/>
           Points are awarded after friend completes onboarding.
         </p>
      </div>
    </div>
  );
};

const BottomActionSheet = ({ isOpen, onClose, options }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] z-[101] p-8 pb-12 shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
            <div className="space-y-4">
              {options.map((opt: any, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    opt.onClick();
                  }}
                  className={cn(
                    "w-full p-5 rounded-2xl flex items-center gap-4 transition-all active:scale-95",
                    opt.danger ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <div className={cn("p-2 rounded-xl bg-white shadow-sm", opt.danger ? "text-red-500" : "text-primary")}>
                    {opt.icon}
                  </div>
                  <span className="font-bold flex-1 text-left">{opt.label}</span>
                </button>
              ))}
              <button
                onClick={onClose}
                className="w-full p-5 rounded-2xl bg-gray-900 text-white font-bold transition-all active:scale-95 mt-4"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ImageCropModal = ({ image, onCropComplete, onClose }: any) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((crop: any) => setCrop(crop), []);
  const onZoomChange = useCallback((zoom: any) => setZoom(zoom), []);

  const onCropEnd = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[200] flex flex-col"
    >
      <div className="flex items-center justify-between p-6 text-white bg-black/50 backdrop-blur-md z-10">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
          <X size={24} />
        </button>
        <h2 className="font-bold uppercase tracking-widest text-sm">Crop Image</h2>
        <button onClick={handleConfirm} className="bg-primary px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">
          Confirm
        </button>
      </div>

      <div className="flex-1 relative bg-dark">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          cropShape="round"
          showGrid={false}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropEnd}
          style={{
            containerStyle: { background: '#111' },
            cropAreaStyle: { border: '2px solid white' }
          }}
        />
      </div>

      <div className="p-8 pb-12 bg-black text-white space-y-6">
        <div className="flex items-center gap-4">
           <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Zoom</span>
           <input
             type="range"
             value={zoom}
             min={1}
             max={3}
             step={0.1}
             onChange={(e) => setZoom(Number(e.target.value))}
             className="flex-1 accent-primary h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
           />
        </div>
      </div>
    </motion.div>
  );
};
