import { filterElements, addTag} from "../utils/filter.js";


// Fonction générique pour créer une popup
function createPopup(uniqueElements, elementType, processedRecipes) {
	const frenchNames = {
		"ingredients": "ingrédient",
		"appliance": "appareil",
		"utensils": "ustensile"
	};

	const popup = document.createElement("div");
	popup.classList.add("popup", `${elementType}`);

	const popupSearchBarContent = document.createElement("div");
	popupSearchBarContent.classList.add("popup-search-bar-content", `${elementType}` );
	popup.appendChild(popupSearchBarContent);

	const popupSearchBar = document.createElement("input");
	popupSearchBar.type = "text";
	popupSearchBar.placeholder = `Rechercher un ${frenchNames[elementType]}`;
	popupSearchBar.classList.add("popup-search-bar", `${elementType}`);
	popupSearchBar.addEventListener("input", function() {
		const query = this.value;
		const filteredElements = filterElements(uniqueElements, query);
		// Mise à jour du DOM avec filteredElements
		const list = document.querySelector(`.popup-list.${elementType}`);
		list.innerHTML = " ";  // Vide la liste
		filteredElements.forEach(item => {
		  const listItem = document.createElement("li");
		  listItem.textContent = item;
		  listItem.classList.add("popup-item", elementType);
		  listItem.addEventListener("click", function() {
			addTag(this.textContent, elementType, processedRecipes);
		  });
		  list.appendChild(listItem);  // Ajoute l'élément filtré à la liste
		});
	});
	  
	popupSearchBarContent.appendChild(popupSearchBar);

	const popupArrowUp = document.createElement("span");
	popupArrowUp.classList.add("fa-solid", "fa-chevron-up");
	popupArrowUp.addEventListener("click", () => {
		popup.remove();
		document.querySelector(`.filter-button.${elementType}`).classList.remove("hidden-filter-button");
		document.querySelector(".popup-placeholder").classList.remove("popup-expanded");
	});    
	popupSearchBarContent.appendChild(popupArrowUp);

	const popupList = document.createElement("ul");
	popupList.classList.add("popup-list", `${elementType}`);
	popup.appendChild(popupList);

	uniqueElements.forEach(item => {
		const popupListItem = document.createElement("li");
		popupListItem.textContent = item;
		popupListItem.classList.add("popup-item", `${elementType}`);
		popupListItem.addEventListener("click", function() {
			addTag(this.textContent, elementType, processedRecipes);
		});

		popupList.appendChild(popupListItem);
	});

	return popup;
}

let visiblePopup = null;
let visiblePopupType = null;

// Fonction générique pour afficher une popup
export function displayPopup(uniqueElements, elementType, processedRecipes) {
	// Crée une nouvelle popup et ajoute la classe "popup-visible"
	const popup = createPopup(uniqueElements, elementType, processedRecipes);
	popup.classList.add("popup-visible");

	// Fermer la popup active (s'il y en a une)
	if (visiblePopup) {
		visiblePopup.classList.remove("popup-visible");
		document.querySelector(`.filter-button.${visiblePopupType}`).classList.remove("hidden-filter-button");  
	}

	visiblePopup = popup;
	visiblePopupType = elementType;

	document.querySelector(`.filter-button.${elementType}`).classList.add("hidden-filter-button");
	document.querySelector(".popup-placeholder").classList.add("popup-expanded");

	const popupContainer = document.querySelector(".popup-container");
	popupContainer.innerHTML = " ";
	popupContainer.appendChild(popup);
}

export function updateElementsPopup(filteredRecipes) {
	const newUniqueIngredients = [];
	const newUniqueAppliance = [];
	const newUniqueUtensils = [];

	filteredRecipes.forEach(recipe => {
		recipe.ingredients.forEach(ingredient => {
		if (!newUniqueIngredients.includes(ingredient)) {
			newUniqueIngredients.push(ingredient);
		}
		});
		
		if (!newUniqueAppliance.includes(recipe.appliance)) {
		newUniqueAppliance.push(recipe.appliance);
		}

		recipe.utensils.forEach(utensil => {
		if (!newUniqueUtensils.includes(utensil)) {
			newUniqueUtensils.push(utensil);
		}
		});
	});

	window.uniqueRecipeElements.ingredients = newUniqueIngredients;
	window.uniqueRecipeElements.appliance = newUniqueAppliance;
	window.uniqueRecipeElements.utensils = newUniqueUtensils;
}

export function updatePopupLists() {
	const elementTypes = ['ingredients', 'appliance', 'utensils'];

	elementTypes.forEach(elementType => {
		const list = document.querySelector(`.popup-list.${elementType}`);
		if (list) {

			list.innerHTML = " ";
		
			window.uniqueRecipeElements[elementType].forEach(item => {
				const listItem = document.createElement("li");
				listItem.textContent = item;
				listItem.classList.add("popup-item", elementType);
				listItem.addEventListener("click", function() {
				addTag(this.textContent, elementType, processedRecipes);
				});
				list.appendChild(listItem);
			});
		}
	});
}
  



  
