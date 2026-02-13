import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import { RootStackParamList } from "../navigation/types";

type Mode = "signin" | "signup";

const LoginPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setAuthStatus(null);
    if (!isFirebaseConfigured || !auth) {
      setAuthStatus("Firebase configuration missing.");
      return;
    }

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanPassword) {
      setAuthStatus("Please enter email and password.");
      return;
    }

    if (mode === "signup" && !cleanName) {
      setAuthStatus("Please enter your name.");
      return;
    }

    try {
      setLoading(true);
      if (mode === "signin") {
        console.log("Signing in...");
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      } else {
        console.log("Creating account...");
        const credential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        await updateProfile(credential.user, { displayName: cleanName });
      }
      navigation.replace("Drawer");
    } catch (error: any) {
      console.error("Auth error:", error.code, error.message);
      let msg = "An error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") msg = "Email already registered.";
      else if (error.code === "auth/invalid-email") msg = "Invalid email address.";
      else if (error.code === "auth/weak-password") msg = "Password too weak (min 6 chars).";
      else if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        msg = "Invalid email or password.";
      }
      setAuthStatus(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=1000&q=80" }}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient colors={["rgba(255, 242, 230, 0.9)", "rgba(255, 247, 240, 0.95)", "rgba(234, 247, 240, 1)"]} style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <View style={styles.logoWrap}>
                <Image source={require("../../public/logo.png")} style={styles.logo} />
                <Text style={styles.brand}>Cookflow</Text>
                <Text style={styles.tagline}>Your smart recipe companion</Text>
              </View>

              <View style={styles.card}>
              <View style={styles.toggleWrap}>
                <TouchableOpacity 
                  style={[styles.toggleBtn, mode === "signin" && styles.toggleActive]} 
                  onPress={() => { setMode("signin"); setAuthStatus(null); }}
                >
                  <Text style={[styles.toggleText, mode === "signin" && styles.toggleTextActive]}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleBtn, mode === "signup" && styles.toggleActive]} 
                  onPress={() => { setMode("signup"); setAuthStatus(null); }}
                >
                  <Text style={[styles.toggleText, mode === "signup" && styles.toggleTextActive]}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.cardTitle}>{mode === "signin" ? "Welcome Back" : "Create Account"}</Text>

              {mode === "signup" && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    placeholderTextColor="#9AA5B1"
                  />
                </View>
              )}

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#9AA5B1"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#9AA5B1"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon} 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#7B8794" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={handleAuth} disabled={loading}>
                <Text style={styles.primaryButtonText}>
                  {loading ? (mode === "signin" ? "Signing in..." : "Creating...") : (mode === "signin" ? "Sign In" : "Create Account")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.9} onPress={() => navigation.replace("Drawer")}>
                <Text style={styles.secondaryButtonText}>Continue as guest</Text>
              </TouchableOpacity>

              {authStatus && <Text style={styles.statusText}>{authStatus}</Text>}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>By continuing you agree to our terms and privacy policy.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 28,
    justifyContent: "space-between",
  },
  logoWrap: {
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#FFF7ED",
  },
  brand: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2933",
  },
  tagline: {
    fontSize: 13,
    color: "#7B8794",
  },
  card: {
    padding: 22,
    borderRadius: 22,
    backgroundColor: "#FFFDF9",
    borderWidth: 1,
    borderColor: "#F3D2C3",
    gap: 14,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.08)",
  },
  toggleWrap: {
    flexDirection: "row",
    backgroundColor: "#FFF7F0",
    borderRadius: 12,
    padding: 4,
    gap: 4,
    marginBottom: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: "#FF7A59",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#52606D",
  },
  toggleTextActive: {
    color: "#FFF7F0",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2933",
    textAlign: "center",
    marginBottom: 4,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#52606D",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#F3D2C3",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1F2933",
    backgroundColor: "#FFF7F0",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3D2C3",
    borderRadius: 12,
    backgroundColor: "#FFF7F0",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1F2933",
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  primaryButton: {
    marginTop: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FF7A59",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFF7F0",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD4C1",
    alignItems: "center",
    backgroundColor: "#FFF3EC",
  },
  secondaryButtonText: {
    color: "#C24C2C",
    fontSize: 14,
    fontWeight: "600",
  },
  statusText: {
    fontSize: 12,
    color: "#C24C2C",
    textAlign: "center",
    marginTop: 4,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 11,
    color: "#9AA5B1",
    textAlign: "center",
  },
});

export default LoginPage;
