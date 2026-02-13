import { useCallback, useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../navigation/types";
import { useRecipes } from "../context/RecipesContext";

type Props = NativeStackScreenProps<RootStackParamList, "CookingMode">;

const CookingMode = ({ navigation, route }: Props) => {
  const { recipes } = useRecipes();
  const recipe = useMemo(() => recipes.find((r) => r.id === route.params.recipeId), [recipes, route.params.recipeId]);
  const [step, setStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  const currentStep = recipe?.steps?.[step];

  const startTimer = useCallback(() => {
    if (currentStep?.duration) {
      setTimerSeconds(currentStep.duration * 60);
      setTimerRunning(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!timerRunning || timerSeconds === null || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => (s !== null && s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  useEffect(() => {
    if (timerSeconds === 0) {
      setTimerRunning(false);
      // Optional: Add alert or vibration here
    }
  }, [timerSeconds]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const next = () => {
    if (recipe && recipe.steps && step < recipe.steps.length - 1) {
      setStep(step + 1);
      setTimerSeconds(null);
      setTimerRunning(false);
    }
  };

  const prev = () => {
    if (step > 0) {
      setStep(step - 1);
      setTimerSeconds(null);
      setTimerRunning(false);
    }
  };

  if (!recipe || !recipe.steps || !recipe.steps[step]) {
    return (
      <LinearGradient colors={["#1B1F2A", "#2A1D1C", "#3B1F1A"]} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={20} color="#FFF7F0" />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Cooking steps unavailable for this recipe.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#1B1F2A", "#2A1D1C", "#3B1F1A"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={20} color="#FFF7F0" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Step {step + 1} of {recipe.steps.length}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.progressRow}>
        {recipe.steps.map((_, index) => (
          <View key={`step-${index}`} style={[styles.progressBar, index <= step ? styles.progressActive : null]} />
        ))}
      </View>

      <View style={styles.stepBody}>
        <Text style={styles.stepText}>{recipe.steps[step].instruction}</Text>

        {recipe.steps[step].duration && (
          <View style={styles.timerWrap}>
            {timerSeconds !== null ? (
              <View style={styles.timerActive}>
                <Text style={[styles.timerValue, timerSeconds === 0 ? styles.timerEnded : null]}>
                  {formatTime(timerSeconds)}
                </Text>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <TouchableOpacity style={styles.timerButton} onPress={() => setTimerRunning(!timerRunning)}>
                    <Ionicons name={timerRunning ? "pause" : "play"} size={20} color="#2B0E0B" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.timerButton, { backgroundColor: 'rgba(255,255,255,0.1)' }]} onPress={() => setTimerSeconds(null)}>
                    <Ionicons name="refresh" size={20} color="#FFF7F0" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.timerStart} onPress={startTimer}>
                <Ionicons name="timer-outline" size={16} color="#2B0E0B" />
                <Text style={styles.timerStartText}>Start {recipe.steps[step].duration}m timer</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={[styles.circleButton, step === 0 ? styles.disabledButton : null]} onPress={prev} disabled={step === 0}>
          <Ionicons name="chevron-back" size={24} color="#FFF7F0" />
        </TouchableOpacity>
        {step === recipe.steps.length - 1 ? (
          <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
            <Text style={styles.doneText}>Finish Cooking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.circleButtonPrimary} onPress={next}>
            <Ionicons name="chevron-forward" size={24} color="#2B0E0B" />
          </TouchableOpacity>
        )}
        <View style={styles.headerSpacer} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  headerText: {
    color: "rgba(255,247,240,0.8)",
    fontSize: 12,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 40,
  },
  progressRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  progressActive: {
    backgroundColor: "#FF7A59",
  },
  stepBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  stepText: {
    color: "#FFF7F0",
    fontSize: 20,
    fontWeight: "300",
    textAlign: "center",
    lineHeight: 28,
  },
  timerWrap: {
    marginTop: 24,
    alignItems: "center",
  },
  timerActive: {
    alignItems: "center",
    gap: 12,
  },
  timerValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFF7F0",
  },
  timerEnded: {
    color: "#FF7A59",
  },
  timerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF7A59",
  },
  timerStart: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#FF7A59",
  },
  timerStartText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2B0E0B",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  circleButtonPrimary: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF7A59",
  },
  disabledButton: {
    opacity: 0.3,
  },
  doneButton: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#FFF7F0",
  },
  doneText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2B0E0B",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  emptyText: {
    color: "rgba(255,247,240,0.7)",
    fontSize: 14,
  },
});

export default CookingMode;
