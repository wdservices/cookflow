import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { sampleRecipes } from "@/data/sampleRecipes";
import { motion } from "framer-motion";

interface GroceryItem {
  name: string;
  amount: string;
  unit: string;
  category: string;
  checked: boolean;
}

const buildGroceryList = (): GroceryItem[] => {
  const map = new Map<string, GroceryItem>();
  sampleRecipes.filter(r => r.isFavorite).forEach((r) => {
    r.ingredients.forEach((ing) => {
      const key = ing.name.toLowerCase();
      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.amount += ` + ${ing.amount}`;
      } else {
        map.set(key, { ...ing, checked: false });
      }
    });
  });
  return Array.from(map.values());
};

const categoryLabels: Record<string, string> = {
  produce: "🥬 Produce",
  protein: "🥩 Protein",
  dairy: "🧀 Dairy",
  spices: "🌶️ Spices",
  pantry: "🏪 Pantry",
  other: "📦 Other",
};

const GroceryPage = () => {
  const [items, setItems] = useState<GroceryItem[]>(buildGroceryList);

  const toggle = (name: string) =>
    setItems((prev) => prev.map((i) => (i.name === name ? { ...i, checked: !i.checked } : i)));

  const categories = [...new Set(items.map((i) => i.category))];
  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="px-5 pt-6 pb-24">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-foreground mb-1">Grocery List</h1>
        <p className="text-muted-foreground text-sm mb-2">From your favorited recipes</p>
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${items.length ? (checkedCount / items.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {checkedCount}/{items.length}
          </span>
        </div>
      </motion.div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCart size={48} className="text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">Favorite some recipes to build your grocery list</p>
        </div>
      ) : (
        categories.map((cat) => (
          <section key={cat} className="mb-5">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              {categoryLabels[cat] || cat}
            </h3>
            <div className="space-y-1">
              {items
                .filter((i) => i.category === cat)
                .map((item) => (
                  <motion.button
                    key={item.name}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggle(item.name)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      item.checked ? "bg-secondary/10" : "bg-card"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        item.checked
                          ? "bg-secondary border-secondary"
                          : "border-border"
                      }`}
                    >
                      {item.checked && <Check size={14} className="text-secondary-foreground" />}
                    </div>
                    <span
                      className={`text-sm flex-1 text-left ${
                        item.checked ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.amount} {item.unit}
                    </span>
                  </motion.button>
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default GroceryPage;
