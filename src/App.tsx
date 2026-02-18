import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import CapturePage from "./pages/CapturePage";
import GroceryPage from "./pages/GroceryPage";
import CookPage from "./pages/CookPage";
import ProfilePage from "./pages/ProfilePage";
import ChatbotPage from "./pages/ChatbotPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RecipeDetail from "./components/RecipeDetail";
import CookingMode from "./components/CookingMode";
import { RecipesProvider } from "./context/RecipesContext";
import { AuthProvider } from "./context/AuthContext";
import { GroceryProvider } from "./context/GroceryContext";
import { RootStackParamList, TabParamList, DrawerParamList } from "./navigation/types";

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerContent = (props: DrawerContentComponentProps) => {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Guest";

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    const parent = props.navigation.getParent();
    parent?.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const navigateToChatbot = () => {
    props.navigation.navigate("Chatbot");
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
        <View
          style={{
            backgroundColor: "#FF7A59",
            borderRadius: 18,
            padding: 16,
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Image
            source={require("../public/logo.png")}
            style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#FFF7ED" }}
          />
          <View>
            <Text style={{ color: "#FFF7ED", fontSize: 18, fontWeight: "700" }}>CookFlow</Text>
            <Text style={{ color: "#FFE6D5", fontSize: 12, marginTop: 4 }}>{displayName}</Text>
          </View>
        </View>
      </View>
      <DrawerItemList {...props} />
      
      {/* Chatbot Button in Side Menu */}
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <TouchableOpacity
          onPress={navigateToChatbot}
          activeOpacity={0.9}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            backgroundColor: "#FFE1D1",
            borderWidth: 1,
            borderColor: "#F3D2C3",
          }}
        >
          <Ionicons name="chatbubble-ellipses" size={18} color="#FF7A59" />
          <Text style={{ color: "#FF7A59", fontWeight: "700", fontSize: 14 }}>CookFlow AI</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.9}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            backgroundColor: "#FFF2E8",
            borderWidth: 1,
            borderColor: "#F3D2C3",
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#C24C2C" />
          <Text style={{ color: "#C24C2C", fontWeight: "700", fontSize: 14 }}>Log out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={DrawerContent}
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: "#FFF0E6" },
      headerTintColor: "#243B53",
      headerTitleStyle: { fontWeight: "700" },
      drawerActiveTintColor: "#B23B1F",
      drawerInactiveTintColor: "#243B53",
      drawerLabelStyle: { fontSize: 14, fontWeight: "700" },
      drawerItemStyle: { borderRadius: 12 },
      drawerActiveBackgroundColor: "#FFE1D1",
      drawerInactiveBackgroundColor: "#FFF2E8",
      drawerStyle: { backgroundColor: "#FFF7F0" },
      sceneContainerStyle: { backgroundColor: "transparent" },
    }}
  >
    <Drawer.Screen name="Home" component={HomePage} />
    <Drawer.Screen name="Capture" component={CapturePage} />
    <Drawer.Screen name="Grocery" component={GroceryPage} />
    <Drawer.Screen name="Cook" component={CookPage} />
    <Drawer.Screen name="Profile" component={ProfilePage} />
    <Drawer.Screen name="Chatbot" component={ChatbotPage} options={{ drawerItemStyle: { display: 'none' } }} />
  </Drawer.Navigator>
);

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
    <AuthProvider>
      <RecipesProvider>
        <GroceryProvider>
          <NavigationContainer theme={navTheme}>
            <StatusBar style="dark" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginPage} />
              <Stack.Screen name="Signup" component={SignupPage} />
              <Stack.Screen name="Tabs" component={Tabs} />
              <Stack.Screen name="Drawer" component={DrawerNavigator} />
              <Stack.Screen name="RecipeDetail" component={RecipeDetail} options={{ presentation: "modal" }} />
              <Stack.Screen name="CookingMode" component={CookingMode} options={{ presentation: "fullScreenModal" }} />
            </Stack.Navigator>
          </NavigationContainer>
        </GroceryProvider>
      </RecipesProvider>
    </AuthProvider>
  </SafeAreaProvider>
);

export default App;
