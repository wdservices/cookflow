import { BookOpen, Heart, Clock, Settings } from "lucide-react";
import { sampleRecipes } from "@/data/sampleRecipes";
import { motion } from "framer-motion";

const stats = [
  { icon: BookOpen, label: "Recipes", value: sampleRecipes.length },
  { icon: Heart, label: "Favorites", value: sampleRecipes.filter((r) => r.isFavorite).length },
  { icon: Clock, label: "Cooked", value: 12 },
];

const ProfilePage = () => {
  return (
    <div className="px-5 pt-6 pb-24">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-foreground mb-6">Profile</h1>
      </motion.div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <span className="text-2xl">👨‍🍳</span>
        </div>
        <h2 className="font-serif text-xl text-foreground">Home Chef</h2>
        <p className="text-sm text-muted-foreground">Member since 2025</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col items-center p-4 rounded-xl bg-card border border-border"
          >
            <s.icon size={20} className="text-primary mb-2" />
            <span className="text-2xl font-bold text-foreground">{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="space-y-2">
        {["Dietary Preferences", "Measurement Units", "Notifications", "About CookFlow"].map(
          (item, i) => (
            <button
              key={item}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border text-left"
            >
              <span className="text-sm font-medium text-foreground">{item}</span>
              <Settings size={16} className="text-muted-foreground" />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
