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
    displayMessageNoRecipes
  } else {
    displayRecipeCards(filteredRecipes); 
  }
}

// Filtre les recettes en fonction d'une requête et de tags
export function filterRecipes(recipes, query = { text: "", tags: [] }) {
  // Divise la requête en mots et les stocke dans queryTextWords
  const queryTextWords = query.text.toLowerCase().split(" ");

  // Vérifie si tous les mots de la requête sont présents dans les mots de l'élément donné
  function matchesQuery(item, queryWords) {
    return queryWords.every(queryWord => item.toLowerCase().includes(queryWord));
  }

  const filtered = recipes.filter(recipe => {
    const inTitle = matchesQuery(recipe.name, queryTextWords);
    const inDescription = matchesQuery(recipe.description, queryTextWords);
    const inIngredients = recipe.ingredients.some(ingredient =>
      matchesQuery(ingredient, queryTextWords)
    );

    const tagsMatch = query.tags.every(tag =>
      recipe.ingredients.some(ingredient => matchesQuery(ingredient, [tag])) ||
      recipe.appliance.includes(tag) ||
      recipe.utensils.some(utensil => utensil.includes(tag))
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
    message.textContent = "Aucune recette ne correspond à votre recherche ... vous pouvez chercher \" tartes aux pommes \" , \" poisson \", etc.";
    
    recipesSection.appendChild(message);
  }