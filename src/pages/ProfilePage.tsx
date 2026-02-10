import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRecipes } from "../context/RecipesContext";

const ProfilePage = () => {
  const { recipes } = useRecipes();
  const stats = [
    { icon: "book-outline", label: "Recipes", value: recipes.length },
    { icon: "heart-outline", label: "Favorites", value: recipes.filter((r) => r.isFavorite).length },
    { icon: "time-outline", label: "Cooked", value: 12 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>👨‍🍳</Text>
        </View>
        <Text style={styles.name}>Home Chef</Text>
        <Text style={styles.member}>Member since 2025</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Ionicons name={s.icon as never} size={20} color="#2B7A5A" />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.settingsList}>
        {["Dietary Preferences", "Measurement Units", "Notifications", "About CookFlow"].map((item) => (
          <TouchableOpacity key={item} style={styles.settingsItem} activeOpacity={0.9}>
            <Text style={styles.settingsText}>{item}</Text>
            <Ionicons name="settings-outline" size={16} color="#7B8794" />
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2933",
    marginBottom: 16,
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E6F4EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2933",
  },
  member: {
    fontSize: 12,
    color: "#7B8794",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E8EC",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2933",
  },
  statLabel: {
    fontSize: 11,
    color: "#7B8794",
  },
  settingsList: {
    gap: 10,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E8EC",
  },
  settingsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2933",
  },
});

export default ProfilePage;
