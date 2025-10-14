// frontend/src/utils/nutrition.js

const TDEE_ACTIVITY_FACTOR = 1.55; // Moderately Active (Default assumption)

// Macro distribution percentages for general fitness/maintenance
const MACRO_RATIOS = {
    PROTEIN_PERCENT: 0.30, // 30%
    FAT_PERCENT: 0.30,     // 30%
    CARBS_PERCENT: 0.40,   // 40% (Total: 100%)
};

const CALORIES_PER_GRAM = {
    PROTEIN: 4,
    CARBS: 4,
    FAT: 9,
};

// Helper to calculate age from date of birth string
function getAge(dateString) {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Converts height from feet/inches to total centimeters (required by Mifflin-St Jeor)
function heightToCm(ft, inch) {
    const totalInches = (Number(ft) || 0) * 12 + (Number(inch) || 0);
    return totalInches * 2.54; // 1 inch = 2.54 cm
}

export function calculateNutritionGoals(user) {
    // Check for essential data
    if (!user || !user.weightKg || !user.dateOfBirth || !user.gender || !user.heightFt) {
        return { 
            tdee: 0, 
            protein: 0, 
            carbs: 0, 
            fat: 0, 
            message: "Missing height, weight, age, or gender data in profile for calculation." 
        };
    }

    const age = getAge(user.dateOfBirth);
    const weight = user.weightKg;
    const heightCm = heightToCm(user.heightFt, user.heightIn);
    const gender = user.gender;

    // 1. Calculate BMR (Mifflin-St Jeor)
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) + 5;
    } else { // female or other (using female as default since it's more conservative)
        bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) - 161;
    }

    // 2. Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = Math.round(bmr * TDEE_ACTIVITY_FACTOR);

    // 3. Calculate Macros (Grams)
    const proteinCal = tdee * MACRO_RATIOS.PROTEIN_PERCENT;
    const fatCal = tdee * MACRO_RATIOS.FAT_PERCENT;
    const carbsCal = tdee * MACRO_RATIOS.CARBS_PERCENT;

    const proteinGrams = Math.round(proteinCal / CALORIES_PER_GRAM.PROTEIN);
    const fatGrams = Math.round(fatCal / CALORIES_PER_GRAM.FAT);
    const carbsGrams = Math.round(carbsCal / CALORIES_PER_GRAM.CARBS);
    
    return {
        tdee, // Max Calories
        protein: proteinGrams,
        carbs: carbsGrams,
        fat: fatGrams,
        message: "Goals calculated based on Mifflin-St Jeor formula and Moderate Activity factor (1.55)."
    };
}