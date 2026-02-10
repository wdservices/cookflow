import { useState } from "react";
import { Play, ChefHat } from "lucide-react";
import { sampleRecipes, Recipe } from "@/data/sampleRecipes";
import CookingMode from "@/components/CookingMode";
import { motion } from "framer-motion";

const CookPage = () => {
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  if (activeRecipe) {
    return <CookingMode recipe={activeRecipe} onExit={() => setActiveRecipe(null)} />;
  }

  return (
    <div className="px-5 pt-6 pb-24">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-foreground mb-1">Cook</h1>
        <p className="text-muted-foreground text-sm mb-6">Pick a recipe to start cooking</p>
      </motion.div>

      <div className="space-y-3">
        {sampleRecipes.map((recipe, i) => (
          <motion.button
            key={recipe.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => setActiveRecipe(recipe)}
            className="w-full flex items-center gap-4 p-3 rounded-xl bg-card border border-border text-left active:scale-[0.98] transition-transform"
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{recipe.title}</h3>
              <p className="text-xs text-muted-foreground">
                {recipe.steps.length} steps · {recipe.cookTime + recipe.prepTime}m
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Play size={18} className="text-primary ml-0.5" />
            </div>
          </motion.button>
        ))}
      </div>

      {sampleRecipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ChefHat size={48} className="text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No recipes yet. Capture some first!</p>
        </div>
      )}
    </div>
  );
};

export default CookPage;
