import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import { RootStackParamList } from "../navigation/types";

const SignupPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setStatus(null);
    if (!isFirebaseConfigured || !auth) {
      setStatus("Firebase isn't configured yet.");
      return;
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      setStatus("Fill in all fields to continue.");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting signup for:", cleanEmail);
      
      const credential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      console.log("User created, updating profile with name:", cleanName);
      
      await updateProfile(credential.user, { displayName: cleanName });
      console.log("Signup complete");
      
      navigation.replace("Drawer");
    } catch (error: any) {
      console.error("Signup error:", JSON.stringify(error, null, 2));
      let errorMessage = "Unable to create account. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/Password sign-up is disabled in Firebase.";
      }
      
      setStatus(errorMessage);
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoWrap}>
            <Image source={require("../../public/logo.png")} style={styles.logo} />
            <Text style={styles.brand}>Cookflow</Text>
            <Text style={styles.tagline}>Create your cooking space</Text>
          </View>

          <View style={styles.card}>
          <Text style={styles.cardTitle}>Create account</Text>
          <Text style={styles.cardSubtitle}>Start saving and syncing recipes</Text>

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

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={handleSignup} disabled={loading}>
            <Text style={styles.primaryButtonText}>{loading ? "Creating..." : "Create account"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} activeOpacity={0.9} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkButtonText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
          
          {status && <Text style={styles.statusText}>{status}</Text>}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>By creating an account you agree to our terms and privacy policy.</Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 28,
    justifyContent: "space-between",
  },
  logoWrap: {
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 86,
    height: 86,
    borderRadius: 24,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2933",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#7B8794",
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
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FF7A59",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFF7F0",
    fontSize: 15,
    fontWeight: "700",
  },
  linkButton: {
    paddingVertical: 8,
    alignItems: "center",
  },
  linkButtonText: {
    fontSize: 13,
    color: "#52606D",
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

export default SignupPage;
