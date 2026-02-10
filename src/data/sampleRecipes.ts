export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  category: "produce" | "protein" | "dairy" | "spices" | "pantry" | "other";
}

export interface RecipeStep {
  instruction: string;
  duration?: number; // minutes
  timerLabel?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: number;
  prepTime: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
  isFavorite: boolean;
}

export const sampleRecipes: Recipe[] = [
  {
    id: "1",
    title: "Tuscan Tomato Soup",
    description: "A rich, creamy tomato soup with fresh basil and a hint of garlic.",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    cookTime: 30,
    prepTime: 10,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Italian",
    tags: ["soup", "vegetarian", "comfort food"],
    isFavorite: true,
    ingredients: [
      { name: "Roma tomatoes", amount: "6", unit: "whole", category: "produce" },
      { name: "Garlic cloves", amount: "4", unit: "whole", category: "produce" },
      { name: "Fresh basil", amount: "1", unit: "cup", category: "produce" },
      { name: "Heavy cream", amount: "1/2", unit: "cup", category: "dairy" },
      { name: "Olive oil", amount: "2", unit: "tbsp", category: "pantry" },
      { name: "Salt", amount: "1", unit: "tsp", category: "spices" },
      { name: "Black pepper", amount: "1/2", unit: "tsp", category: "spices" },
    ],
    steps: [
      { instruction: "Preheat oven to 400°F. Halve tomatoes and place on a baking sheet with garlic." },
      { instruction: "Drizzle with olive oil and roast for 20 minutes.", duration: 20, timerLabel: "Roast tomatoes" },
      { instruction: "Transfer roasted tomatoes and garlic to a blender. Blend until smooth." },
      { instruction: "Pour into a pot, add cream, salt, and pepper. Simmer for 10 minutes.", duration: 10, timerLabel: "Simmer soup" },
      { instruction: "Garnish with fresh basil and serve warm." },
    ],
  },
  {
    id: "2",
    title: "Lemon Herb Chicken",
    description: "Juicy roasted chicken thighs with lemon, rosemary, and thyme.",
    image: "https://images.unsplash.com/photo-1598103442097-8b74f0830cb0?w=600&h=400&fit=crop",
    cookTime: 45,
    prepTime: 15,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Mediterranean",
    tags: ["chicken", "roasted", "dinner"],
    isFavorite: false,
    ingredients: [
      { name: "Chicken thighs", amount: "8", unit: "pieces", category: "protein" },
      { name: "Lemons", amount: "2", unit: "whole", category: "produce" },
      { name: "Fresh rosemary", amount: "3", unit: "sprigs", category: "produce" },
      { name: "Fresh thyme", amount: "4", unit: "sprigs", category: "produce" },
      { name: "Garlic cloves", amount: "6", unit: "whole", category: "produce" },
      { name: "Olive oil", amount: "3", unit: "tbsp", category: "pantry" },
      { name: "Paprika", amount: "1", unit: "tsp", category: "spices" },
    ],
    steps: [
      { instruction: "Preheat oven to 425°F." },
      { instruction: "Mix olive oil, lemon juice, minced garlic, paprika, salt, and pepper in a bowl." },
      { instruction: "Coat chicken thighs in the marinade. Let rest for 10 minutes.", duration: 10, timerLabel: "Marinate" },
      { instruction: "Place chicken in a baking dish with lemon slices, rosemary, and thyme." },
      { instruction: "Roast for 35-40 minutes until golden and cooked through.", duration: 38, timerLabel: "Roast chicken" },
      { instruction: "Let rest 5 minutes before serving.", duration: 5, timerLabel: "Rest" },
    ],
  },
  {
    id: "3",
    title: "Mango Sticky Rice",
    description: "Sweet coconut sticky rice topped with fresh ripe mango slices.",
    image: "https://images.unsplash.com/photo-1625938145744-533e82e59f42?w=600&h=400&fit=crop",
    cookTime: 30,
    prepTime: 20,
    servings: 2,
    difficulty: "Medium",
    cuisine: "Thai",
    tags: ["dessert", "thai", "sweet"],
    isFavorite: true,
    ingredients: [
      { name: "Sticky rice", amount: "1", unit: "cup", category: "pantry" },
      { name: "Coconut milk", amount: "1", unit: "can", category: "pantry" },
      { name: "Sugar", amount: "3", unit: "tbsp", category: "pantry" },
      { name: "Ripe mango", amount: "2", unit: "whole", category: "produce" },
      { name: "Salt", amount: "1/4", unit: "tsp", category: "spices" },
    ],
    steps: [
      { instruction: "Soak sticky rice in water for at least 4 hours or overnight." },
      { instruction: "Steam the soaked rice for 20 minutes until tender.", duration: 20, timerLabel: "Steam rice" },
      { instruction: "Heat coconut milk with sugar and salt until dissolved." },
      { instruction: "Pour half the coconut sauce over hot rice. Let absorb for 10 minutes.", duration: 10, timerLabel: "Absorb sauce" },
      { instruction: "Slice mangoes and serve alongside sticky rice. Drizzle remaining sauce on top." },
    ],
  },
  {
    id: "4",
    title: "Spicy Black Bean Tacos",
    description: "Crispy corn tortillas with seasoned black beans, avocado, and pickled onions.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    cookTime: 15,
    prepTime: 10,
    servings: 3,
    difficulty: "Easy",
    cuisine: "Mexican",
    tags: ["tacos", "vegan", "quick"],
    isFavorite: false,
    ingredients: [
      { name: "Black beans", amount: "2", unit: "cans", category: "pantry" },
      { name: "Corn tortillas", amount: "6", unit: "whole", category: "pantry" },
      { name: "Avocado", amount: "2", unit: "whole", category: "produce" },
      { name: "Red onion", amount: "1", unit: "whole", category: "produce" },
      { name: "Lime", amount: "2", unit: "whole", category: "produce" },
      { name: "Cumin", amount: "1", unit: "tsp", category: "spices" },
      { name: "Chili powder", amount: "1", unit: "tsp", category: "spices" },
      { name: "Cilantro", amount: "1/2", unit: "cup", category: "produce" },
    ],
    steps: [
      { instruction: "Drain and rinse black beans. Heat in a pan with cumin, chili powder, and salt." },
      { instruction: "Warm tortillas in a dry skillet until lightly charred.", duration: 3, timerLabel: "Warm tortillas" },
      { instruction: "Slice avocado and thinly slice red onion." },
      { instruction: "Assemble tacos with beans, avocado, onion, cilantro, and a squeeze of lime." },
    ],
  },
  {
    id: "5",
    title: "Classic Shakshuka",
    description: "Eggs poached in a spiced tomato and pepper sauce with crusty bread.",
    image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=600&h=400&fit=crop",
    cookTime: 25,
    prepTime: 10,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Middle Eastern",
    tags: ["breakfast", "eggs", "one-pan"],
    isFavorite: true,
    ingredients: [
      { name: "Eggs", amount: "4", unit: "whole", category: "protein" },
      { name: "Canned tomatoes", amount: "1", unit: "can", category: "pantry" },
      { name: "Bell pepper", amount: "1", unit: "whole", category: "produce" },
      { name: "Onion", amount: "1", unit: "whole", category: "produce" },
      { name: "Garlic cloves", amount: "3", unit: "whole", category: "produce" },
      { name: "Cumin", amount: "1", unit: "tsp", category: "spices" },
      { name: "Paprika", amount: "1", unit: "tsp", category: "spices" },
      { name: "Feta cheese", amount: "1/4", unit: "cup", category: "dairy" },
    ],
    steps: [
      { instruction: "Sauté diced onion and bell pepper in olive oil until softened.", duration: 5, timerLabel: "Sauté veggies" },
      { instruction: "Add garlic, cumin, and paprika. Cook for 1 minute." },
      { instruction: "Pour in canned tomatoes and simmer for 10 minutes.", duration: 10, timerLabel: "Simmer sauce" },
      { instruction: "Make small wells in the sauce and crack eggs into them." },
      { instruction: "Cover and cook until eggs are set, about 8 minutes.", duration: 8, timerLabel: "Poach eggs" },
      { instruction: "Crumble feta on top and serve with crusty bread." },
    ],
  },
];
