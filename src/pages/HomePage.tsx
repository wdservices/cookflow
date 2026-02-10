import { useState } from "react";
import { Search } from "lucide-react";
import { sampleRecipes, Recipe } from "@/data/sampleRecipes";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetail from "@/components/RecipeDetail";
import { motion } from "framer-motion";

const HomePage = () => {
  const [recipes, setRecipes] = useState(sampleRecipes);
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [search, setSearch] = useState("");

  const toggleFav = (id: string) =>
    setRecipes((r) => r.map((x) => (x.id === id ? { ...x, isFavorite: !x.isFavorite } : x)));

  const filtered = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  const favorites = filtered.filter((r) => r.isFavorite);

  if (selected) {
    return <RecipeDetail recipe={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="px-5 pt-6 pb-24">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-foreground mb-1">CookFlow</h1>
        <p className="text-muted-foreground text-sm mb-5">What are we cooking today?</p>
      </motion.div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search recipes or cuisines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {favorites.length > 0 && (
        <section className="mb-6">
          <h2 className="font-serif text-lg mb-3">Favorites</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {favorites.map((r) => (
              <div key={r.id} className="min-w-[260px]">
                <RecipeCard recipe={r} onToggleFavorite={toggleFav} onClick={setSelected} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-serif text-lg mb-3">All Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <RecipeCard recipe={r} onToggleFavorite={toggleFav} onClick={setSelected} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
