import { getRecipes } from "../pages/index.js";

// Fonction pour prétraiter les recettes
export async function preprocessRecipes() {
    // Récupère les recettes
    const recipes = await getRecipes();

    console.log("Preprocessing recipes...");

    // Crée des Sets pour stocker des éléments uniques
    const uniqueIngredients = new Set();
    const uniqueAppliances = new Set();
    const uniqueUtensils = new Set();

    // Pour chaque recette, met à jour les recettes et remplit les Sets
    recipes.forEach(recipe => {
        // Traite les ingrédients
        recipe.ingredients = recipe.ingredients.map(ingredientObj => {
            // Convertit l'ingrédient en minuscules
            const lowerCaseIngredient = ingredientObj.ingredient.toLowerCase();
            // Ajoute l'ingrédient aux ingrédients uniques
            uniqueIngredients.add(lowerCaseIngredient);  
            return lowerCaseIngredient;
        });

        // Traite les appareils et ajoute l'appareil aux appareils uniques
        const lowerCaseAppliance = recipe.appliance.toLowerCase();
        uniqueAppliances.add(lowerCaseAppliance);  
        recipe.appliance = lowerCaseAppliance;

        // Traite les ustensiles
        recipe.utensils = recipe.utensils.map(utensil => {
            const lowerCaseUtensil = utensil.toLowerCase();
            uniqueUtensils.add(lowerCaseUtensil);  
            return lowerCaseUtensil;
        });
    });

    console.log("Finished preprocessing recipes.");

    console.log("Processed recipes:", recipes);
    console.log("Unique ingredients:", Array.from(uniqueIngredients));
    console.log("Unique appliances:", Array.from(uniqueAppliances));
    console.log("Unique utensils:", Array.from(uniqueUtensils));

    return {
        processedRecipes: recipes,
        uniqueIngredients: Array.from(uniqueIngredients),
        uniqueAppliances: Array.from(uniqueAppliances),
        uniqueUtensils: Array.from(uniqueUtensils),
    };
}
