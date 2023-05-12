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
	// Récupère et affiche les recettes
	const recipes = await getRecipes();
	displayRecipeCards(recipes);

	const buttonTypes = ["ingredients", "appliance", "utensils"];

	buttonTypes.forEach((buttonType) => {
		// Dans tableau de boutons, récupère le bouton correspondant au type actuel
		const button = document.querySelector(`.${buttonType}-button`);
		button.addEventListener("click", () => {
		displayPopup(recipes, buttonType);
		});
	});	

	// Gestionnaire d'événements pour la barre de recherche
	document.querySelector("#search").addEventListener("input", function() {
		// Récupère la valeur de la barre de recherche
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
			// Filtre les recettes en fonction de la requête et des tags
			filteredRecipes = filterRecipes(recipes, query, tags);
			  // Vide le conteneur
			container.innerHTML = '';
			if(filteredRecipes.length === 0) {
				// Affiche un message indiquant qu'aucune recette ne correspond
				displayMessageNoRecipes();
			} else {
				// Affiche les nouvelles recettes
				displayRecipeCards(filteredRecipes);
			}
		}
	});  
}  

// Démarre l'application en appelant la fonction init
init();
