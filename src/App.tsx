import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomePage from "./pages/HomePage";
import CapturePage from "./pages/CapturePage";
import GroceryPage from "./pages/GroceryPage";
import CookPage from "./pages/CookPage";
import ProfilePage from "./pages/ProfilePage";
import RecipeDetail from "./components/RecipeDetail";
import CookingMode from "./components/CookingMode";
import { RecipesProvider } from "./context/RecipesContext";
import { RootStackParamList, TabParamList } from "./navigation/types";

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const Tabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarActiveTintColor: "#2B7A5A",
      tabBarInactiveTintColor: "#9AA5B1",
      tabBarStyle: {
        height: 68,
        paddingBottom: 10,
        paddingTop: 6,
      },
      tabBarIcon: ({ focused, color, size }) => {
        const iconMap: Record<keyof TabParamList, [string, string]> = {
          Home: ["home", "home-outline"],
          Capture: ["camera", "camera-outline"],
          Grocery: ["cart", "cart-outline"],
          Cook: ["restaurant", "restaurant-outline"],
          Profile: ["person", "person-outline"],
        };
        const [filled, outline] = iconMap[route.name];
        return <Ionicons name={(focused ? filled : outline) as never} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomePage} />
    <Tab.Screen name="Capture" component={CapturePage} />
    <Tab.Screen name="Grocery" component={GroceryPage} />
    <Tab.Screen name="Cook" component={CookPage} />
    <Tab.Screen name="Profile" component={ProfilePage} />
  </Tab.Navigator>
);

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F7F6F2",
  },
};

const App = () => (
  <SafeAreaProvider>
    <RecipesProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetail} options={{ presentation: "modal" }} />
          <Stack.Screen name="CookingMode" component={CookingMode} options={{ presentation: "fullScreenModal" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecipesProvider>
  </SafeAreaProvider>
);

export default App;
