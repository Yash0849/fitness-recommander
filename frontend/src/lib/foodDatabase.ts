// Local food database with Indian foods, snacks, and fruits
// Nutrition values are per 100g unless specified otherwise

export interface FoodItem {
  name: string;
  aliases?: string[]; // Alternative names/variations
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
}

// Indian Snacks
const indianSnacks: FoodItem[] = [
  { name: 'samosa', aliases: ['samosa', 'samosas'], calories: 262, protein: 4.2, carbs: 33.2, fats: 12.5 },
  { name: 'pakora', aliases: ['pakora', 'pakodas', 'bhajji'], calories: 180, protein: 4.5, carbs: 20.0, fats: 8.5 },
  { name: 'vada', aliases: ['vada', 'medu vada', 'dahi vada'], calories: 220, protein: 5.0, carbs: 28.0, fats: 9.0 },
  { name: 'bhel puri', aliases: ['bhel puri', 'bhelpuri'], calories: 150, protein: 3.5, carbs: 25.0, fats: 4.5 },
  { name: 'pani puri', aliases: ['pani puri', 'golgappa', 'puchka'], calories: 80, protein: 2.0, carbs: 15.0, fats: 1.5 },
  { name: 'dhokla', aliases: ['dhokla', 'khaman dhokla'], calories: 160, protein: 4.0, carbs: 28.0, fats: 3.5 },
  { name: 'kachori', aliases: ['kachori', 'kachoris'], calories: 280, protein: 5.5, carbs: 35.0, fats: 13.0 },
  { name: 'namkeen', aliases: ['namkeen', 'mixture', 'chivda'], calories: 450, protein: 8.0, carbs: 50.0, fats: 22.0 },
  { name: 'sev', aliases: ['sev', 'bhujia'], calories: 480, protein: 10.0, carbs: 55.0, fats: 23.0 },
  { name: 'mathri', aliases: ['mathri', 'mathris'], calories: 420, protein: 7.0, carbs: 45.0, fats: 22.0 },
  { name: 'papad', aliases: ['papad', 'papadum'], calories: 371, protein: 25.8, carbs: 59.9, fats: 3.3 },
  { name: 'chakli', aliases: ['chakli', 'murukku'], calories: 450, protein: 8.5, carbs: 52.0, fats: 22.5 },
];

