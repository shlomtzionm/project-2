"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// document.addEventListener("DOMContentLoaded", function () {
class Coin {
    constructor(id, symbol, name, isChecked) {
        this.isChecked = isChecked;
        this.id = id;
        this.name = name;
        this.symbol = symbol;
    }
}
class CoinID {
    constructor(image, market_data) {
        this.image = image;
        this.market_data = market_data;
    }
}
function getInformation(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataFromLS = getDataFromLS(key);
        if (isDataEmpty(dataFromLS) || isDataOld(`TTL ${key}`)) {
            const newData = yield fetchData(key);
            saveCardDataLocalStorage(newData, key);
            return newData;
        }
        else {
            return dataFromLS;
        }
    });
}
function saveCardDataLocalStorage(data, key) {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`TTL ${key}`, JSON.stringify(new Date().getTime()));
}
function isDataOld(item) {
    const storedTTL = localStorage.getItem(`TTL ${item}`);
    if (!storedTTL) {
        return false;
    }
    return new Date().getTime() - parseInt(storedTTL) > 2 * 60 * 1000;
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield getInformation("list");
        handleCards(data);
    });
}
init();
function handleCards(data) {
    cardContainer.innerHTML = "";
    let cardsElements = buildCardsElements(numberOfCardsOnPage(data));
    for (let i = 0; i < cardsElements.length; i++) {
        getCardInfo(cardsElements[i], data, i);
        handleButtons(cardsElements, data, i);
        // handleToggles(cardsElements)
        // cardsElements[i].toggle.addEventListener("change",function(event){
        //   toggleChangeHandler(event,cardsElements[i].toggle)
        // })
    }
}
function handleButtons(cardsElements, data, i) {
    cardsElements[i].button.addEventListener("click", () => {
        showSpinner(cardsElements[i].spinner);
        buttonMoreInfo(cardsElements[i], data, i);
        disableSpinner(cardsElements[i].spinner);
    });
}
function disableSpinner(spinner) {
    spinner.style.display = "none";
}
function showSpinner(spinner) {
    spinner.style.display = "block";
}
function getCardInfo(cardElements, data, i) {
    cardElements.cardTitle.innerText = data[i].symbol;
    cardElements.cardText.innerText = data[i].name;
    cardElements.button.innerText = "more info";
    cardElements.toggle.checked = data[i].isChecked;
}
function buttonMoreInfo(cardElements, data, i) {
    return __awaiter(this, void 0, void 0, function* () {
        if (cardElements.button.getAttribute("isFalse") === "false") {
            cardElements.cardText.innerHTML = "";
            let coinData = yield getInformation(data[i].id);
            moreInfoDate(cardElements.cardText, coinData);
            cardElements.button.setAttribute("isFalse", "true");
        }
        else {
            getCardInfo(cardElements, data, i);
            cardElements.cardText.innerHTML = data[i].id;
            cardElements.button.setAttribute("isFalse", "false");
        }
    });
}
function moreInfoDate(cardText, coinData) {
    let img = createElement("img", "img", cardText);
    img.src = coinData.image.small;
    let ils = createElement("div", "ils", cardText);
    ils.innerText = `${coinData.market_data.current_price.ils} ₪`;
    let usd = createElement("div", "usd", cardText);
    usd.innerText = `${coinData.market_data.current_price.usd} $`;
    let eur = createElement("div", "eur", cardText);
    eur.innerText = `${coinData.market_data.current_price.eur} €`;
}
function numberOfCardsOnPage(data) {
    return data.length > 100 ? data.slice(0, 10) : data;
}
let cardContainer = document.querySelector("#cardContainer");
function fetchData(key) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`https://api.coingecko.com/api/v3/coins/${key}`);
        let data = yield res.json();
        return data;
    });
}
function isDataEmpty(data) {
    if (Array.isArray(data)) {
        return data.length === 0;
    }
    else {
        return Object.keys(data).length === 0;
    }
}
function createElement(div, className, appendTo) {
    let element = document.createElement(div);
    element.classList.add(className);
    appendTo.appendChild(element);
    return element;
}
function createSpinner(appendTo) {
    let border = createElement("div", "spinner-border", appendTo);
    border.setAttribute("role", "status");
    createElement("span", "sr-only", border);
    return border;
}
function buildCardsElements(numberOfCardsOnPage) {
    const cardElements = [];
    for (let i = 0; i < numberOfCardsOnPage.length; i++) {
        let card = createElement("div", "myCard", cardContainer);
        let toggle = createToggle(card);
        let cardTitle = createElement("h5", "MY-card-title", card);
        let cardText = createElement("p", "MY-card-text", card);
        let button = createElement("button", "btn", card);
        button.setAttribute("isFalse", "false");
        let spinner = createSpinner(card);
        cardElements.push({ card, cardTitle, cardText, toggle, button, spinner });
    }
    return cardElements;
}
let homePage = document.querySelector("#home");
let aboutPage = document.querySelector("#about");
let liveReportsPage = document.querySelector("#liveReports");
let input = document.querySelector(".input");
let btnArray = document.querySelectorAll(".navButton");
let searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", handleSearch);
function handleSearch() {
    return __awaiter(this, void 0, void 0, function* () {
        let inputValue = document.querySelector(".input").value.trim().toLocaleLowerCase();
        let dataFromLS = JSON.parse(localStorage["list"]);
        if (inputValue === "all") {
            handleCards(dataFromLS);
        }
        else {
            let filteredData = dataFromLS.filter((coin) => coin.symbol.toLowerCase() === inputValue);
            if (filteredData.length === 0) {
                alert("we didn't fined that, try again!");
            }
            else {
                handleCards(filteredData);
            }
        }
    });
}
// const toggles = document.querySelectorAll('input[type="checkbox"]')
// console.log(toggles);
//   // handleToggles(toggles);
//   function handleToggles(toggles: NodeListOf<Element>) {
//     toggles.forEach((toggle) => {
//       toggle.addEventListener("click", (event) => {
//         toggleChangeHandler(event, toggles);
//         if ((toggle as HTMLInputElement).disabled) {
//           debugger;
//           alertToggles();
//         }
//       });
//     });
//   }
// let checkedToggles = 0;
// function toggleChangeHandler(event: Event,toggle:HTMLInputElement) {
//   const target = event.target as HTMLInputElement;
//   if (target.checked) {
//     checkedToggles++;
//   } else {
//     checkedToggles--;
//   }
//   if (checkedToggles >= 5) {
//       if (!(toggle as HTMLInputElement).checked) {
//         (toggle as HTMLInputElement).setAttribute("disabled", "true");
//   } else {
//     let toggles = document.querySelectorAll('input[type="checkbox"]');
//     toggles.forEach((toggle)=>{ (toggle as HTMLInputElement).removeAttribute("disabled")})
//      ;
//   }
// }
// }
function createToggle(card) {
    let toggle = createElement("label", "switch", card);
    let input = createElement("input", "toggle", toggle);
    input.type = "checkbox";
    let span = createElement("span", "slider", toggle);
    span.classList.add("round");
    return toggle;
}
function getDataFromLS(key) {
    if (localStorage[`${key}`]) {
        return JSON.parse(localStorage[`${key}`]);
    }
    else {
        return [];
    }
}
function changePageContent() {
    btnArray.forEach((btn) => {
        btn.addEventListener("click", function () {
            switch (btn.innerHTML) {
                case "Home":
                    input.disabled = false;
                    homePage.style.display = "block";
                    aboutPage.style.display = "none";
                    liveReportsPage.style.display = "none";
                    break;
                case "About":
                    input.disabled = true;
                    homePage.style.display = "none";
                    aboutPage.style.display = "block";
                    liveReportsPage.style.display = "none";
                    break;
                case "Live Reports":
                    input.disabled = true;
                    homePage.style.display = "none";
                    aboutPage.style.display = "none";
                    liveReportsPage.style.display = "block";
                    break;
            }
        });
    });
}
changePageContent();
// });
// function alertToggles() {
//   alert("you must choose up to five coins!");
// }
