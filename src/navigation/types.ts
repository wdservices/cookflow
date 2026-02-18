export type TabParamList = {
  Home: undefined;
  Capture: undefined;
  Grocery: undefined;
  Cook: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  Home: undefined;
  Capture: undefined;
  Grocery: undefined;
  Cook: undefined;
  Profile: undefined;
  Chatbot: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Drawer: undefined;
  Tabs: undefined;
  RecipeDetail: { recipeId: string };
  CookingMode: { recipeId: string };
};
