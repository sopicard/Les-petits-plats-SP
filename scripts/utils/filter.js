import { displayRecipeCards } from "../pages/index.js";

function updateDOM(recipes) {
  const query = document.querySelector("#search").value;
  const tags = Array.from(document.querySelectorAll('.tag')).map(tag => tag.textContent);
  const filteredRecipes = filterRecipes(recipes, query, tags);
  const container = document.querySelector(".recipes-container");
  container.innerHTML = '';  // Empty the container
  if(filteredRecipes.length === 0) {
    // Display a message indicating that no recipes match
    displayMessageNoRecipes();
  } else {
    displayRecipeCards(filteredRecipes);  // Display the new recipes
  }
}


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

export function filterElements (elements, query) {
  return elements.filter(element => element.toLowerCase().includes(query.toLowerCase()));
}

export function addTag(tagText, elementType, recipes) {
  const tag = document.createElement("div");
  tag.textContent = tagText;
  tag.classList.add("tag", elementType);

  const cross = document.createElement("button");
  cross.classList.add("fa-regular", "fa-circle-xmark", elementType, "tag-delete");

  cross.addEventListener("click", function() {
    tag.remove();
    // Update the DOM based on both the search query and the remaining tags
    updateDOM(recipes);
  });

  tag.appendChild(cross);

  const tagsContainer = document.querySelector(".tags-container");
  tagsContainer.appendChild(tag);

  // Update the DOM based on both the search query and the currently selected tags
  updateDOM(recipes);
}

export function displayMessageNoRecipes() {
  const container = document.querySelector(".recipes-container");
  container.innerHTML = "<p>Aucune recette ne correspond à votre recherche.</p>";
}