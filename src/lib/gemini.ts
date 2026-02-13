import { Recipe } from "../data/sampleRecipes";

// NOTE: In a real production app, you should NEVER hardcode API keys.
export const GEMINI_API_KEY = "AIzaSyDce3xPSBK-v_tuPNEW6SAOWtwU7Q8HaZA"; // Update this line with the new API key

const SYSTEM_PROMPT = `
You are a professional chef and recipe extractor. 
Your task is to analyze the provided input (image or text) and extract a detailed recipe in JSON format.
The JSON must strictly follow this structure:
{
  "title": "Recipe Name",
  "description": "Short appetizing description",
  "image": "URL to recipe image or thumbnail (extract from webpage if available, otherwise use null)",
  "cookTime": 30, (number in minutes)
  "prepTime": 15, (number in minutes)
  "servings": 4, (number)
  "difficulty": "Easy" | "Medium" | "Hard",
  "cuisine": "Cuisine type",
  "tags": ["tag1", "tag2"],
  "ingredients": [
    { "name": "Ingredient name", "amount": "1", "unit": "cup", "category": "produce" | "protein" | "dairy" | "spices" | "pantry" | "other" }
  ],
  "steps": [
    { "instruction": "Step instruction", "duration": 5, "timerLabel": "Optional label" }
  ]
}
For YouTube URLs, extract the video thumbnail using: https://img.youtube.com/vi/VIDEO_ID/0.jpg
For web pages, look for Open Graph image (og:image) or the main recipe image.
Return ONLY the JSON object, no other text.
`;

const MOCK_RECIPE: Partial<Recipe> = {
  title: "Classic Homemade Pasta",
  description: "A simple yet delicious fresh pasta recipe using just a few pantry staples.",
  image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=400&fit=crop",
  cookTime: 10,
  prepTime: 30,
  servings: 4,
  difficulty: "Medium",
  cuisine: "Italian",
  tags: ["Fresh", "Vegetarian", "Main Dish"],
  ingredients: [
    { name: "All-purpose flour", amount: "2", unit: "cups", category: "pantry" },
    { name: "Eggs", amount: "3", unit: "large", category: "dairy" },
    { name: "Salt", amount: "1/2", unit: "tsp", category: "spices" },
    { name: "Olive oil", amount: "1", unit: "tbsp", category: "pantry" }
  ],
  steps: [
    { instruction: "Mound flour on a clean surface and create a well in the center.", duration: 5 },
    { instruction: "Crack eggs into the well and add salt and oil.", duration: 2 },
    { instruction: "Gently whisk eggs with a fork, slowly incorporating flour from the edges.", duration: 10 },
    { instruction: "Knead the dough until smooth and elastic, then let rest for 30 minutes.", duration: 30 }
  ]
};

export const analyzeRecipeImage = async (base64Image: string): Promise<Partial<Recipe>> => {
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    console.log("🤖 [Gemini] Analyzing image...");
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: SYSTEM_PROMPT },
            { inline_data: { mime_type: "image/jpeg", data: base64Image } },
          ],
        }],
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      const isQuota = data.error.code === 429 || data.error.message?.toLowerCase().includes("quota");
      if (isQuota) {
        console.warn("⚠️ [Gemini Quota] Image analysis failed. Falling back to Mock Recipe for testing...");
        return MOCK_RECIPE;
      }
      throw new Error(data.error.message || "Gemini API Error");
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No text content from Gemini");
    
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error("❌ [Gemini Image Error]", error);
    // Re-throw the error so CapturePage can show it to the user
    throw new Error(error.message || "Failed to analyze image with AI");
  }
};

export const analyzeRecipeText = async (inputText: string): Promise<Partial<Recipe>> => {
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `Extract recipe from this text/URL: ${inputText}`;

  try {
    console.log("🤖 [Gemini] Analyzing text/URL...");
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: SYSTEM_PROMPT },
            { text: prompt },
          ],
        }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      const isQuota = data.error.code === 429 || data.error.message?.toLowerCase().includes("quota");
      if (isQuota) {
        console.warn("⚠️ [Gemini Quota] Quota exceeded. Using mock recipe...");
        return MOCK_RECIPE;
      }
      throw new Error(data.error.message || "Gemini API Error");
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No text content from Gemini");

    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error("❌ [Gemini Text Error]", error);
    throw new Error(error.message || "Failed to analyze text with AI");
  }
};
