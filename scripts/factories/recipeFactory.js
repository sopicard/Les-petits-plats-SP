export function recipeFactory(recipe) {
  // Création des éléments HTML
  const card = document.createElement("article");
  card.classList.add("recipe-card");

  const imgDiv = document.createElement("div");
  imgDiv.classList.add("recipe-img");

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("recipe-content");

  const presentationDiv = document.createElement("div");
  presentationDiv.classList.add("recipe-presentation");

  const title = document.createElement("h2");
  title.classList.add("recipe-title");
  title.textContent = recipe.name;

  const timeContent = document.createElement("div");
  timeContent.classList.add("recipe-time-content");

  const timeIcon = document.createElement("span");
  timeIcon.classList.add("fa-regular", "fa-clock");

  const time = document.createElement("p");
  time.classList.add("recipe-time");
  time.textContent = `${recipe.time} min`;

  const ingredientsContentDiv = document.createElement("div");
  ingredientsContentDiv.classList.add("recipe-ingredients-content");

  const ingredientsDiv = document.createElement("div");
  ingredientsDiv.classList.add("recipe-ingredients");

  const ingredientsList = document.createElement("ul");
  ingredientsList.classList.add("recipe-list");

  // Parcours de chaque ingrédient de la recette
  recipe.ingredients.forEach(ingredient => {
    const listItem = document.createElement("li");
    // Après le nom de l'ingrédient, on ajoute la quantité et l'unité si elles existent,
    // sinon on ajoute une chaîne vide
    listItem.innerHTML = `<strong>${ingredient.ingredient}</strong>: ${
      ingredient.quantity ? ingredient.quantity : ''
    }${ingredient.unit ? ' ' + ingredient.unit : ''}`;
    ingredientsList.appendChild(listItem);
  });

  const descriptionDiv = document.createElement("div");
  descriptionDiv.classList.add("recipe-description");

  const description = document.createElement("p");
  description.textContent = recipe.description;

  // Assemblage des éléments
  timeContent.appendChild(timeIcon);
  timeContent.appendChild(time);

  presentationDiv.appendChild(title);
  presentationDiv.appendChild(timeContent);
  
  ingredientsDiv.appendChild(ingredientsList);

  descriptionDiv.appendChild(description);

  ingredientsContentDiv.appendChild(ingredientsDiv);
  ingredientsContentDiv.appendChild(descriptionDiv);

  contentDiv.appendChild(presentationDiv);
  contentDiv.appendChild(ingredientsContentDiv);

  card.appendChild(imgDiv);
  card.appendChild(contentDiv);

  return card;
}
