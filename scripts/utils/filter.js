import { displayRecipeCards } from "../pages/index.js";

// Fonction pour mettre à jour le DOM en fonction de la requête de recherche et des tags sélectionnés
function updateDOM(recipes) {
  // Récupère valeur barre recherche + tags actuellement sélectionnés
  const query = document.querySelector("#search").value;
  const tags = Array.from(document.querySelectorAll('.tag')).map(tag => tag.textContent);
  // Filtrer les recettes en fonction de la requête et des tags
  const filteredRecipes = filterRecipes(recipes, query, tags);
  const container = document.querySelector(".recipes-container");
  container.innerHTML = ''; 

  // Si aucune recette n'est trouvée, affiche un message
  if(filteredRecipes.length === 0) { 
    displayMessageNoRecipes();
  } else {
    // sinon affiche les recettes filtrées
    displayRecipeCards(filteredRecipes);
  }
}

// Filtre les recettes en fonction d'une requête et de tags
export function filterRecipes(recipes, query = '', tags = []) {
  return recipes.filter(recipe => {
    const lowerCaseQuery = query.toLowerCase();
    const inTitle = recipe.name.toLowerCase().includes(lowerCaseQuery);
    const inDescription = recipe.description.toLowerCase().includes(lowerCaseQuery);
    const inIngredients = recipe.ingredients.some(ingredient =>
      ingredient.ingredient.toLowerCase().includes(lowerCaseQuery)
    );

    const tagsMatch = tags.every(tag =>
      recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()).includes(tag.toLowerCase()) ||
      recipe.appliance.toLowerCase().includes(tag.toLowerCase()) ||
      recipe.utensils.map(utensil => utensil.toLowerCase()).includes(tag.toLowerCase())
    );

    return (inTitle || inDescription || inIngredients) && tagsMatch;
  });
}

// Filtre les éléments (ingrédients, appareils, ustensiles) en fonction d'une requête
export function filterElements (elements, query) {
  return elements.filter(element => element.toLowerCase().includes(query.toLowerCase()));
}

// Ajoute un tag à la liste des tags sélectionnés
export function addTag(tagText, elementType, recipes) {
  const tag = document.createElement("div");
  tag.textContent = tagText;
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
  const container = document.querySelector(".recipes-container");
  container.innerHTML = "<p>Aucune recette ne correspond à votre recherche.</p>";
}