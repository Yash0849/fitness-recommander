const nutritionDatabase = {
  pizza: { calories: 285, protein: 12, carbs: 36, fats: 10, servingEstimate: '1 slice' },
  rice: { calories: 130, protein: 2.7, carbs: 28, fats: 0.3, servingEstimate: '100g bowl' },
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fats: 3.6, servingEstimate: '100g serving' },
  burger: { calories: 295, protein: 17, carbs: 30, fats: 13, servingEstimate: '1 burger' },
  pasta: { calories: 157, protein: 5.8, carbs: 31, fats: 0.9, servingEstimate: '1 cup cooked' },
  salad: { calories: 95, protein: 3.5, carbs: 9, fats: 5, servingEstimate: '1 bowl' },
  banana: { calories: 105, protein: 1.3, carbs: 27, fats: 0.4, servingEstimate: '1 medium banana' },
  apple: { calories: 95, protein: 0.5, carbs: 25, fats: 0.3, servingEstimate: '1 medium apple' },
  sandwich: { calories: 250, protein: 14, carbs: 28, fats: 8, servingEstimate: '1 sandwich' },
  fries: { calories: 312, protein: 3.4, carbs: 41, fats: 15, servingEstimate: '1 medium serving' },
  omelette: { calories: 154, protein: 11, carbs: 1.3, fats: 11, servingEstimate: '2-egg omelette' },
  sushi: { calories: 200, protein: 8, carbs: 30, fats: 4, servingEstimate: '6 pieces' },
  dosa: { calories: 168, protein: 4, carbs: 27, fats: 4, servingEstimate: '1 dosa' },
  idli: { calories: 58, protein: 2, carbs: 12, fats: 0.4, servingEstimate: '1 idli' },
  biryani: { calories: 290, protein: 9, carbs: 38, fats: 11, servingEstimate: '1 cup' },
  noodles: { calories: 220, protein: 6, carbs: 40, fats: 5, servingEstimate: '1 bowl' },
  pancake: { calories: 227, protein: 6, carbs: 28, fats: 10, servingEstimate: '2 pancakes' },
  waffle: { calories: 218, protein: 6, carbs: 25, fats: 11, servingEstimate: '2 waffles' },
  taco: { calories: 226, protein: 9, carbs: 20, fats: 12, servingEstimate: '2 tacos' },
  wrap: { calories: 240, protein: 10, carbs: 26, fats: 10, servingEstimate: '1 wrap' },
  cake: { calories: 257, protein: 3, carbs: 38, fats: 10, servingEstimate: '1 slice' },
  icecream: { calories: 207, protein: 3.5, carbs: 24, fats: 11, servingEstimate: '1 scoop' },
  soup: { calories: 120, protein: 5, carbs: 14, fats: 5, servingEstimate: '1 bowl' },
  curry: { calories: 210, protein: 10, carbs: 18, fats: 11, servingEstimate: '1 bowl' },
  bread: { calories: 79, protein: 3.5, carbs: 15, fats: 1, servingEstimate: '2 slices' },
  mixedmeal: { calories: 320, protein: 14, carbs: 34, fats: 14, servingEstimate: '1 plate' },
};

const labelMapping = {
  pizza: 'pizza',
  pizz: 'pizza',
  cheeseburger: 'burger',
  burger: 'burger',
  hamburger: 'burger',
  rice: 'rice',
  sushi: 'sushi',
  burrito: 'sandwich',
  sandwich: 'sandwich',
  sub: 'sandwich',
  banana: 'banana',
  apple: 'apple',
  fries: 'fries',
  french: 'fries',
  salad: 'salad',
  pasta: 'pasta',
  spaghetti: 'pasta',
  noodle: 'noodles',
  noodles: 'noodles',
  chicken: 'chicken breast',
  omelet: 'omelette',
  omelette: 'omelette',
  dosa: 'dosa',
  idli: 'idli',
  biryani: 'biryani',
  pancake: 'pancake',
  pancakes: 'pancake',
  waffle: 'waffle',
  waffles: 'waffle',
  taco: 'taco',
  tacos: 'taco',
  wrap: 'wrap',
  shawarma: 'wrap',
  roll: 'wrap',
  cake: 'cake',
  ice: 'icecream',
  cream: 'icecream',
  soup: 'soup',
  curry: 'curry',
  bread: 'bread',
  naan: 'bread',
  roti: 'bread',
  chapati: 'bread',
};

const normalizeToken = (value) => value.toLowerCase().replace(/[^a-z\s]/g, ' ').trim();

const mapPredictionToFood = (label) => {
  const normalized = normalizeToken(label);
  const tokens = normalized.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    if (labelMapping[token]) {
      return labelMapping[token];
    }
  }

  const directKey = Object.keys(labelMapping).find((key) => normalized.includes(key));
  return directKey ? labelMapping[directKey] : null;
};

const lookupNutrition = (foodName) => nutritionDatabase[foodName] || null;

const estimateNutritionFromPredictions = (predictions = [], fileName = '') => {
  const normalizedLabels = [
    ...predictions.map((item) => normalizeToken(item.label)),
    normalizeToken(fileName),
  ].filter(Boolean);

  const combined = normalizedLabels.join(' ');

  const categoryRules = [
    { keywords: ['cake', 'dessert', 'ice', 'cream', 'waffle', 'pancake'], mappedFood: 'cake', note: 'Estimated from dessert-like image features.' },
    { keywords: ['taco', 'wrap', 'shawarma', 'burrito', 'roll'], mappedFood: 'wrap', note: 'Estimated from handheld meal-like image features.' },
    { keywords: ['soup', 'broth', 'bowl'], mappedFood: 'soup', note: 'Estimated from bowl-based meal features.' },
    { keywords: ['curry', 'stew', 'masala'], mappedFood: 'curry', note: 'Estimated from saucy meal features.' },
    { keywords: ['bread', 'naan', 'toast'], mappedFood: 'bread', note: 'Estimated from bread-like image features.' },
    { keywords: ['plate', 'dish', 'meal', 'lunch', 'dinner'], mappedFood: 'mixedmeal', note: 'Estimated as a generic mixed meal because the classifier was broad.' },
  ];

  for (const rule of categoryRules) {
    if (rule.keywords.some((keyword) => combined.includes(keyword))) {
      const nutrition = lookupNutrition(rule.mappedFood);
      if (!nutrition) continue;

      const bestPrediction = predictions[0];
      return [
        {
          foodName: rule.mappedFood === 'mixedmeal' ? 'mixed meal' : rule.mappedFood,
          confidence: bestPrediction?.confidence || 0.35,
          servingEstimate: nutrition.servingEstimate,
          estimationSource: 'fallback-estimate',
          notes: rule.note,
          calories: nutrition.calories,
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fats: nutrition.fats,
        },
      ];
    }
  }

  return [];
};

module.exports = {
  nutritionDatabase,
  mapPredictionToFood,
  lookupNutrition,
  estimateNutritionFromPredictions,
};