// Common Indian Foods
const indianFoods: FoodItem[] = [
  { name: 'roti', aliases: ['roti', 'chapati', 'phulka'], calories: 297, protein: 7.9, carbs: 46.0, fats: 9.2 },
  { name: 'naan', aliases: ['naan', 'butter naan'], calories: 310, protein: 8.0, carbs: 50.0, fats: 8.5 },
  { name: 'paratha', aliases: ['paratha', 'aloo paratha', 'gobi paratha'], calories: 326, protein: 6.4, carbs: 45.0, fats: 13.0 },
  { name: 'dal', aliases: ['dal', 'lentil', 'toor dal', 'moong dal'], calories: 116, protein: 7.6, carbs: 20.0, fats: 0.4 },
  { name: 'rice', aliases: ['rice', 'basmati rice', 'steamed rice'], calories: 130, protein: 2.7, carbs: 28.0, fats: 0.3 },
  { name: 'biryani', aliases: ['biryani', 'chicken biryani', 'veg biryani'], calories: 220, protein: 8.0, carbs: 35.0, fats: 6.0 },
  { name: 'curry', aliases: ['curry', 'sabzi', 'vegetable curry'], calories: 120, protein: 3.0, carbs: 15.0, fats: 5.0 },
  { name: 'pulao', aliases: ['pulao', 'veg pulao'], calories: 180, protein: 4.0, carbs: 32.0, fats: 4.5 },
  { name: 'idli', aliases: ['idli', 'idlis'], calories: 39, protein: 1.9, carbs: 7.4, fats: 0.2 },
  { name: 'dosa', aliases: ['dosa', 'masala dosa', 'plain dosa'], calories: 133, protein: 3.9, carbs: 22.0, fats: 3.7 },
  { name: 'sambar', aliases: ['sambar', 'sambhar'], calories: 35, protein: 1.5, carbs: 6.0, fats: 0.8 },
  { name: 'rasam', aliases: ['rasam'], calories: 25, protein: 0.8, carbs: 5.0, fats: 0.3 },
  { name: 'poha', aliases: ['poha', 'batata poha'], calories: 150, protein: 3.0, carbs: 30.0, fats: 2.0 },
  { name: 'upma', aliases: ['upma', 'rava upma'], calories: 180, protein: 4.0, carbs: 35.0, fats: 3.5 },
  { name: 'pav bhaji', aliases: ['pav bhaji'], calories: 200, protein: 5.0, carbs: 35.0, fats: 5.5 },
  { name: 'vada pav', aliases: ['vada pav'], calories: 280, protein: 6.0, carbs: 40.0, fats: 10.0 },
  { name: 'rajma', aliases: ['rajma', 'kidney beans'], calories: 127, protein: 8.7, carbs: 22.8, fats: 0.5 },
  { name: 'chole', aliases: ['chole', 'chana masala', 'chickpeas'], calories: 164, protein: 8.9, carbs: 27.4, fats: 2.6 },
  { name: 'paneer', aliases: ['paneer', 'cottage cheese'], calories: 265, protein: 18.3, carbs: 1.2, fats: 20.8 },
  { name: 'butter chicken', aliases: ['butter chicken', 'murgh makhani'], calories: 250, protein: 20.0, carbs: 8.0, fats: 15.0 },
  { name: 'chicken curry', aliases: ['chicken curry'], calories: 200, protein: 18.0, carbs: 5.0, fats: 12.0 },
  { name: 'fish curry', aliases: ['fish curry'], calories: 180, protein: 22.0, carbs: 4.0, fats: 8.0 },
  { name: 'egg curry', aliases: ['egg curry'], calories: 150, protein: 12.0, carbs: 3.0, fats: 10.0 },
  { name: 'raita', aliases: ['raita', 'cucumber raita'], calories: 45, protein: 2.0, carbs: 5.0, fats: 1.5 },
  { name: 'pickle', aliases: ['pickle', 'achaar'], calories: 50, protein: 0.5, carbs: 10.0, fats: 1.0 },
];

