
import { GoogleGenAI, Type } from "@google/genai";
import { Property, Client, MatchResult } from "./types";

// Always use a named parameter and direct process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Calculates a match score between a property and a client using deterministic logic.
 * Weights: Budget (30%), Location (25%), BHK (15%), Furnishing (10%), etc.
 */
export const calculateMatchScore = (property: Property, client: Client): MatchResult => {
  const breakdown = { budget: 0, area: 0, bhk: 0, furnishing: 0, lifestyle: 0, availability: 0 };
  const reasons: string[] = [];
  let score = 0;

  // Budget Match (30%)
  if (property.price >= client.budgetMin && property.price <= client.budgetMax) {
    breakdown.budget = 30;
  } else if (property.price < client.budgetMin) {
    breakdown.budget = 15; // Within reach but too low
  } else {
    reasons.push(`Price is ₹${property.price - client.budgetMax} above maximum budget.`);
  }

  // Location Match (25%)
  if (client.preferredAreas.some(area => property.location.area.toLowerCase().includes(area.toLowerCase()))) {
    breakdown.area = 25;
  } else {
    reasons.push(`Property is in ${property.location.area}, not in preferred areas.`);
  }

  // BHK Match (15%)
  if (client.bhkPreference.includes(property.bhk)) {
    breakdown.bhk = 15;
  } else {
    reasons.push(`Property is ${property.bhk}, client wants ${client.bhkPreference.join('/')}.`);
  }

  // Furnishing (10%)
  // Fix: furnishingPreference is now an array
  if (client.furnishingPreference.includes(property.furnishing)) {
    breakdown.furnishing = 10;
  } else {
    reasons.push(`Furnishing is ${property.furnishing}, client prefers ${client.furnishingPreference.join('/')}.`);
  }

  // Transaction Type (20%)
  if (property.transactionType === client.requirement) {
    breakdown.availability = 20;
  } else {
    reasons.push(`Client wants to ${client.requirement}, property is for ${property.transactionType}.`);
  }

  score = breakdown.budget + breakdown.area + breakdown.bhk + breakdown.furnishing + breakdown.availability;

  return {
    propertyId: property.id,
    clientId: client.id,
    score: Math.min(100, score),
    breakdown,
    reasons
  };
};

/**
 * Use Gemini to generate a creative summary of why this property is a good match for the client.
 */
export const getAIRecommendationSummary = async (property: Property, client: Client) => {
  try {
    const prompt = `
      Act as a high-end real estate matching expert. 
      Analyze this match:
      Property: ${property.title} in ${property.location.area}, ${property.bhk}BHK, Price ₹${property.price}.
      Client: ${client.name}, Budget ₹${client.budgetMin}-${client.budgetMax}, wants ${client.bhkPreference.join('/')}BHK in ${client.preferredAreas.join(', ')}.
      
      Provide a one-paragraph persuasive recommendation (max 50 words) on why the agent should pitch this. 
      Focus on value and lifestyle. Use professional tone.
    `;

    // Always query generateContent with model name and contents.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    // The GenerateContentResponse features a text property.
    return response.text || "No AI summary generated.";
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "Error generating AI summary.";
  }
};
