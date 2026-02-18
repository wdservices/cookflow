import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import RecipeCard from "../components/RecipeCard";
import FloatingChatbotButton from "../components/FloatingChatbotButton";
import { useRecipes } from "../context/RecipesContext";
import { useGrocery } from "../context/GroceryContext";
import { RootStackParamList } from "../navigation/types";

const HomePage = () => {
  const { recipes, toggleFavorite } = useRecipes();
  const { lists } = useGrocery();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(search.toLowerCase())
      ),
    [recipes, search]
  );

  const favorites = filtered.filter((r) => r.isFavorite);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>CookFlow</Text>
      <Text style={styles.subtitle}>What are we cooking today?</Text>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#7B8794" />
        <TextInput
          placeholder="Search recipes or cuisines..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor="#7B8794"
        />
      </View>

      {favorites.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {favorites.map((recipe) => (
              <View key={recipe.id} style={styles.horizontalCard}>
                <RecipeCard
                  recipe={recipe}
                  onToggleFavorite={toggleFavorite}
                  onPress={() => navigation.navigate("RecipeDetail", { recipeId: recipe.id })}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Recipes</Text>
        <View style={styles.grid}>
          {filtered.map((recipe) => (
            <View key={recipe.id} style={styles.gridItem}>
              <RecipeCard
                recipe={recipe}
                onToggleFavorite={toggleFavorite}
                onPress={() => navigation.navigate("RecipeDetail", { recipeId: recipe.id })}
              />
            </View>
          ))}
        </View>
      </View>

      {lists.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Grocery Lists</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Grocery" as any)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {lists.slice(0, 3).map((list) => (
              <TouchableOpacity 
                key={list.id} 
                style={styles.groceryCard}
                onPress={() => navigation.navigate("Grocery" as any)}
              >
                <View style={styles.groceryIcon}>
                  <Ionicons name="cart" size={20} color="#FF7A59" />
                </View>
                <View>
                  <Text style={styles.groceryTitle}>{list.title}</Text>
                  <Text style={styles.groceryCount}>{list.items.length} items</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
    <FloatingChatbotButton />
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6F2",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2933",
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 14,
    color: "#7B8794",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#EEF0F3",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2933",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2933",
    marginBottom: 12,
  },
  horizontalList: {
    gap: 12,
    paddingRight: 10,
  },
  horizontalCard: {
    width: 260,
  },
  grid: {
    gap: 14,
  },
  gridItem: {
    width: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    color: "#FF7A59",
    fontWeight: "600",
  },
  groceryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E8EC",
    marginRight: 12,
    minWidth: 200,
  },
  groceryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF0E6",
    alignItems: "center",
    justifyContent: "center",
  },
  groceryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2933",
  },
  groceryCount: {
    fontSize: 13,
    color: "#7B8794",
    marginTop: 2,
  },
});

export default HomePage;