// Fruits
const fruits: FoodItem[] = [
  { name: 'apple', aliases: ['apple', 'apples'], calories: 52, protein: 0.3, carbs: 14.0, fats: 0.2 },
  { name: 'banana', aliases: ['banana', 'bananas'], calories: 89, protein: 1.1, carbs: 23.0, fats: 0.3 },
  { name: 'orange', aliases: ['orange', 'oranges'], calories: 47, protein: 0.9, carbs: 12.0, fats: 0.1 },
  { name: 'mango', aliases: ['mango', 'mangoes', 'aam'], calories: 60, protein: 0.8, carbs: 15.0, fats: 0.4 },
  { name: 'grapes', aliases: ['grapes', 'grape'], calories: 69, protein: 0.7, carbs: 18.0, fats: 0.2 },
  { name: 'watermelon', aliases: ['watermelon'], calories: 30, protein: 0.6, carbs: 8.0, fats: 0.2 },
  { name: 'papaya', aliases: ['papaya', 'papita'], calories: 43, protein: 0.5, carbs: 11.0, fats: 0.3 },
  { name: 'guava', aliases: ['guava', 'amrood'], calories: 68, protein: 2.6, carbs: 14.0, fats: 1.0 },
  { name: 'pomegranate', aliases: ['pomegranate', 'anaar'], calories: 83, protein: 1.7, carbs: 19.0, fats: 1.2 },
  { name: 'pineapple', aliases: ['pineapple', 'ananas'], calories: 50, protein: 0.5, carbs: 13.0, fats: 0.1 },
  { name: 'strawberry', aliases: ['strawberry', 'strawberries'], calories: 32, protein: 0.7, carbs: 8.0, fats: 0.3 },
  { name: 'kiwi', aliases: ['kiwi', 'kiwifruit'], calories: 61, protein: 1.1, carbs: 15.0, fats: 0.5 },
  { name: 'pear', aliases: ['pear', 'pears'], calories: 57, protein: 0.4, carbs: 15.0, fats: 0.1 },
  { name: 'peach', aliases: ['peach', 'peaches'], calories: 39, protein: 0.9, carbs: 10.0, fats: 0.3 },
  { name: 'plum', aliases: ['plum', 'plums', 'aloo bukhara'], calories: 46, protein: 0.7, carbs: 11.0, fats: 0.3 },
  { name: 'cherry', aliases: ['cherry', 'cherries'], calories: 50, protein: 1.0, carbs: 12.0, fats: 0.3 },
  { name: 'coconut', aliases: ['coconut', 'nariyal'], calories: 354, protein: 3.3, carbs: 15.0, fats: 33.5 },
  { name: 'dates', aliases: ['dates', 'khajur'], calories: 282, protein: 2.5, carbs: 75.0, fats: 0.4 },
  { name: 'fig', aliases: ['fig', 'figs', 'anjeer'], calories: 74, protein: 0.8, carbs: 19.0, fats: 0.3 },
  { name: 'lychee', aliases: ['lychee', 'litchi'], calories: 66, protein: 0.8, carbs: 17.0, fats: 0.4 },
  { name: 'custard apple', aliases: ['custard apple', 'sitaphal'], calories: 101, protein: 1.7, carbs: 25.0, fats: 0.6 },
  { name: 'jamun', aliases: ['jamun', 'java plum'], calories: 60, protein: 0.7, carbs: 15.0, fats: 0.2 },
  { name: 'chikoo', aliases: ['chikoo', 'sapodilla'], calories: 83, protein: 0.4, carbs: 20.0, fats: 1.1 },
  { name: 'muskmelon', aliases: ['muskmelon', 'cantaloupe', 'kharbuja'], calories: 34, protein: 0.8, carbs: 8.0, fats: 0.2 },
  { name: 'sweet lime', aliases: ['sweet lime', 'mosambi'], calories: 43, protein: 0.7, carbs: 10.0, fats: 0.2 },
  { name: 'pomelo', aliases: ['pomelo', 'chakotra'], calories: 38, protein: 0.8, carbs: 9.6, fats: 0.0 },
];

