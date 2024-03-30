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
class CardElements {
    constructor(spinner, card, cardTitle, cardText, toggle, button) {
        this.button = button;
        this.spinner = spinner;
        this.card = card;
        this.cardText = cardText;
        this.cardTitle = cardTitle;
        this.toggle = toggle;
    }
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield getInformation("list");
        handleCards(data);
    });
}
init();
function getInformation(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataFromLS = getDataFromLS(key);
        if (isDataEmpty(dataFromLS) || isDataOld(`TTL ${key}`)) {
            const newData = yield fetchData(key);
            saveLocalStorage(newData, key);
            return newData;
        }
        else {
            return dataFromLS;
        }
    });
}
function saveLocalStorage(data, key) {
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
let toggles = {};
function handleCards(data) {
    cardContainer.innerHTML = "";
    let cardElements = buildCardsElements(numberOfCardsOnPage(data));
    let togglesA = document.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < cardElements.length; i++) {
        getCardInfo(cardElements[i], data, i);
        handleButtons(cardElements, data, i);
        checking(togglesA, i, data[i].id);
    }
    forEachToggle(cardElements, togglesA, data);
}
function forEachToggle(cardElements, togglesA, data) {
    togglesA.forEach((toggle, i) => {
        toggle.addEventListener("click", function () {
            handleToggles(data[i], togglesA, i);
        });
    });
}
function handleToggles(data, togglesA, i) {
    addToToggleObject(data.id);
    if (checkedTogglesMoreThenFive()) {
        togglesState(togglesA, i, data.id);
        openModal(i);
    }
}
function checking(togglesA, i, key) {
    if (toggles[key] === true) {
        (togglesA[i].checked = true);
    }
}
function checkedTogglesMoreThenFive() {
    let checkedToggles = 0;
    for (const key in toggles) {
        if (toggles[key] === true) {
            checkedToggles++;
        }
    }
    return checkedToggles === 6;
}
function addToToggleObject(key) {
    toggles[key] = !toggles[key];
}
function togglesState(togglesA, i, key) {
    togglesA[i].checked = false;
    toggles[key] = false;
}
function handleButtons(cardElements, data, i) {
    cardElements[i].button.addEventListener("click", () => {
        showSpinner(cardElements[i].spinner);
        buttonMoreInfo(cardElements[i], data, i);
        disableSpinner(cardElements[i].spinner);
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
        if (isButtonFalse(cardElements)) {
            yield showCoinInfo(cardElements, data[i]);
        }
        else {
            resetCardInfo(cardElements, data, i);
        }
    });
}
function isButtonFalse(cardElements) {
    return cardElements.button.getAttribute("isFalse") === "false";
}
function showCoinInfo(cardElements, coin) {
    return __awaiter(this, void 0, void 0, function* () {
        clearCardText(cardElements);
        const coinData = yield getInformation(coin.id);
        displayCoinInfo(cardElements.cardText, coinData);
        setButtonState(cardElements.button, true);
    });
}
function resetCardInfo(cardElements, coin, i) {
    getCardInfo(cardElements, coin, i);
    setButtonState(cardElements.button, false);
}
function clearCardText(cardElements) {
    cardElements.cardText.innerHTML = "";
}
function setButtonState(button, state) {
    button.setAttribute("isFalse", state ? "true" : "false");
}
function displayCoinInfo(cardText, coinData) {
    let img = createElement("img", "img", cardText);
    img.src = coinData.image.small;
    curacyInfo("₪", "ils", cardText, coinData);
    curacyInfo("$", "usd", cardText, coinData);
    curacyInfo("€", "eur", cardText, coinData);
}
function curacyInfo(symbol, country, cardText, coinData) {
    let div = createElement("div", country, cardText);
    div.innerHTML = `${coinData.market_data.current_price[country]} ${symbol}`;
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
        toggle.id = "myBtn";
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
        const inputValue = getInputValue().trim().toLocaleLowerCase();
        let dataFromLS = getDataFromLS("list");
        if (inputValue === "all") {
            handleCards(dataFromLS);
        }
        else {
            dataFromLS = handleFilteredData(dataFromLS, inputValue);
            handleCards(dataFromLS);
        }
    });
}
function getInputValue() {
    const inputElement = document.querySelector(".input");
    return inputElement.value;
}
function handleFilteredData(data, inputValue) {
    const filteredData = data.filter((coin) => coin.symbol.toLowerCase() === inputValue);
    if (filteredData.length === 0) {
        alert("We didn't find that, try again!");
        return data;
    }
    else {
        return filteredData;
    }
}
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
                    changes(aboutPage, liveReportsPage, homePage);
                    break;
                case "About":
                    input.disabled = true;
                    changes(homePage, liveReportsPage, aboutPage);
                    break;
                case "Live Reports":
                    input.disabled = true;
                    changes(homePage, aboutPage, liveReportsPage);
                    break;
            }
        });
    });
}
changePageContent();
function changes(none1, none2, block) {
    none1.style.display = "none";
    none2.style.display = "none";
    block.style.display = "block";
}
const modal = document.getElementById("myModal");
function openModal(i) {
    let btn = document.querySelectorAll("#myBtn");
    let span = document.querySelector(".close");
    span.onclick = function () {
        modal.style.display = "none";
    };
    btn[i].onclick = function () {
        modal.style.display = "block";
    };
    span.onclick = function () {
        modal.style.display = "none";
    };
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
