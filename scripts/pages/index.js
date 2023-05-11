import { recipeFactory } from "../factories/recipeFactory.js";
import { displayPopup } from "../utils/popup.js";
import { filterRecipes } from "../utils/filter.js"
import { displayMessageNoRecipes } from "../utils/filter.js";

// Récupère les données des recettes à partir du fichier JSON
async function getRecipes() {
	const response = await fetch("../../data/recipes.json");
	const data = await response.json();
	const recipes = data.recipes;

	return recipes;
}

// Affiche la carte de chaque recette
export function displayRecipeCards(recipes) {
	const container = document.querySelector(".recipes-container");

	recipes.forEach(recipe => {
		const card = recipeFactory(recipe);
		container.appendChild(card);
	});
}

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

	// Gestionnaire d'événements pour la barre de recherche
	document.querySelector("#search").addEventListener("input", function() {
		const query = this.value;
		const container = document.querySelector(".recipes-container");
		
		// Récupère tous les tags actuellement sélectionnés
		let tags = Array.from(document.querySelectorAll('.tag')).map(tag => tag.textContent);

		let filteredRecipes = [];

		if (query.length === 0) {
			// Si la barre de recherche est vide, affichez toutes les recettes
			displayRecipeCards(recipes);
		} else if(query.length < 3) {
			// Si la requête a moins de 3 caractères, ne fait rien
			return;
		} else { 
			filteredRecipes = filterRecipes(recipes, query, tags);
			container.innerHTML = '';  // Vide le conteneur
			if(filteredRecipes.length === 0) {
				// Affiche un message indiquant qu'aucune recette ne correspond
				displayMessageNoRecipes();
			} else {
				displayRecipeCards(filteredRecipes);  // Affiche les nouvelles recettes
			}
		}
	});  
}  

// Démarre l'application en appelant la fonction init
init();
