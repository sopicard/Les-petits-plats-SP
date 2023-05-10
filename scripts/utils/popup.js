// Fonction générique pour obtenir des éléments uniques
function getUniqueElements(recipes, element) {
    const uniqueElements = new Set();

    recipes.forEach(recipe => {
        // Vérifiez si l'élément que nous voulons est "ingredients"
        if (element === "ingredients") {
            const items = recipe[element];
            // Si items est un tableau d'objets (pour "ingredients")
            if (Array.isArray(items) && typeof items[0] === "object") {
                items.forEach(item => {
                    uniqueElements.add(item.ingredient);
                });
            }
        } 
        // Pour les autres éléments ("appliance" et "utensils")
        else {
            const items = recipe[element];
            // Si items est une chaîne (pour "appliance")
            if (typeof items === "string") {
                uniqueElements.add(items);
            } 
            // Si items est un tableau de chaînes (pour "utensils")
            else if (Array.isArray(items) && typeof items[0] === "string") {
                items.forEach(item => {
                    uniqueElements.add(item);
                });
            }        
        }
    });

    return Array.from(uniqueElements);
}



// Fonction générique pour créer une popup
function createPopup(uniqueElements, elementType) {
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
    popupSearchBarContent.appendChild(popupSearchBar);

    const popupArrowUp = document.createElement("span");
    popupArrowUp.classList.add("fa-solid", "fa-chevron-up");
    popupArrowUp.addEventListener("click", () => {
        popup.remove();
        document.querySelector(`.filter-button.${elementType}`).classList.remove("hidden-filter-button");
        document.querySelector(".popup-placeholder").style.width = "0";
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
            addTag(this.textContent, elementType);
        });

        popupList.appendChild(popupListItem);
    });

    return popup;
}

function addTag(tagText, elementType) {
    const tag = document.createElement("div");
    tag.textContent = tagText;
    tag.classList.add("tag", elementType);

    const cross = document.createElement("button");
    cross.classList.add("fa-regular", "fa-circle-xmark", elementType, "tag-delete");

    cross.addEventListener("click", function() {
        tag.remove();
    });

    tag.appendChild(cross);

    const tagsContainer = document.querySelector(".tags-container");
    tagsContainer.appendChild(tag);
}

let visiblePopup = null;
let visiblePopupType = null;

// Fonction générique pour afficher une popup
export function displayPopup(recipes, elementType) {
    const uniqueElements = getUniqueElements(recipes, elementType);

    // Crée une nouvelle popup et ajoute la classe "active"
    const popup = createPopup(uniqueElements, elementType);
    popup.classList.add("popup-visible");

    // Fermer la popup active (s'il y en a une)
    if (visiblePopup) {
        visiblePopup.classList.remove("popup-visible");
        document.querySelector(`.filter-button.${visiblePopupType}`).classList.remove("hidden-filter-button");
        document.querySelector('.popup-placeholder').style.width = "0";
  }

    visiblePopup = popup;
    visiblePopupType = elementType;

    document.querySelector(`.filter-button.${elementType}`).classList.add("hidden-filter-button");
    document.querySelector('.popup-placeholder').style.width = "calc(55% + 1rem)";

    const popupContainer = document.querySelector(".popup-container");
    popupContainer.innerHTML = '';
    popupContainer.appendChild(popup);
}

