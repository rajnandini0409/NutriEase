function matchesFoodPreference(meal, preference) {
  const tags = (meal.dietaryTags || []).map(tag =>
    String(tag).toLowerCase()
  );

  if (preference === "vegan") {
    return tags.includes("vegan");
  }

  if (preference === "vegetarian") {
    return tags.includes("vegetarian") && !tags.includes("eggetarian");
  }

  if (preference === "eggetarian") {
    return tags.includes("vegetarian") || tags.includes("eggetarian");
  }

  // Non-vegetarian users may choose from all available meals.
  return preference === "non-vegetarian";
}

export async function explainRecommendations(preferences, candidateMeals) {
  if (!candidateMeals?.length) {
    return {
      explanation: "No meals match your current preferences.",
      selectedIds: [],
      notes: "Check ingredient labels and allergy risks before eating."
    };
  }

  const allergyTerms = String(preferences.allergies || "")
    .toLowerCase()
    .split(",")
    .map(term => term.trim())
    .filter(Boolean);

  const eligibleMeals = candidateMeals.filter(meal => {
    const ingredients = (meal.ingredients || []).map(ingredient =>
      String(ingredient).toLowerCase()
    );

    const safeForAllergies = !allergyTerms.some(allergen =>
      ingredients.some(ingredient => ingredient.includes(allergen))
    );

    return (
      safeForAllergies &&
      matchesFoodPreference(meal, preferences.foodPreference)
    );
  });

  // Shuffle eligible meals to provide variety between requests.
  const shuffledMeals = [...eligibleMeals];

  for (let i = shuffledMeals.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledMeals[i], shuffledMeals[j]] = [
      shuffledMeals[j],
      shuffledMeals[i]
    ];
  }

  const selected = shuffledMeals.slice(0, 3);

  return {
    explanation: selected.length
      ? `Found ${selected.length} meal suggestion(s) matching your food preference, budget, cooking time, and ingredient filters.`
      : "No meals match all your selected preferences. Try increasing your budget or cooking time, or changing your food preference.",

    selectedIds: selected.map(meal => String(meal._id)),

    notes: "Meal prices are estimates. Check ingredient labels and cross-contamination risks if you have allergies. These suggestions are not medical or dietary treatment advice."
  };
}