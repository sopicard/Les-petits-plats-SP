  // Si aucune recette n'est trouvée, affiche un message
  if(filteredRecipes.length === 0) { 
    displayMessageNoRecipes();
  } else {
    // sinon affiche les recettes filtrées
    displayRecipeCards(filteredRecipes);
  }


  // Affiche le message <p>
export function displayMessageNoRecipes() {
  const container = document.querySelector(".recipes-container");

  const p = document.createElement("p");
  p.classList.add("no-recipe");
  p.textContent = "Aucune recette ne correspond à votre recherche.";
  
  container.appendChild(p);

  console.log("Aucune recette ne correspond");
}