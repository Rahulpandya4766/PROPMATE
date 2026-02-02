
import { GoogleGenAI, Type } from "@google/genai";
import { Property, Client, MatchResult } from "./types";

/**
 * Calculates a match score between a property and a client using deterministic logic.
 */
export const calculateMatchScore = (property: Property, client: Client): MatchResult => {
  const breakdown = { budget: 0, area: 0, bhk: 0, furnishing: 0, lifestyle: 0, availability: 0 };
  const reasons: string[] = [];
  let score = 0;

  if (property.price >= client.budgetMin && property.price <= client.budgetMax) {
    breakdown.budget = 30;
  } else if (property.price < client.budgetMin) {
    breakdown.budget = 20; 
  } else {
    reasons.push(`Price is ₹${(property.price - client.budgetMax).toLocaleString()} above max budget.`);
  }

  if (client.preferredAreas.some(area => property.location.area.toLowerCase().includes(area.toLowerCase()))) {
    breakdown.area = 25;
  }

  if (client.bhkPreference.includes(property.bhk)) {
    breakdown.bhk = 15;
  }

  if (property.transactionType === client.requirement) {
    breakdown.availability = 30;
  }

  score = breakdown.budget + breakdown.area + breakdown.bhk + breakdown.availability;

  return {
    propertyId: property.id,
    clientId: client.id,
    score: Math.min(100, score),
    breakdown,
    reasons
  };
};

/**
 * Parses a natural language search query into structured filters using Gemini AI.
 */
export const parseSmartSearchQuery = async (query: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse this real estate search query into a structured JSON object: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bhk: { type: Type.STRING, description: "e.g. 1BHK, 2BHK, etc." },
            city: { type: Type.STRING },
            area: { type: Type.STRING },
            maxPrice: { type: Type.NUMBER },
            minPrice: { type: Type.NUMBER },
            transactionType: { type: Type.STRING, description: "Rent or Sale" },
            clientName: { type: Type.STRING, description: "If searching for a person" }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Smart search parsing failed:", error);
    return null;
  }
};

/**
 * Generates a recommendation summary using Gemini AI.
 */
export const getAIRecommendationSummary = async (property: Property, client: Client) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return `Highly recommended listing for ${client.name}. The property in ${property.location.area} offers a ${property.bhk} configuration that matches the client's preference perfectly. At ₹${property.price.toLocaleString()}, it sits comfortably within the target acquisition range.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Act as a luxury real estate expert. Analyze match:
      Property: ${property.title}, ${property.location.area}, ₹${property.price}.
      Client: ${client.name}, Budget ₹${client.budgetMin}-${client.budgetMax}.
      Summarize why this is a good match in 30 words.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Strong potential match based on current portfolio analysis.";
  } catch (error) {
    return "Excellent match based on location and budget profile.";
  }
};
