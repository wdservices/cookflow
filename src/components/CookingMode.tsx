import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Timer, Pause, Play } from "lucide-react";
import { Recipe } from "@/data/sampleRecipes";
import { motion, AnimatePresence } from "framer-motion";

interface CookingModeProps {
  recipe: Recipe;
  onExit: () => void;
}

const CookingMode = ({ recipe, onExit }: CookingModeProps) => {
  const [step, setStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  const currentStep = recipe.steps[step];

  const startTimer = useCallback(() => {
    if (currentStep.duration) {
      setTimerSeconds(currentStep.duration * 60);
      setTimerRunning(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!timerRunning || timerSeconds === null || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => (s !== null && s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  useEffect(() => {
    if (timerSeconds === 0) setTimerRunning(false);
  }, [timerSeconds]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const next = () => {
    if (step < recipe.steps.length - 1) {
      setStep(step + 1);
      setTimerSeconds(null);
      setTimerRunning(false);
    }
  };

  const prev = () => {
    if (step > 0) {
      setStep(step - 1);
      setTimerSeconds(null);
      setTimerRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <button onClick={onExit} className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center">
          <X size={20} className="text-background" />
        </button>
        <span className="text-background/60 text-sm font-medium">
          Step {step + 1} of {recipe.steps.length}
        </span>
        <div className="w-10" />
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-5 mb-6">
        {recipe.steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-primary" : "bg-card/20"
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center"
          >
            <p className="text-background text-xl leading-relaxed font-light">
              {currentStep.instruction}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Timer */}
        {currentStep.duration && (
          <div className="mt-8">
            {timerSeconds !== null ? (
              <div className="flex flex-col items-center gap-3">
                <span
                  className={`text-5xl font-mono font-bold ${
                    timerSeconds === 0 ? "text-primary animate-pulse" : "text-background"
                  }`}
                >
                  {formatTime(timerSeconds)}
                </span>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="w-12 h-12 rounded-full bg-primary flex items-center justify-center"
                >
                  {timerRunning ? (
                    <Pause size={20} className="text-primary-foreground" />
                  ) : (
                    <Play size={20} className="text-primary-foreground ml-0.5" />
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={startTimer}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
              >
                <Timer size={16} />
                Start {currentStep.duration}m timer
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-8 pb-10">
        <button
          onClick={prev}
          disabled={step === 0}
          className="w-14 h-14 rounded-full bg-card/10 flex items-center justify-center disabled:opacity-20"
        >
          <ChevronLeft size={24} className="text-background" />
        </button>
        {step === recipe.steps.length - 1 ? (
          <button
            onClick={onExit}
            className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold"
          >
            Done!
          </button>
        ) : (
          <button
            onClick={next}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center"
          >
            <ChevronRight size={24} className="text-primary-foreground" />
          </button>
        )}
        <div className="w-14" />
      </div>
    </div>
  );
};

export default CookingMode;
