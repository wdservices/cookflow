import { Heart, Clock, Users } from "lucide-react";
import { Recipe } from "@/data/sampleRecipes";
import { motion } from "framer-motion";

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite?: (id: string) => void;
  onClick?: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, onToggleFavorite, onClick }: RecipeCardProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden bg-card shadow-sm border border-border cursor-pointer"
      onClick={() => onClick?.(recipe)}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(recipe.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
        >
          <Heart
            size={18}
            className={recipe.isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}
          />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
            {recipe.difficulty}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg text-foreground mb-1">{recipe.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">{recipe.description}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {recipe.cookTime + recipe.prepTime}m
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {recipe.servings}
          </span>
          <span className="ml-auto text-xs font-medium text-secondary">{recipe.cuisine}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
