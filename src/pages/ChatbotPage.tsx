import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { GEMINI_API_KEY } from "../lib/gemini";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface Attachment {
  type: "image" | "link";
  value: string;
  base64?: string;
  mimeType?: string;
}

const SYSTEM_PROMPT = `You are CookFlow AI, a helpful sous-chef. Provide recipe advice, analyze food images, or extract recipes from links. 
IMPORTANT: Do not use asterisks (*) for bolding or lists. Use plain text and simple capitalization for emphasis. Speak naturally like a human chef.`;

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Welcome back! Paste a recipe link, upload a photo of your fridge, or just ask me how to cook something!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState<Attachment | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const addMessage = useCallback((content: string, sender: "user" | "bot") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setTimeout(scrollToBottom, 100);
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions to upload images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setCurrentAttachment({
        type: "image",
        value: asset.uri,
        base64: asset.base64 || "",
        mimeType: "image/jpeg",
      });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera permissions to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setCurrentAttachment({
        type: "image",
        value: asset.uri,
        base64: asset.base64 || "",
        mimeType: "image/jpeg",
      });
    }
  };

  const addLink = () => {
    Alert.prompt(
      "Add Recipe Link",
      "Paste the recipe URL:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: (url) => {
            if (url && url.trim()) {
              setCurrentAttachment({
                type: "link",
                value: url.trim(),
              });
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const clearAttachment = () => {
    setCurrentAttachment(null);
  };

  const callGemini = async (promptText: string, attachment: Attachment | null): Promise<string> => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const contents: any[] = [
      {
        parts: [{ text: promptText }],
      },
    ];

    if (attachment) {
      if (attachment.type === "image" && attachment.base64) {
        contents[0].parts.push({
          inlineData: {
            mimeType: attachment.mimeType || "image/jpeg",
            data: attachment.base64,
          },
        });
      } else if (attachment.type === "link") {
        contents[0].parts[0].text += `\n\nContext link to analyze: ${attachment.value}`;
      }
    }

    const payload = {
      contents,
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
    };

    // Retry logic
    for (let i = 0; i < 3; i++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        let responseText =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I couldn't process that. Try asking differently!";

        // Remove asterisks
        return responseText.replace(/\*/g, "");
      } catch (err) {
        if (i === 2) throw err;
        await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
      }
    }

    return "Sorry, I'm having trouble connecting. Please try again.";
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text && !currentAttachment) return;

    const userDisplay = text || (currentAttachment?.type === "link" ? "Analyze this link" : "Analyze this image");
    addMessage(userDisplay, "user");

    const savedAttachment = currentAttachment;
    setInputText("");
    setCurrentAttachment(null);
    setIsLoading(true);

    try {
      const aiResponse = await callGemini(text || "Please look at this and help me with a recipe.", savedAttachment);
      addMessage(aiResponse, "bot");
    } catch (err) {
      console.error("Chatbot error:", err);
      addMessage("Sorry, I'm having trouble connecting to the kitchen right now. Please try again.", "bot");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === "user";
    return (
      <View
        key={message.id}
        style={[
          styles.messageRow,
          isUser ? styles.userRow : styles.botRow,
        ]}
      >
        <View
          style={[
            styles.avatar,
            isUser ? styles.userAvatar : styles.botAvatar,
          ]}
        >
          <Ionicons
            name={isUser ? "person" : "restaurant"}
            size={14}
            color={isUser ? "#666" : "#FF7A59"}
          />
        </View>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.botBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
            {message.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="restaurant" size={24} color="#FF7A59" />
          </View>
          <View>
            <Text style={styles.headerTitle}>CookFlow AI</Text>
            <Text style={styles.headerSubtitle}>Live Cooking Assistant</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
      >
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#FF7A59" />
            <Text style={styles.loadingText}>CookFlow is cooking up an answer...</Text>
          </View>
        )}
      </ScrollView>

      {/* Attachment Preview */}
      {currentAttachment && (
        <View style={styles.attachmentPreview}>
          <View style={styles.attachmentContent}>
            <Ionicons
              name={currentAttachment.type === "image" ? "image" : "link"}
              size={16}
              color="#FF7A59"
            />
            <Text style={styles.attachmentText} numberOfLines={1}>
              {currentAttachment.type === "image"
                ? "Image attached"
                : `Link: ${currentAttachment.value.substring(0, 30)}...`}
            </Text>
          </View>
          <TouchableOpacity onPress={clearAttachment}>
            <Ionicons name="close-circle" size={20} color="#FF7A59" />
          </TouchableOpacity>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={addLink} style={styles.actionButton}>
              <Ionicons name="link" size={22} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={styles.actionButton}>
              <Ionicons name="images" size={22} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.actionButton}>
              <Ionicons name="camera" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
              maxHeight={100}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() && !currentAttachment) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() && !currentAttachment}
            >
              <Ionicons name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7F0",
  },
  header: {
    backgroundColor: "#FF7A59",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 10,
  },
  userRow: {
    flexDirection: "row-reverse",
  },
  botRow: {
    flexDirection: "row",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userAvatar: {
    backgroundColor: "#E5E5E5",
  },
  botAvatar: {
    backgroundColor: "#FFE1D1",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: "#FF7A59",
    borderTopRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#F3D2C3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: "#FFF",
  },
  botText: {
    color: "#1F2933",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 42,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 12,
    color: "#666",
  },
  attachmentPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFE1D1",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3D2C3",
  },
  attachmentContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  attachmentText: {
    fontSize: 13,
    color: "#B23B1F",
    fontWeight: "500",
    flex: 1,
  },
  inputContainer: {
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F3D2C3",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
  },
  actionButton: {
    padding: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1F2933",
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    backgroundColor: "#FF7A59",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#CCC",
  },
});

export default ChatbotPage;
