// Filtre les recettes en fonction d'une requête et de tags
export function filterRecipes(recipes, query = { text: "", tags: [] }) {
    const queryText = query.text;
  
    function matchesQuery(ingredient, query) {
      return ingredient ? ingredient.includes(query) : false;
    }
  
    const filtered = recipes.filter(recipe => {
      const inTitle = recipe.name.toLowerCase().includes(queryText);
      const inDescription = recipe.description.toLowerCase().includes(queryText);
      const inIngredients = recipe.ingredients.some(ingredient => matchesQuery(ingredient, queryText));
  
      const tagsMatch = query.tags.every(tag =>
        recipe.ingredients.some(ingredient => matchesQuery(ingredient, tag)) ||
        recipe.appliance.includes(tag) ||
        recipe.utensils.some(utensil => utensil.includes(tag))
      );
  
      return (inTitle || inDescription || inIngredients) && tagsMatch;
    });
  
    return filtered;
  }


// Frédéric Lépy
// 10:38
// const data = ""

// const recipes = JSON.parse(data)

// const searches = ["coco", "chocolat", "pomme de terre", "poulet réunionais", "sdgdfhfgh", ""]
// Frédéric Lépy
// 10:39
// function filterRecipes(search) {
//   ...
//   return filteredRecipes
// }

// searches.forEach(search => filterRecipes(search))
// Votre message

// Envoyer
