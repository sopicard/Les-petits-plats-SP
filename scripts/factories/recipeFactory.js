export function recipeFactory(data) {
  const { id, name, time, ingredients, description, appliance, utensils } = data;

  // Création des éléments HTML
  function getRecipeCardDOM() {
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
    title.textContent = name;

    const timeContent = document.createElement("div");
    timeContent.classList.add("recipe-time-content");

    const timeIcon = document.createElement("span");
    timeIcon.classList.add("fa-regular", "fa-clock");

    const timeElement = document.createElement("p");
    timeElement.classList.add("recipe-time");
    timeElement.textContent = `${time} min`;

    const ingredientsContentDiv = document.createElement("div");
    ingredientsContentDiv.classList.add("recipe-ingredients-content");

    const ingredientsDiv = document.createElement("div");
    ingredientsDiv.classList.add("recipe-ingredients");

    const ingredientsList = document.createElement("ul");
    ingredientsList.classList.add("recipe-list");

    // Parcours de chaque ingrédient de la recette
    ingredients.forEach(({ingredient, quantity = '', unit = ''}) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<strong>${ingredient}</strong>: ${quantity} ${unit}`;
      ingredientsList.appendChild(listItem);
    });
    
    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("recipe-description");

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = description;

    // Assemblage des éléments
    timeContent.appendChild(timeIcon);
    timeContent.appendChild(timeElement);

    presentationDiv.appendChild(title);
    presentationDiv.appendChild(timeContent);
    
    ingredientsDiv.appendChild(ingredientsList);

    descriptionDiv.appendChild(descriptionElement);

    ingredientsContentDiv.appendChild(ingredientsDiv);
    ingredientsContentDiv.appendChild(descriptionDiv);

    contentDiv.appendChild(presentationDiv);
    contentDiv.appendChild(ingredientsContentDiv);

    card.appendChild(imgDiv);
    card.appendChild(contentDiv);

    return card;
  }

  // Retourne un objet contenant les propriétés de la recette
  // et la fonction qui crée la carte de recette
  return { id, name, time, ingredients, description, appliance, utensils, getRecipeCardDOM };
}
