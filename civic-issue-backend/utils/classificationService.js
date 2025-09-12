const { HfInference } = require("@huggingface/inference");

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Define the 10 civic issue categories
const ISSUE_CATEGORIES = [
  "Roads and Infrastructure",
  "Water and Sewage",
  "Electricity and Power",
  "Waste Management",
  "Public Safety",
  "Parks and Recreation",
  "Traffic and Transportation",
  "Environmental Issues",
  "Housing and Buildings",
  "General Complaints",
];

// Category mapping for better classification
const CATEGORY_KEYWORDS = {
  "Roads and Infrastructure": [
    "pothole",
    "road",
    "street",
    "sidewalk",
    "pavement",
    "asphalt",
    "crack",
    "damage",
    "repair",
    "construction",
    "infrastructure",
    "bridge",
    "tunnel",
    "highway",
  ],
  "Water and Sewage": [
    "water",
    "sewage",
    "drain",
    "pipe",
    "leak",
    "flood",
    "overflow",
    "blockage",
    "sewer",
    "plumbing",
    "hydrant",
    "water main",
    "drainage",
  ],
  "Electricity and Power": [
    "electricity",
    "power",
    "outage",
    "blackout",
    "street light",
    "lamp",
    "wire",
    "electrical",
    "transformer",
    "power line",
    "flickering",
    "broken light",
  ],
  "Waste Management": [
    "garbage",
    "trash",
    "waste",
    "dumpster",
    "recycling",
    "litter",
    "cleanup",
    "collection",
    "bin",
    "landfill",
    "disposal",
    "pickup",
  ],
  "Public Safety": [
    "safety",
    "crime",
    "police",
    "emergency",
    "vandalism",
    "theft",
    "assault",
    "security",
    "dangerous",
    "hazard",
    "threat",
    "suspicious",
  ],
  "Parks and Recreation": [
    "park",
    "playground",
    "recreation",
    "sports",
    "field",
    "court",
    "equipment",
    "benches",
    "trees",
    "grass",
    "maintenance",
    "facilities",
  ],
  "Traffic and Transportation": [
    "traffic",
    "bus",
    "stop",
    "sign",
    "signal",
    "parking",
    "vehicle",
    "accident",
    "congestion",
    "public transport",
    "metro",
    "train",
    "station",
  ],
  "Environmental Issues": [
    "environment",
    "pollution",
    "air quality",
    "noise",
    "smell",
    "chemical",
    "contamination",
    "green space",
    "trees",
    "wildlife",
    "conservation",
  ],
  "Housing and Buildings": [
    "building",
    "housing",
    "apartment",
    "condo",
    "maintenance",
    "repair",
    "elevator",
    "heating",
    "cooling",
    "facilities",
    "property",
  ],
  "General Complaints": [
    "complaint",
    "issue",
    "problem",
    "concern",
    "service",
    "quality",
    "delay",
    "inconvenience",
    "dissatisfaction",
    "feedback",
  ],
};

/**
 * Classify an issue description using Hugging Face API
 * @param {string} description - The issue description to classify
 * @param {string} title - The issue title (optional, used for context)
 * @returns {Promise<Object>} - Classification result with category and confidence
 */
async function classifyIssue(description, title = "") {
  try {
    // Combine title and description for better context
    const fullText = `${title} ${description}`.trim();

    if (!fullText) {
      throw new Error("No text provided for classification");
    }

    // Use a zero-shot classification model for better results
    const result = await hf.zeroShotClassification({
      model: "facebook/bart-large-mnli",
      inputs: fullText,
      parameters: {
        candidate_labels: ISSUE_CATEGORIES,
      },
    });

    // Extract the best classification result
    const bestMatch = result[0];
    const predictedCategory = bestMatch.labels[0];
    const confidence = bestMatch.scores[0];

    // If confidence is too low, try keyword-based classification as fallback
    if (confidence < 0.3) {
      const keywordCategory = classifyByKeywords(fullText);
      if (keywordCategory) {
        return {
          category: keywordCategory,
          confidence: 0.6, // Medium confidence for keyword-based classification
          method: "keyword-based",
        };
      }
    }

    return {
      category: predictedCategory,
      confidence: confidence,
      method: "ai-classification",
      allScores: bestMatch.scores.map((score, index) => ({
        category: bestMatch.labels[index],
        score: score,
      })),
    };
  } catch (error) {
    console.error("Error in AI classification:", error);

    // Fallback to keyword-based classification
    const keywordCategory = classifyByKeywords(
      `${title} ${description}`.trim()
    );
    if (keywordCategory) {
      return {
        category: keywordCategory,
        confidence: 0.5,
        method: "keyword-fallback",
      };
    }

    // If all else fails, return a default category
    return {
      category: "General Complaints",
      confidence: 0.1,
      method: "default",
    };
  }
}

/**
 * Fallback classification using keyword matching
 * @param {string} text - Text to classify
 * @returns {string|null} - Predicted category or null
 */
function classifyByKeywords(text) {
  const lowerText = text.toLowerCase();
  const categoryScores = {};

  // Score each category based on keyword matches
  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    let score = 0;
    keywords.forEach((keyword) => {
      if (lowerText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });
    categoryScores[category] = score;
  });

  // Find the category with the highest score
  const bestCategory = Object.entries(categoryScores).sort(
    ([, a], [, b]) => b - a
  )[0];

  // Return category if it has at least one keyword match
  return bestCategory && bestCategory[1] > 0 ? bestCategory[0] : null;
}

/**
 * Get all available issue categories
 * @returns {Array<string>} - List of all categories
 */
function getCategories() {
  return ISSUE_CATEGORIES;
}

/**
 * Get category keywords for a specific category
 * @param {string} category - Category name
 * @returns {Array<string>} - List of keywords for the category
 */
function getCategoryKeywords(category) {
  return CATEGORY_KEYWORDS[category] || [];
}

module.exports = {
  classifyIssue,
  getCategories,
  getCategoryKeywords,
  ISSUE_CATEGORIES,
};
