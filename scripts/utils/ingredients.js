
// Récupère les ingrédients uniques à partir des recettes. Prend un tableau de recettes et retourne un tableau d'ingrédients uniques.
function getIngredients(recipes) {
    // objet Set = collection déléments uniques
    const ingredients = new Set();

    // pour chaque recette = un tableau d'objets représentants les ingrédients. On parcoure tous les ingrédients de chaque recette. Ajoutés au Set qui sera converti en tableau avec Array.from
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
        ingredients.add(ingredient.ingredient);
        });
    });

    return Array.from(ingredients);  
  }

function createIngredientsPopup(ingredients) {
    const popup = document.createElement("div");
    popup.classList.add("popup-ingredients");

    const searchBarContent = document.createElement("div");
    searchBarContent.classList.add("search-bar-content");
    popup.appendChild(searchBarContent);

    const searchBar = document.createElement("input");
    searchBar.type = "text";
    searchBar.placeholder = "Rechercher un ingrédient";
    searchBar.classList.add("popup-search-bar")
    searchBarContent.appendChild(searchBar);

    const popupArrowUp = document.createElement("span");
    popupArrowUp.classList.add("fa-solid", "fa-chevron-up");
    popupArrowUp.addEventListener("click", () => {
        popup.remove();
    });    
    searchBarContent.appendChild(popupArrowUp);


    const popupIngredientsList = document.createElement("ul");
    popupIngredientsList.classList.add("popup-ingredients-list");
    popup.appendChild(popupIngredientsList);

    ingredients.forEach(ingredient => {
        const popupListItem = document.createElement("li");
        popupListItem.textContent = ingredient;
        popupListItem.classList.add("popup-ingredient-item");
        popupIngredientsList.appendChild(popupListItem);
    });

    return popup
  }

export function displayIngredientsPopup(recipes) {
    const uniqueIngredients = getIngredients(recipes);
    const popup = createIngredientsPopup(uniqueIngredients);
    const ingredientsPopupContainer = document.querySelector(".blue.popup-container");
    ingredientsPopupContainer.appendChild(popup);  
}

