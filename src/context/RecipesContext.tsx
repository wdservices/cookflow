import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addDoc, collection, doc, getDocs, updateDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { Recipe, sampleRecipes } from "../data/sampleRecipes";
import { db, isFirebaseConfigured } from "../lib/firebase";
import { useAuth } from "./AuthContext";

type RecipesContextValue = {
  recipes: Recipe[];
  toggleFavorite: (id: string) => void;
  addRecipe: (recipe: Recipe) => void;
  loading: boolean;
};

const RecipesContext = createContext<RecipesContextValue | undefined>(undefined);

export const RecipesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setRecipes(sampleRecipes);
      setLoading(false);
      return;
    }

    // If not logged in, we can either show nothing or sample recipes
    // For this app, let's show public recipes + user recipes, or just user recipes
    // Given the request, let's focus on user-specific recipes for persistence
    if (!user) {
      setRecipes(sampleRecipes);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "recipes"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setRecipes([]);
      } else {
        const fetchedRecipes = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Recipe, "id">),
        }));

        // Sort manually to avoid composite index requirement
        const sortedRecipes = [...fetchedRecipes].sort((a, b) => {
          const timeA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
          const timeB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
          return timeB - timeA;
        });

        setRecipes(sortedRecipes);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching recipes:", error);
      setRecipes(sampleRecipes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleFavorite = (id: string) => {
    const target = recipes.find((r) => r.id === id);
    if (target && db) {
      void updateDoc(doc(db, "recipes", id), { isFavorite: !target.isFavorite });
    }
  };

  const addRecipe = (recipe: Recipe) => {
    console.log("📝 [RecipesContext] Adding recipe:", recipe);
    
    if (!db || !isFirebaseConfigured || !user) {
      console.log("📝 [RecipesContext] Adding to local state only");
      setRecipes((prev) => [recipe, ...prev]);
      return;
    }
    
    void (async () => {
      try {
        console.log("📝 [RecipesContext] Adding to Firestore");
        const { id: _id, ...data } = recipe;
        await addDoc(collection(db, "recipes"), {
          ...data,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });
        console.log("✅ [RecipesContext] Recipe added to Firestore");
      } catch (error) {
        console.error("❌ [RecipesContext] Failed to add to Firestore:", error);
        // Fallback to local state
        setRecipes((prev) => [recipe, ...prev]);
      }
    })();
  };

  const value = useMemo(() => ({ recipes, toggleFavorite, addRecipe, loading }), [recipes, loading]);

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
};

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error("useRecipes must be used within RecipesProvider");
  }
  return context;
};
