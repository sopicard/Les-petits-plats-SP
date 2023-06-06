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

