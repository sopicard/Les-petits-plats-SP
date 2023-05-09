import { recipeFactory } from "../factories/recipeFactory.js";
import { displayPopup } from "../utils/popup.js";

// Récupère les données des recettes à partir du fichier JSON
async function getRecipes() {
  const response = await fetch("../../data/recipes.json");
  const data = await response.json();
  const recipes = data.recipes;

  return recipes;
}

// Affiche la carte de chaque recette
function displayRecipeCards(recipes) {
  const container = document.querySelector(".recipes-container");

  recipes.forEach(recipe => {
    const card = recipeFactory(recipe);
    container.appendChild(card);
  });
}

// Initialise l'application en affichant les cartes des recettes
async function init() {

  const recipes = await getRecipes();
  displayRecipeCards(recipes);

  const ingredientsButton = document.querySelector(".ingredients-button");
  ingredientsButton.addEventListener("click", () => {
    displayPopup(recipes, "ingredients");
  });

  const applianceButton = document.querySelector(".appliance-button");
  applianceButton.addEventListener("click", () => {
      displayPopup(recipes, "appliance");
  });

  const utensilsButton = document.querySelector(".utensils-button");
  utensilsButton.addEventListener("click", () => {
      displayPopup(recipes, "utensils");
  }); 
  
}
  

// Démarre l'application en appelant la fonction init
init();
