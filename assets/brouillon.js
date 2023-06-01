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
		console.log("Aucune recette ne correspond depuis index");
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

    if (query.text.length < 3 && query.tags.length === 0) {
		// Si la requête est vide, affiche toutes les recettes
		displayRecipeCards(window.processedRecipes);
	} else {
		// Si des recettes correspondent à la requête, les affiche
		displayRecipeCards(filteredRecipes);

		// Met à jour les listes de popup après le filtrage
		updateElementsPopup(filteredRecipes);
		updatePopupLists();

		console.log("recettes depuis index:", filteredRecipes);
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

	  console.log("query depuis index:", query);
	
	  // Filtre les recettes en fonction de la requête et des tags
	  filterAndDisplayRecipes(query);
	});  
}  

// Démarre l'application en appelant la fonction init
init();













import { displayRecipeCards } from "../pages/index.js";
import { updateElementsPopup, updatePopupLists } from "./popup.js";

// Récupère la requête de l'utilisateur à partir du DOM
export function getQueryFromDOM() {
  const text = document.querySelector("#search").value.toLowerCase();
  const tags = Array.from(document.querySelectorAll(".tag")).map(tag => tag.textContent.toLowerCase());

  return { text, tags};
}

// Fonction pour mettre à jour le DOM en fonction des recettes filtrées
function updateDOM(recipes) {
  // Récupère la requête à partir du DOM
  const query = getQueryFromDOM();

  console.log("updateDOM query:", query);

  const filteredProcessedRecipes = filterRecipes(window.processedRecipes, query);
  console.log("updateDOM filteredProcessedRecipes:", filteredProcessedRecipes);

  const filteredIds = filteredProcessedRecipes.map(recipe => recipe.id);
  const filteredRecipes = recipes.filter(recipe => filteredIds.includes(recipe.id));

  if (filteredRecipes.length === 0) {
    displayMessageNoRecipes();
  } else {
    displayRecipeCards(filteredRecipes); 
  }
}

// Filtre les recettes en fonction d'une requête et de tags
export function filterRecipes(recipes, query = { text: "", tags: [] }) {
  // Divise requête en mots individuels
  const queryTextWords = query.text.toLowerCase().split(" ");

  function matchesQuery(itemWords, queryWords) {
    // Vérifie si chaque mot de la requête (queryWords) est présent dans itemsWords (tableau de mots de titre, description et ingrédients)
    return queryWords.every(queryWord => itemWords.some(itemWord => itemWord.includes(queryWord)));
  }

  const filtered = recipes.filter(recipe => {
    // Divise la recette en mots et vérifie si mots de la requête sont présents (true/false)
    const recipeNameWords = recipe.name.toLowerCase().split(" ");
    const inTitle = matchesQuery(recipeNameWords, queryTextWords);

    const descriptionWords = recipe.description.toLowerCase().split(" ");
    const inDescription = matchesQuery(descriptionWords, queryTextWords);

    const ingredientWords = recipe.ingredients.map(ingredient => ingredient.toLowerCase().split(" "));
    const inIngredients = ingredientWords.some(ingredient => matchesQuery(ingredient, queryTextWords));

    const tagsMatch = query.tags.every(tag =>
      recipe.ingredients.some(ingredient => matchesQuery(ingredient.toLowerCase().split(" "), [tag])) ||
      matchesQuery(recipe.appliance.toLowerCase().split(" "), [tag]) ||
      recipe.utensils.some(utensil => matchesQuery(utensil.toLowerCase().split(" "), [tag]))
    );

    return (inTitle || inDescription || inIngredients) && tagsMatch;
  });
 
  return filtered;
}


// Filtre les éléments (ingrédients, appareils, ustensiles) en fonction d'une requête
export function filterElements (elements, query) {
  return elements.filter(element => element.toLowerCase().includes(query.toLowerCase()));
}

// Ajoute un tag à la liste des tags sélectionnés
export function addTag(tagText, elementType, processedRecipes) {
  const lowerCaseTagText = tagText.toLowerCase();

  const tag = document.createElement("div");
  tag.textContent = lowerCaseTagText;
  tag.classList.add("tag", elementType);

  const cross = document.createElement("button");
  cross.classList.add("fa-regular", "fa-circle-xmark", elementType, "tag-delete");

  cross.addEventListener("click", function() {
    tag.remove();

    const query = getQueryFromDOM();
    const filteredRecipes = filterRecipes(processedRecipes, query);

    updateElementsPopup(filteredRecipes);
    updatePopupLists();
    updateDOM(filteredRecipes);
  });

  tag.appendChild(cross);

  const tagsContainer = document.querySelector(".tags-container");
  tagsContainer.appendChild(tag);

  const query = getQueryFromDOM();
  const filteredRecipes = filterRecipes(processedRecipes, query);

  updateElementsPopup(filteredRecipes);
  updatePopupLists();
  updateDOM(filteredRecipes);
}

  // Affiche le message <p>
  export function displayMessageNoRecipes() {
    const recipesSection = document.querySelector(".recipes-section");

    // Supprime tout message précédent
    const previousMessage = document.querySelector(".no-recipes-message");
    if (previousMessage) previousMessage.remove();
  
    const message = document.createElement("p");
    message.classList.add("no-recipes-message");
    message.textContent = "Aucune recette ne correspond à votre recherche";
    
    recipesSection.appendChild(message);
  }