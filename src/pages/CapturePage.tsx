import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const captureOptions = [
  {
    icon: "camera",
    title: "Scan Recipe",
    description: "Take a photo of a recipe book page",
    background: "#E6F4EE",
    color: "#2B7A5A",
  },
  {
    icon: "image-outline",
    title: "Upload Image",
    description: "Upload an image from your gallery",
    background: "#E8F0FF",
    color: "#4B7BE5",
  },
  {
    icon: "logo-youtube",
    title: "YouTube Link",
    description: "Paste a YouTube cooking video URL",
    background: "#FDEAEA",
    color: "#E03A3E",
  },
  {
    icon: "link",
    title: "Web Link",
    description: "Import from any recipe website",
    background: "#EFE9FF",
    color: "#7C5CE7",
  },
];

const CapturePage = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Capture</Text>
      <Text style={styles.subtitle}>Add recipes from any source</Text>

      <View style={styles.optionList}>
        {captureOptions.map((opt) => (
          <TouchableOpacity key={opt.title} style={styles.optionCard} activeOpacity={0.9}>
            <View style={[styles.optionIcon, { backgroundColor: opt.background }]}>
              <Ionicons name={opt.icon as never} size={24} color={opt.color} />
            </View>
            <View>
              <Text style={styles.optionTitle}>{opt.title}</Text>
              <Text style={styles.optionDescription}>{opt.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.dropZone}>
        <View style={styles.dropIcon}>
          <Ionicons name="camera" size={28} color="#7B8794" />
        </View>
        <Text style={styles.dropText}>Drop an image here, or tap an option above</Text>
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
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 20,
    fontSize: 14,
    color: "#7B8794",
  },
  optionList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E8EC",
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2933",
  },
  optionDescription: {
    marginTop: 2,
    fontSize: 12,
    color: "#7B8794",
  },
  dropZone: {
    marginTop: 24,
    padding: 20,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#E6E8EC",
    borderStyle: "dashed",
    alignItems: "center",
    gap: 12,
  },
  dropIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF0F3",
    alignItems: "center",
    justifyContent: "center",
  },
  dropText: {
    fontSize: 13,
    color: "#7B8794",
    textAlign: "center",
  },
});

export default CapturePage;
