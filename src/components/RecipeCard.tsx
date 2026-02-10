import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Recipe } from "../data/sampleRecipes";

type RecipeCardProps = {
  recipe: Recipe;
  onToggleFavorite?: (id: string) => void;
  onPress?: (recipe: Recipe) => void;
};

const RecipeCard = ({ recipe, onToggleFavorite, onPress }: RecipeCardProps) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => onPress?.(recipe)}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: recipe.image }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={styles.favoriteButton}
          activeOpacity={0.8}
          onPress={() => onToggleFavorite?.(recipe.id)}
        >
          <Ionicons name={recipe.isFavorite ? "heart" : "heart-outline"} size={18} color="#2B7A5A" />
        </TouchableOpacity>
        <View style={styles.difficultyPill}>
          <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {recipe.description}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color="#7B8794" />
            <Text style={styles.metaText}>{recipe.cookTime + recipe.prepTime}m</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={14} color="#7B8794" />
            <Text style={styles.metaText}>{recipe.servings}</Text>
          </View>
          <Text style={styles.cuisine}>{recipe.cuisine}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E8EC",
  },
  imageWrap: {
    position: "relative",
    height: 176,
    backgroundColor: "#F2F3F5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  difficultyPill: {
    position: "absolute",
    left: 12,
    bottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#2B7A5A",
  },
  difficultyText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2933",
  },
  description: {
    marginTop: 4,
    fontSize: 12,
    color: "#7B8794",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#7B8794",
  },
  cuisine: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#2B7A5A",
    fontWeight: "600",
  },
});

export default RecipeCard;
