export type TabParamList = {
  Home: undefined;
  Capture: undefined;
  Grocery: undefined;
  Cook: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  RecipeDetail: { recipeId: string };
  CookingMode: { recipeId: string };
};
