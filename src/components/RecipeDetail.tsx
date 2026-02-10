import { ArrowLeft, Clock, Users, Heart, Timer } from "lucide-react";
import { Recipe } from "@/data/sampleRecipes";
import { motion, AnimatePresence } from "framer-motion";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

const RecipeDetail = ({ recipe, onBack }: RecipeDetailProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="fixed inset-0 z-50 bg-background overflow-y-auto pb-24"
      >
        <div className="relative h-64">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <button
            onClick={onBack}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
        </div>

        <div className="px-5 -mt-16 relative">
          <h1 className="font-serif text-3xl text-foreground mb-2">{recipe.title}</h1>
          <p className="text-muted-foreground mb-4">{recipe.description}</p>

          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted">
              <Clock size={16} className="text-primary" />
              <span className="text-sm font-medium">{recipe.prepTime + recipe.cookTime}m</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted">
              <Users size={16} className="text-secondary" />
              <span className="text-sm font-medium">{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted">
              <span className="text-sm font-medium">{recipe.difficulty}</span>
            </div>
          </div>

          <h2 className="font-serif text-xl mb-3">Ingredients</h2>
          <ul className="space-y-2 mb-6">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm flex-1">{ing.name}</span>
                <span className="text-sm text-muted-foreground">{ing.amount} {ing.unit}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-serif text-xl mb-3">Steps</h2>
          <ol className="space-y-4 mb-8">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{step.instruction}</p>
                  {step.duration && (
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-medium">
                      <Timer size={12} />
                      {step.duration}m — {step.timerLabel}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecipeDetail;
