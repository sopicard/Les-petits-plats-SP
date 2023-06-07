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

// La fonction prend en entrée un tableau de recettes et une requête de recherche, et renvoie un tableau de recettes filtrées qui correspondent à la requête.
export function filterRecipes(recipes, query = { text: "", tags: [] }) {
  
  // Convertit le texte de la requête en minuscules et le divise en mots individuels.
  const queryTextWords = query.text.toLowerCase().split(" ");

  // Vérifie si tous les mots de la requête sont présents dans les mots de l'élément donné.
  function matchesQuery(item, queryWords) {
    // Convertit l'élément en minuscules pour une comparaison correcte.
    const lowerCaseItem = item.toLowerCase();
  
    // Parcourt tous les mots de la requête.
    for (let i = 0; i < queryWords.length; i++) {
      // Si l'élément ne contient pas le mot de la requête actuelle, retourne false.
      if (!lowerCaseItem.includes(queryWords[i])) {
        return false;
      }
    }
  
    // Si tous les mots de la requête sont présents dans l'élément, retourne true.
    return true;
  }

  // Création d'un tableau vide qui contiendra les recettes filtrées.
  let filtered = [];

  // Boucle à travers toutes les recettes.
  for(let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    
    // Vérifie si le titre ou la description de la recette contient tous les mots de la requête.
    const inTitle = matchesQuery(recipe.name, queryTextWords);
    const inDescription = matchesQuery(recipe.description, queryTextWords);
    
    // Vérifie si l'un des ingrédients de la recette contient tous les mots de la requête.
    let inIngredients = false;
    for(let j = 0; j < recipe.ingredients.length; j++) {
      if(matchesQuery(recipe.ingredients[j], queryTextWords)) {
        inIngredients = true;
        break;
      }
    }
    
    // Vérifie si les tags sélectionnés correspondent aux ingrédients, à l'appareil ou aux ustensils de la recette.
    const tagsMatch = query.tags.every(tag =>
      recipe.ingredients.some(ingredient => matchesQuery(ingredient, [tag])) ||
      recipe.appliance.includes(tag) ||
      recipe.utensils.some(utensil => utensil.includes(tag))
    );

    // Si le titre, la description ou un ingrédient de la recette contient tous les mots de la requête, et que tous les tags correspondent, alors la recette est ajoutée au tableau filtré.
    if ((inTitle || inDescription || inIngredients) && tagsMatch) {
      filtered.push(recipe);
    }
  }

  // Retourne le tableau de recettes filtrées.
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
    message.textContent = "Aucune recette ne correspond à votre critère ... vous pouvez chercher \" tarte aux pommes \" , \" poisson \", etc.";
    
    recipesSection.appendChild(message);
  }