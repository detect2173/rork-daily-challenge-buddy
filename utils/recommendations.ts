import { Challenge, Recommendation } from '@/types/challenge';

// Extract keywords from a string
const extractKeywords = (text: string): string[] => {
  // Remove common words and punctuation
  const cleanText = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s{2,}/g, ' ');
  
  // Split into words
  const words = cleanText.split(' ');
  
  // Filter out common words (simple stopwords list)
  const stopwords = ['the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'you', 'that', 'was', 'for', 'on', 'are', 'with', 'as', 'i', 'his', 'they', 'be', 'at', 'one', 'have', 'this', 'from'];
  
  return words.filter(word => 
    word.length > 3 && !stopwords.includes(word)
  );
};

// Find common themes in challenges
const findCommonThemes = (challenges: Challenge[]): Record<string, number> => {
  const themeCounts: Record<string, number> = {};
  
  challenges.forEach(challenge => {
    const promptKeywords = extractKeywords(challenge.prompt);
    const lessonKeywords = extractKeywords(challenge.lesson);
    const challengeKeywords = extractKeywords(challenge.challenge);
    
    const allKeywords = [...new Set([...promptKeywords, ...lessonKeywords, ...challengeKeywords])];
    
    allKeywords.forEach(keyword => {
      themeCounts[keyword] = (themeCounts[keyword] || 0) + 1;
    });
  });
  
  return themeCounts;
};

// Generate recommendations based on challenge history
export const generateRecommendationsFromHistory = (challenges: Challenge[]): Recommendation[] => {
  if (challenges.length === 0) return [];
  
  // Find common themes
  const themeCounts = findCommonThemes(challenges);
  
  // Sort themes by frequency
  const sortedThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([theme]) => theme)
    .slice(0, 10); // Take top 10 themes
  
  // Predefined recommendation templates
  const recommendationTemplates = [
    {
      title: "Level Up Your Skills",
      description: "Take your practice to the next level with more advanced techniques.",
      promptTemplate: "Advanced techniques for {theme}",
      category: "skill-building"
    },
    {
      title: "Try a New Approach",
      description: "Explore different methods to enhance your learning experience.",
      promptTemplate: "Alternative approaches to {theme}",
      category: "exploration"
    },
    {
      title: "Build a Daily Habit",
      description: "Transform your practice into a consistent daily routine.",
      promptTemplate: "Creating a daily habit for {theme}",
      category: "habit-formation"
    },
    {
      title: "Overcome Obstacles",
      description: "Address common challenges that might be holding you back.",
      promptTemplate: "Overcoming challenges in {theme}",
      category: "problem-solving"
    },
    {
      title: "Connect with Others",
      description: "Enhance your learning through collaboration and community.",
      promptTemplate: "Finding community for {theme} practice",
      category: "social"
    }
  ];
  
  // Generate recommendations
  const recommendations: Recommendation[] = [];
  
  // Use the top themes to create recommendations
  sortedThemes.slice(0, 3).forEach(theme => {
    // Pick a random template for each theme
    const template = recommendationTemplates[Math.floor(Math.random() * recommendationTemplates.length)];
    
    recommendations.push({
      id: `rec-${theme}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: template.title,
      description: template.description,
      prompt: template.promptTemplate.replace('{theme}', theme),
      category: template.category,
      relatedTo: [theme]
    });
  });
  
  // Add a recommendation based on streak
  if (challenges.some(c => c.completed)) {
    recommendations.push({
      id: `rec-streak-${Date.now()}`,
      title: "Maintain Your Momentum",
      description: "Keep your streak going with a challenge designed to build on your progress.",
      prompt: "How to maintain consistency with my daily practice",
      category: "motivation",
      relatedTo: sortedThemes.slice(0, 2)
    });
  }
  
  // Add a recommendation for trying something new
  if (challenges.length >= 3) {
    recommendations.push({
      id: `rec-new-${Date.now()}`,
      title: "Expand Your Horizons",
      description: "Try something complementary to your current focus areas.",
      prompt: "Complementary skills to enhance my current practice",
      category: "exploration",
      relatedTo: sortedThemes.slice(0, 2)
    });
  }
  
  return recommendations;
};