// Common Basic Foods
const basicFoods: FoodItem[] = [
  { name: 'bread', aliases: ['bread', 'white bread', 'brown bread'], calories: 265, protein: 9.0, carbs: 49.0, fats: 3.2 },
  { name: 'milk', aliases: ['milk', 'full cream milk'], calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3 },
  { name: 'egg', aliases: ['egg', 'eggs', 'boiled egg'], calories: 155, protein: 13.0, carbs: 1.1, fats: 11.0 },
  { name: 'chicken', aliases: ['chicken', 'chicken breast'], calories: 165, protein: 31.0, carbs: 0.0, fats: 3.6 },
  { name: 'fish', aliases: ['fish', 'salmon', 'rohu'], calories: 206, protein: 22.0, carbs: 0.0, fats: 12.0 },
  { name: 'yogurt', aliases: ['yogurt', 'curd', 'dahi'], calories: 59, protein: 10.0, carbs: 3.6, fats: 0.4 },
  { name: 'cheese', aliases: ['cheese', 'cheddar cheese'], calories: 402, protein: 25.0, carbs: 1.3, fats: 33.0 },
  { name: 'butter', aliases: ['butter', 'white butter'], calories: 717, protein: 0.9, carbs: 0.1, fats: 81.0 },
  { name: 'ghee', aliases: ['ghee', 'clarified butter'], calories: 900, protein: 0.0, carbs: 0.0, fats: 100.0 },
  { name: 'oil', aliases: ['oil', 'cooking oil', 'vegetable oil'], calories: 884, protein: 0.0, carbs: 0.0, fats: 100.0 },
  { name: 'sugar', aliases: ['sugar', 'white sugar'], calories: 387, protein: 0.0, carbs: 100.0, fats: 0.0 },
  { name: 'honey', aliases: ['honey', 'shahad'], calories: 304, protein: 0.3, carbs: 82.0, fats: 0.0 },
  { name: 'almonds', aliases: ['almonds', 'badam'], calories: 579, protein: 21.0, carbs: 22.0, fats: 50.0 },
  { name: 'cashews', aliases: ['cashews', 'kaju'], calories: 553, protein: 18.0, carbs: 30.0, fats: 44.0 },
  { name: 'peanuts', aliases: ['peanuts', 'groundnuts', 'moongphali'], calories: 567, protein: 26.0, carbs: 16.0, fats: 49.0 },
  { name: 'walnuts', aliases: ['walnuts', 'akhrot'], calories: 654, protein: 15.0, carbs: 14.0, fats: 65.0 },
  { name: 'potato', aliases: ['potato', 'aloo', 'potatoes'], calories: 77, protein: 2.0, carbs: 17.0, fats: 0.1 },
  { name: 'onion', aliases: ['onion', 'pyaz', 'onions'], calories: 40, protein: 1.1, carbs: 9.3, fats: 0.1 },
  { name: 'tomato', aliases: ['tomato', 'tamatar', 'tomatoes'], calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2 },
  { name: 'cucumber', aliases: ['cucumber', 'kheera', 'cucumbers'], calories: 16, protein: 0.7, carbs: 4.0, fats: 0.1 },
  { name: 'carrot', aliases: ['carrot', 'gajar', 'carrots'], calories: 41, protein: 0.9, carbs: 10.0, fats: 0.2 },
  { name: 'spinach', aliases: ['spinach', 'palak'], calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4 },
  { name: 'cabbage', aliases: ['cabbage', 'patta gobi'], calories: 25, protein: 1.3, carbs: 6.0, fats: 0.1 },
  { name: 'cauliflower', aliases: ['cauliflower', 'gobi', 'phool gobi'], calories: 25, protein: 1.9, carbs: 5.0, fats: 0.3 },
  { name: 'brinjal', aliases: ['brinjal', 'eggplant', 'baingan'], calories: 25, protein: 1.0, carbs: 6.0, fats: 0.2 },
  { name: 'okra', aliases: ['okra', 'bhindi', 'lady finger'], calories: 33, protein: 2.0, carbs: 7.0, fats: 0.2 },
  { name: 'beans', aliases: ['beans', 'green beans', 'french beans'], calories: 31, protein: 1.8, carbs: 7.0, fats: 0.1 },
];

// Combine all food items
const allFoods: FoodItem[] = [
  ...indianSnacks,
  ...indianFoods,
  ...fruits,
  ...basicFoods,
];

/**
 * Search for a food item in the local database
 * Returns nutrition data if found, null otherwise
 */
export function searchLocalFoodDatabase(foodName: string): FoodItem | null {
  const normalizedName = foodName.toLowerCase().trim();
  
  // Direct name match
  let found = allFoods.find(food => 
    food.name.toLowerCase() === normalizedName
  );
  
  // If not found, check aliases
  if (!found) {
    found = allFoods.find(food => 
      food.aliases?.some(alias => alias.toLowerCase() === normalizedName)
    );
  }
  
  // If still not found, try partial matching
  if (!found) {
    found = allFoods.find(food => 
      food.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(food.name.toLowerCase()) ||
      food.aliases?.some(alias => 
        alias.toLowerCase().includes(normalizedName) ||
        normalizedName.includes(alias.toLowerCase())
      )
    );
  }
  
  return found || null;
}

/**
 * Get all food items (for suggestions/autocomplete)
 */
export function getAllFoodNames(): string[] {
  const names = new Set<string>();
  
  allFoods.forEach(food => {
    names.add(food.name);
    food.aliases?.forEach(alias => names.add(alias));
  });
  
  return Array.from(names).sort();
}

