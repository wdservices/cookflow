import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../navigation/types";
import { useRecipes } from "../context/RecipesContext";

type Props = NativeStackScreenProps<RootStackParamList, "RecipeDetail">;

const RecipeDetail = ({ navigation, route }: Props) => {
  const { recipes } = useRecipes();
  const recipe = recipes.find((r) => r.id === route.params.recipeId);

  if (!recipe) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Recipe not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Image source={{ uri: recipe.image }} style={styles.heroImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1F2933" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.subtitle}>{recipe.description}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Ionicons name="time-outline" size={16} color="#2B7A5A" />
            <Text style={styles.statText}>{recipe.prepTime + recipe.cookTime}m</Text>
          </View>
          <View style={styles.statPill}>
            <Ionicons name="people-outline" size={16} color="#4B7BE5" />
            <Text style={styles.statText}>{recipe.servings} servings</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statText}>{recipe.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients.map((ing, index) => (
          <View key={`${ing.name}-${index}`} style={styles.ingredientRow}>
            <View style={styles.bullet} />
            <Text style={styles.ingredientName}>{ing.name}</Text>
            <Text style={styles.ingredientAmount}>
              {ing.amount} {ing.unit}
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Steps</Text>
        {recipe.steps.map((step, index) => (
          <View key={`${step.instruction}-${index}`} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>{step.instruction}</Text>
              {step.duration && (
                <View style={styles.timerPill}>
                  <Ionicons name="timer-outline" size={12} color="#2B7A5A" />
                  <Text style={styles.timerText}>
                    {step.duration}m — {step.timerLabel}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6F2",
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    height: 260,
    backgroundColor: "#E8E8E8",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  body: {
    paddingHorizontal: 20,
    marginTop: -28,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2933",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#7B8794",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  statPill: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  statText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334E68",
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2933",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E8EC",
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2B7A5A",
    marginRight: 12,
  },
  ingredientName: {
    flex: 1,
    fontSize: 14,
    color: "#1F2933",
  },
  ingredientAmount: {
    fontSize: 13,
    color: "#7B8794",
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2B7A5A",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: "#1F2933",
    lineHeight: 20,
  },
  timerPill: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#E6F4EE",
    alignSelf: "flex-start",
  },
  timerText: {
    fontSize: 11,
    color: "#2B7A5A",
    fontWeight: "600",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F6F2",
  },
  emptyText: {
    fontSize: 16,
    color: "#7B8794",
  },
});

export default RecipeDetail;
