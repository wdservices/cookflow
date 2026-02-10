import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { Recipe, sampleRecipes } from "../data/sampleRecipes";

type RecipesContextValue = {
  recipes: Recipe[];
  toggleFavorite: (id: string) => void;
};

const RecipesContext = createContext<RecipesContextValue | undefined>(undefined);

export const RecipesProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState(sampleRecipes);

  const toggleFavorite = (id: string) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r)));
  };

  const value = useMemo(() => ({ recipes, toggleFavorite }), [recipes]);

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
};

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error("useRecipes must be used within RecipesProvider");
  }
  return context;
};
