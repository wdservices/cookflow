import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRecipes } from "../context/RecipesContext";
import { RootStackParamList } from "../navigation/types";

const CookPage = () => {
  const { recipes } = useRecipes();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cook</Text>
      <Text style={styles.subtitle}>Pick a recipe to start cooking</Text>

      <View style={styles.list}>
        {recipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("CookingMode", { recipeId: recipe.id })}
          >
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {recipe.title}
              </Text>
              <Text style={styles.cardSubtitle}>
                {recipe.steps.length} steps · {recipe.cookTime + recipe.prepTime}m
              </Text>
            </View>
            <View style={styles.playButton}>
              <Ionicons name="play" size={16} color="#2B7A5A" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {recipes.length === 0 && (
        <View style={styles.emptyWrap}>
          <Ionicons name="restaurant-outline" size={48} color="#CBD2D9" />
          <Text style={styles.emptyText}>No recipes yet. Capture some first!</Text>
        </View>
      )}
    </ScrollView>
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
  list: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E8EC",
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#EEF0F3",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2933",
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#7B8794",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F4EE",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyWrap: {
    marginTop: 40,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 13,
    color: "#7B8794",
    textAlign: "center",
  },
});

export default CookPage;
