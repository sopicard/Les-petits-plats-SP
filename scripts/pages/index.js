import { recipeFactory } from "../factories/recipeFactory.js";
import { displayPopup, updateElementsPopup, updatePopupLists } from "../utils/popup.js";
import { filterRecipes, getQueryFromDOM, displayMessageNoRecipes } from "../utils/filter.js";
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
	// Supprime le message "Aucune recette ne correspond" s'il existe
	const previousMessage = document.querySelector(".no-recipes-message");
	if (previousMessage) previousMessage.remove();

	const container = document.querySelector(".recipes-container");
	// Efface le conteneur avant d'ajouter de nouvelles cartes de recettes
	container.innerHTML = "";

	if(recipes.length === 0) {
		// Affiche le message s'il n'y a pas de recette
		displayMessageNoRecipes();
		console.log("Aucune recette ne correspond");
	} else {
		recipes.forEach(recipe => {
			const card = recipe.getRecipeCardDOM();
			container.appendChild(card);
		});
	}
}


// Filtrage et affichage des recettes
function filterAndDisplayRecipes(query) {
    const filteredRecipes = filterRecipes(window.processedRecipes, query);

	// Met à jour les listes de popup après le filtrage
	updateElementsPopup(filteredRecipes);
	updatePopupLists();

    if (query.text.length < 3 && query.tags.length === 0) {
		// Si la requête est vide, affiche toutes les recettes
		displayRecipeCards(window.processedRecipes);
	} else {
		// Si des recettes correspondent à la requête, les affiche
		displayRecipeCards(filteredRecipes);

		console.log("recettes:", filteredRecipes);
    }
}


async function init() {
    // Récupère et prépare les recettes
    const { processedRecipes, uniqueIngredients, uniqueAppliance, uniqueUtensils } = await preprocessRecipes();

	window.processedRecipes = processedRecipes;

    // Affiche les recettes
    displayRecipeCards(window.processedRecipes);

    // Stocke les ensembles d'éléments uniques dans l'objet global
    window.uniqueRecipeElements = {
        ingredients: uniqueIngredients,
        appliance: uniqueAppliance,
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
	  // Récupère la requête de l'utilisateur à partir du DOM
	  const query = getQueryFromDOM();

	  console.log(query);
	
	  // Filtre les recettes en fonction de la requête et des tags
	  filterAndDisplayRecipes(query);
	});  
}  

// Démarre l'application en appelant la fonction init
init();