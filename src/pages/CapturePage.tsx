import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, TextInput, Modal, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { analyzeRecipeImage, analyzeRecipeText } from "../lib/gemini";
import { useRecipes } from "../context/RecipesContext";
import { useGrocery } from "../context/GroceryContext";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"youtube" | "weblink" | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { addRecipe } = useRecipes();
  const { addList } = useGrocery();

  const buildRecipe = (data: any) => {
    const recipe = {
      id: Date.now().toString(),
      title: data.title || "Untitled Recipe",
      description: data.description || "",
      ingredients: data.ingredients || [],
      steps: data.steps || [],
      cookTime: data.cookTime || 30,
      prepTime: data.prepTime || 15,
      servings: data.servings || 4,
      difficulty: data.difficulty || "Medium",
      cuisine: data.cuisine || "International",
      tags: data.tags || [],
      image: data.image || null,
      isFavorite: false,
      createdAt: new Date(),
    };
    console.log("🏗️ [Capture] Building recipe:", recipe);
    return recipe;
  };

  const extractThumbnail = async (url: string): Promise<string | null> => {
    try {
      // For YouTube videos
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('youtu.be') 
          ? url.split('/').pop()?.split('?')[0]
          : new URL(url).searchParams.get('v');
        if (videoId) {
          return `https://img.youtube.com/vi/${videoId}/0.jpg`;
        }
      }
      
      // For regular websites, try to get favicon
      try {
        const domain = new URL(url).origin;
        return `${domain}/favicon.ico`;
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  };

  const uriToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleScan = async () => {
    console.log("📸 Scan Recipe button pressed");
    Alert.alert("Scan Recipe", "Camera scanning coming soon! For now, use Upload Image.");
  };

  const handleUpload = async () => {
    console.log("📷 Upload Image button pressed");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setIsProcessing(true);
        const uri = result.assets[0].uri;
        
        try {
          const base64 = await uriToBase64(uri);
          const aiRecipe = await analyzeRecipeImage(base64);
          const recipe = buildRecipe({
            ...aiRecipe,
            image: uri,
            tags: [...(aiRecipe.tags || []), "upload", "ai-captured"],
          });
          addRecipe(recipe);
          
          if (aiRecipe.ingredients && aiRecipe.ingredients.length > 0) {
            const groceryItems = aiRecipe.ingredients.map((ing: any) => ({
              name: ing.name,
              amount: ing.amount || "1",
              unit: ing.unit || "piece",
              category: ing.category || "other",
              checked: false,
            }));
            await addList(`Ingredients for ${recipe.title}`, groceryItems);
          }
          
          Alert.alert("Success!", `Recipe "${recipe.title}" added successfully!`);
        } catch (error: any) {
          console.error("AI Analysis Error:", error);
          Alert.alert("AI Analysis Failed", error.message || "Could not analyze the image. Please try again.");
        } finally {
          setIsProcessing(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      setIsProcessing(false);
    }
  };

  const handleYouTube = () => {
    console.log("🎥 YouTube Link button pressed");
    setModalType("youtube");
    setModalVisible(true);
    setInputUrl("");
  };

  const handleWebLink = () => {
    console.log("🔗 Web Link button pressed");
    setModalType("weblink");
    setModalVisible(true);
    setInputUrl("");
  };

  const handleModalSubmit = async () => {
    console.log("🔗 [Capture] Modal submit clicked with URL:", inputUrl);
    
    if (inputUrl.trim()) {
      setIsProcessing(true);
      setModalVisible(false);
      
      try {
        console.log("🤖 [Capture] Starting AI analysis for:", inputUrl);
        const aiRecipe = await analyzeRecipeText(inputUrl);
        console.log("✅ [Capture] AI analysis successful:", aiRecipe);
        
        // Extract thumbnail from URL
        const thumbnail = await extractThumbnail(inputUrl);
        console.log("🖼️ [Capture] Extracted thumbnail:", thumbnail);
        
        const recipe = buildRecipe({
          ...aiRecipe,
          image: thumbnail || aiRecipe.image || null,
          tags: [...(aiRecipe.tags || []), modalType === "youtube" ? "youtube" : "weblink", "ai-captured"],
        });
        console.log("📝 [Capture] Built recipe:", recipe);
        
        addRecipe(recipe);
        console.log("➕ [Capture] Recipe added to context");
        
        if (aiRecipe.ingredients && aiRecipe.ingredients.length > 0) {
          const groceryItems = aiRecipe.ingredients.map((ing: any) => ({
            name: ing.name,
            amount: ing.amount || "1",
            unit: ing.unit || "piece",
            category: ing.category || "other",
            checked: false,
          }));
          await addList(`Ingredients for ${recipe.title}`, groceryItems);
          console.log("🛒 [Capture] Grocery list created");
        }
        
        Alert.alert("Success!", `Recipe "${recipe.title}" added successfully!`);
      } catch (error: any) {
        console.error("❌ [Capture] AI Analysis Error:", error);
        console.error("❌ [Capture] Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        
        // Fallback: create a basic recipe from URL with thumbnail
        const thumbnail = await extractThumbnail(inputUrl);
        const fallbackRecipe = buildRecipe({
          title: `Recipe from ${modalType === "youtube" ? "YouTube" : "Website"}`,
          description: `Recipe extracted from: ${inputUrl}`,
          image: thumbnail || null,
          ingredients: [
            { name: "Ingredient 1", amount: "1", unit: "cup", category: "other" },
            { name: "Ingredient 2", amount: "2", unit: "tbsp", category: "other" },
          ],
          steps: [
            { instruction: "Step 1: Prepare ingredients", duration: 5 },
            { instruction: "Step 2: Cook according to recipe", duration: 15 },
          ],
          tags: [modalType === "youtube" ? "youtube" : "weblink", "manual-entry"],
        });
        
        addRecipe(fallbackRecipe);
        Alert.alert("Partial Success", `AI analysis failed, but created a basic recipe. You can edit it manually. Error: ${error.message}`);
      } finally {
        setIsProcessing(false);
      }
    } else {
      console.log("⚠️ [Capture] No URL provided");
      Alert.alert("Error", "Please enter a valid URL");
    }
    
    setInputUrl("");
    setModalType(null);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setInputUrl("");
    setModalType(null);
  };

  const getHandler = (title: string) => {
    switch (title) {
      case "Scan Recipe":
        return handleScan;
      case "Upload Image":
        return handleUpload;
      case "YouTube Link":
        return handleYouTube;
      case "Web Link":
        return handleWebLink;
      default:
        return () => Alert.alert("Option", `${title} selected`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Capture</Text>
      <Text style={styles.subtitle}>Add recipes from any source</Text>

      <View style={styles.optionList}>
        {captureOptions.map((opt) => (
          <TouchableOpacity 
            key={opt.title} 
            style={styles.optionCard} 
            activeOpacity={0.9}
            onPress={() => {
              console.log(`🔘 TouchableOpacity pressed for: ${opt.title}`);
              getHandler(opt.title)();
            }}
          >
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
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === "youtube" ? "YouTube Link" : "Web Link"}
              </Text>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder={
                modalType === "youtube" 
                  ? "Paste YouTube video URL..." 
                  : "Paste recipe website URL..."
              }
              value={inputUrl}
              onChangeText={setInputUrl}
              autoFocus
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={handleModalCancel}>
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonSubmit} onPress={handleModalSubmit}>
                <Text style={styles.modalButtonTextSubmit}>Import</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingContent}>
            <ActivityIndicator size="large" color="#FF7A59" />
            <Text style={styles.processingText}>AI is analyzing...</Text>
            <Text style={styles.processingSubtext}>This may take a few seconds</Text>
          </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2933",
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E6E8EC",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 80,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalButtonCancel: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#EEF0F3",
    alignItems: "center",
  },
  modalButtonSubmit: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FF7A59",
    alignItems: "center",
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7B8794",
  },
  modalButtonTextSubmit: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    gap: 15,
  },
  processingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2933",
  },
  processingSubtext: {
    fontSize: 14,
    color: "#7B8794",
    textAlign: "center",
  },
});

export default CapturePage;
