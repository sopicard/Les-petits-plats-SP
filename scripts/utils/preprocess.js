import { getRecipes } from "../pages/index.js";

// Fonction pour prétraiter les tableaux ingrédients, appareil et ustensiles
export async function preprocessRecipes() {
    // Récupère les recettes
    const recipes = await getRecipes();

    // Crée des Sets pour stocker des éléments uniques
    const uniqueIngredients = new Set();
    const uniqueAppliance = new Set();
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
        uniqueAppliance.add(lowerCaseAppliance);  
        recipe.appliance = lowerCaseAppliance;

        // Traite les ustensiles
        recipe.utensils = recipe.utensils.map(utensil => {
            const lowerCaseUtensil = utensil.toLowerCase();
            uniqueUtensils.add(lowerCaseUtensil);  
            return lowerCaseUtensil;
        });
    });

    return {
        processedRecipes: recipes,
        uniqueIngredients: Array.from(uniqueIngredients),
        uniqueAppliance: Array.from(uniqueAppliance),
        uniqueUtensils: Array.from(uniqueUtensils),
    };
}
