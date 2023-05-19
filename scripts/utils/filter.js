import { displayRecipeCards } from "../pages/index.js";

// Récupère la requête de l'utilisateur à partir du DOM
function getQueryFromDOM() {
  const text = document.querySelector("#search").value.toLowerCase();
  const tags = Array.from(document.querySelectorAll(".tag")).map(tag => tag.textContent.toLowerCase());

  return { text, tags};
}

// Fonction pour mettre à jour le DOM en fonction des recettes filtrées
function updateDOM(recipes) {
  // Récupère la requête à partir du DOM
  const query = getQueryFromDOM();
  const filteredProcessedRecipes = filterRecipes(window.processedRecipes, query);

  const filteredIds = filteredProcessedRecipes.map(recipe => recipe.id);

  const filteredRecipes = recipes.filter(recipe => filteredIds.includes(recipe.id));
  const container = document.querySelector(".recipes-container");
  container.innerHTML = " "; 

  // Si aucune recette n'est trouvée, affiche un message
  if(filteredRecipes.length === 0) { 
    displayMessageNoRecipes();
  } else {
    // sinon affiche les recettes filtrées
    displayRecipeCards(filteredRecipes);
  }
}

// Filtre les recettes en fonction d'une requête et de tags
export function filterRecipes(recipes, query = { text: "", tags: [] }) {
  const queryText = query.text;

  function matchesQuery(ingredient, query) {
    return ingredient ? ingredient.includes(query) : false;
  }

  const filtered = recipes.filter(recipe => {
    const inTitle = recipe.name.includes(queryText);
    const inDescription = recipe.description.includes(queryText);
    const inIngredients = recipe.ingredients.some(ingredient => matchesQuery(ingredient, queryText));

    const tagsMatch = query.tags.every(tag =>
      recipe.ingredients.some(ingredient => matchesQuery(ingredient, tag)) ||
      recipe.appliance.includes(tag) ||
      recipe.utensils.some(utensil => utensil.includes(tag))
    );

    return (inTitle || inDescription || inIngredients) && tagsMatch;
  });

  console.log("Filtered recipes:", filtered);
  return filtered;
}

// Filtre les éléments (ingrédients, appareils, ustensiles) en fonction d'une requête
export function filterElements (elements, query) {
  return elements.filter(element => element.toLowerCase().includes(query.toLowerCase()));
}

// Ajoute un tag à la liste des tags sélectionnés
export function addTag(tagText, elementType, recipes) {
  const lowerCaseTagText = tagText.toLowerCase();

  const tag = document.createElement("div");
  tag.textContent = lowerCaseTagText;
  tag.classList.add("tag", elementType);

  const cross = document.createElement("button");
  cross.classList.add("fa-regular", "fa-circle-xmark", elementType, "tag-delete");

  cross.addEventListener("click", function() {
    tag.remove();
    updateDOM(recipes);
  });

  tag.appendChild(cross);

  const tagsContainer = document.querySelector(".tags-container");
  tagsContainer.appendChild(tag);

  updateDOM(recipes);
}

// Affiche le message <p>
export function displayMessageNoRecipes() {
  const main = document.querySelector("main");

  const p = document.createElement("p");
  p.classList.add("no-recipe");
  p.textContent = "Aucune recette ne correspond à votre recherche.";
  
  main.appendChild(p);
}