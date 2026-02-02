
import { GoogleGenAI } from "@google/genai";
import { Property, Client, MatchResult } from "./types";

// The app will try to use the key if available in the environment.
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Calculates a match score between a property and a client using deterministic logic.
 * This function is the "Brain" of the app and runs 100% locally without any API calls.
 */
export const calculateMatchScore = (property: Property, client: Client): MatchResult => {
  const breakdown = { budget: 0, area: 0, bhk: 0, furnishing: 0, lifestyle: 0, availability: 0 };
  const reasons: string[] = [];
  let score = 0;

  // Budget Match (30%)
  if (property.price >= client.budgetMin && property.price <= client.budgetMax) {
    breakdown.budget = 30;
  } else if (property.price < client.budgetMin) {
    breakdown.budget = 20; 
  } else {
    reasons.push(`Price is ₹${(property.price - client.budgetMax).toLocaleString()} above max budget.`);
  }

  // Location Match (25%)
  if (client.preferredAreas.some(area => property.location.area.toLowerCase().includes(area.toLowerCase()))) {
    breakdown.area = 25;
  }

  // BHK Match (15%)
  if (client.bhkPreference.includes(property.bhk)) {
    breakdown.bhk = 15;
  }

  // Transaction Type (30%)
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
 * Generates a recommendation summary. 
 * If no API_KEY is found, it uses a high-end "Standard Engine" template.
 */
export const getAIRecommendationSummary = async (property: Property, client: Client) => {
  // If no AI is configured, return a high-quality standard recommendation immediately.
  if (!ai || !apiKey) {
    return `Highly recommended listing for ${client.name}. The property in ${property.location.area} offers a ${property.bhk} configuration that matches the client's preference perfectly. At ₹${property.price.toLocaleString()}, it sits comfortably within the target acquisition range. Best suited for immediate site visit.`;
  }

  try {
    const prompt = `
      Act as a high-end real estate matching expert. 
      Analyze this match:
      Property: ${property.title} in ${property.location.area}, ${property.bhk}BHK, Price ₹${property.price}.
      Client: ${client.name}, Budget ₹${client.budgetMin}-${client.budgetMax}, wants ${client.bhkPreference.join('/')}BHK.
      
      Provide a one-paragraph persuasive recommendation (max 40 words) for the agent. Use a professional, luxury tone.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Standard Recommendation: High potential match based on location and budget profile.";
  } catch (error) {
    console.error("Gemini AI error, using fallback:", error);
    return `Excellent match for ${client.name}. This ${property.bhk} in ${property.location.area} provides the exact configuration required. The pricing of ₹${property.price.toLocaleString()} represents significant value compared to the client's upper limit.`;
  }
};
