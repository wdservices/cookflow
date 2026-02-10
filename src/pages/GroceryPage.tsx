import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRecipes } from "../context/RecipesContext";

type GroceryItem = {
  name: string;
  amount: string;
  unit: string;
  category: string;
  checked: boolean;
};

const categoryLabels: Record<string, string> = {
  produce: "🥬 Produce",
  protein: "🥩 Protein",
  dairy: "🧀 Dairy",
  spices: "🌶️ Spices",
  pantry: "🏪 Pantry",
  other: "📦 Other",
};

const GroceryPage = () => {
  const { recipes } = useRecipes();
  const initialItems = useMemo(() => {
    const map = new Map<string, GroceryItem>();
    recipes
      .filter((r) => r.isFavorite)
      .forEach((r) => {
        r.ingredients.forEach((ing) => {
          const key = ing.name.toLowerCase();
          if (map.has(key)) {
            const existing = map.get(key)!;
            existing.amount += ` + ${ing.amount}`;
          } else {
            map.set(key, { ...ing, checked: false });
          }
        });
      });
    return Array.from(map.values());
  }, [recipes]);

  const [items, setItems] = useState<GroceryItem[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const toggle = (name: string) =>
    setItems((prev) => prev.map((i) => (i.name === name ? { ...i, checked: !i.checked } : i)));

  const categories = [...new Set(items.map((i) => i.category))];
  const checkedCount = items.filter((i) => i.checked).length;
  const progress = items.length ? checkedCount / items.length : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Grocery List</Text>
      <Text style={styles.subtitle}>From your favorited recipes</Text>

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {checkedCount}/{items.length}
        </Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="cart-outline" size={48} color="#CBD2D9" />
          <Text style={styles.emptyText}>Favorite some recipes to build your grocery list</Text>
        </View>
      ) : (
        categories.map((cat) => (
          <View key={cat} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{categoryLabels[cat] || cat}</Text>
            <View style={styles.categoryList}>
              {items
                .filter((i) => i.category === cat)
                .map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    style={[styles.itemRow, item.checked ? styles.itemChecked : null]}
                    activeOpacity={0.9}
                    onPress={() => toggle(item.name)}
                  >
                    <View style={[styles.checkbox, item.checked ? styles.checkboxChecked : null]}>
                      {item.checked && <Ionicons name="checkmark" size={14} color="#0B0F1A" />}
                    </View>
                    <Text style={[styles.itemName, item.checked ? styles.itemNameChecked : null]}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemAmount}>
                      {item.amount} {item.unit}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        ))
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
    fontSize: 14,
    color: "#7B8794",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
    marginBottom: 10,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E6E8EC",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4B7BE5",
  },
  progressText: {
    fontSize: 12,
    color: "#7B8794",
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
  categorySection: {
    marginTop: 16,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7B8794",
    marginBottom: 8,
  },
  categoryList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  itemChecked: {
    backgroundColor: "#E8F0FF",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CBD2D9",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4B7BE5",
    borderColor: "#4B7BE5",
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: "#1F2933",
  },
  itemNameChecked: {
    textDecorationLine: "line-through",
    color: "#7B8794",
  },
  itemAmount: {
    fontSize: 12,
    color: "#7B8794",
  },
});

export default GroceryPage;
