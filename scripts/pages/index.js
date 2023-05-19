import { recipeFactory } from "../factories/recipeFactory.js";
import { displayPopup } from "../utils/popup.js";
import { filterRecipes } from "../utils/filter.js";
import { preprocessRecipes } from "../utils/preprocess.js";

// Récupère les données des recettes à partir du fichier JSON
export async function getRecipes() {
	const response = await fetch("../../data/recipes.json");
	const data = await response.json();
	const recipes = data.recipes.map(recipeData => recipeFactory(recipeData));
	return recipes;
}

// Affiche la carte de chaque recette
export function displayRecipeCards(recipes) {
	const container = document.querySelector(".recipes-container");

	container.innerHTML = " ";

	recipes.forEach(recipe => {
		const card = recipe.getRecipeCardDOM();
		container.appendChild(card);
	});
}

// Filtrage et affichage des recettes
function filterAndDisplayRecipes(query) {
	if (query.text.length < 3 && query.tags.length === 0) {
	  // Si la requête est vide, affiche toutes les recettes
	  displayRecipeCards(window.processedRecipes);
	} else {
	  const filteredRecipes = filterRecipes(window.processedRecipes, query);
	  displayRecipeCards(filteredRecipes);
	}
  }

async function init() {
    // Récupère et prépare les recettes
    const { processedRecipes, uniqueIngredients, uniqueAppliances, uniqueUtensils } = await preprocessRecipes();

	window.processedRecipes = processedRecipes;

    // Affiche les recettes
    displayRecipeCards(window.processedRecipes);

    // Stocke les ensembles d'éléments uniques dans l'objet global
    window.uniqueRecipeElements = {
        ingredients: uniqueIngredients,
        appliance: uniqueAppliances,
        utensils: uniqueUtensils,
    };

	const buttonTypes = ["ingredients", "appliance", "utensils"];

	buttonTypes.forEach((buttonType) => {
		// Dans tableau de boutons, récupère le bouton correspondant au type actuel
		const button = document.querySelector(`.${buttonType}-button`);
		button.addEventListener("click", () => {
			displayPopup(window.uniqueRecipeElements[buttonType], buttonType, window.processedRecipes);
		});
	});	

	document.querySelector(".search-form").addEventListener("submit", function(event) {
		event.preventDefault();
	});

	// Gestionnaire d'événements pour la barre de recherche
	document.querySelector("#search").addEventListener("input", function() {
	// Récupère la valeur de la barre de recherche
	const queryText = this.value;
	
	// Récupère tous les tags actuellement sélectionnés
	let tags = Array.from(document.querySelectorAll(".tag")).map(tag => tag.textContent);

	// Filtre les recettes en fonction de la requête et des tags
	const query = { text: queryText, tags };
	filterAndDisplayRecipes(query);
	});  
}  

// Démarre l'application en appelant la fonction init
init();
