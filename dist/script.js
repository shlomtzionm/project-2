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
    constructor(id, symbol, name) {
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
class CoinData {
    constructor(data) {
        this.data = data;
    }
}
class CoinCurrencyObject {
    constructor(type, label, data) {
        this.data = data;
        this.label = label;
        this.type = type;
    }
}
let data;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        data = yield getInformation("list");
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
    for (let i = 0; i < cardElements.length; i++) {
        getCardInfo(cardElements[i], data[i]);
        handleButtons(cardElements[i], data[i]);
        handleToggles(data[i], cardElements[i].toggle);
        checking(cardElements[i].toggle, data[i].symbol);
    }
}
function handleToggles(data, toggle) {
    toggle.addEventListener("click", function () {
        addToToggleObject(data.symbol);
        if (checkedTogglesMoreThenFive()) {
            togglesState(toggle, data.symbol);
            showModal(modal, "block");
        }
    });
}
function checking(toggle, key) {
    if (toggles[key] === true) {
        (toggle.checked = true);
    }
    else {
        (toggle.checked = false);
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
function togglesState(toggle, key) {
    toggle.checked = false;
    toggles[key] = false;
}
function handleButtons(cardElements, data) {
    cardElements.button.addEventListener("click", () => {
        showSpinner(cardElements.spinner);
        buttonMoreInfo(cardElements, data);
        disableSpinner(cardElements.spinner);
    });
}
function disableSpinner(spinner) {
    spinner.style.display = "none";
}
function showSpinner(spinner) {
    spinner.style.display = "block";
}
function getCardInfo(cardElements, data) {
    cardElements.cardTitle.innerText = data.symbol;
    cardElements.cardText.innerText = data.name;
    cardElements.button.innerText = "more info";
}
function buttonMoreInfo(cardElements, data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isButtonFalse(cardElements)) {
            yield showCoinInfo(cardElements, data);
        }
        else {
            resetCardInfo(cardElements, data);
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
function resetCardInfo(cardElements, coin) {
    getCardInfo(cardElements, coin);
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
let filteredData;
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
    return input;
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
                    exitLiveReports();
                    changes(aboutPage, liveReportsPage, homePage);
                    break;
                case "About":
                    input.disabled = true;
                    exitLiveReports();
                    changes(homePage, liveReportsPage, aboutPage);
                    break;
                case "Live Reports":
                    input.disabled = true;
                    handleLive();
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
let saveChanges = document.querySelector(".saveChanges");
let UndoChangesButton = document.querySelector(".UndoChanges");
UndoChangesButton.addEventListener("click", function () { showModal(modal, "none"); });
function showModal(modal, display) {
    modal.style.display = display;
    getModalContent();
}
let modalContent = document.querySelector(".modalContent");
function getModalContent() {
    let keys = [];
    modalContent.innerText = "";
    for (const key in toggles) {
        if (toggles[key] === true) {
            let div = createElement("div", "modalToggle", modalContent);
            div.innerText = key;
            let toggle = createToggle(div);
            toggle.checked = true;
            keys.push(key);
        }
    }
}
function saveChangesToggleObject() {
    let modalToggles = document.querySelectorAll(".modalToggle");
    modalToggles.forEach((element) => {
        let input = element.querySelector(".toggle");
        if (!input.checked) {
            addToToggleObject(element.innerText);
        }
    });
    showModal(modal, "none");
    if (filteredData && filteredData.length > 0) {
        handleCards(filteredData);
    }
    else {
        handleCards(data);
    }
}
saveChanges.addEventListener("click", saveChangesToggleObject);
function fetchChosenCoins(coins) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coins}&tsyms=USD`);
        let data = yield res.json();
        return data;
    });
}
function coinsToFetch() {
    const chosenCoins = [];
    for (const key in toggles) {
        if (toggles[key] === true) {
            chosenCoins.push(`${key},`);
        }
    }
    let chosenCoinString = chosenCoins.join(',');
    return chosenCoinString;
}
let chartCoins;
function handleLive() {
    return __awaiter(this, void 0, void 0, function* () {
        intervalId = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            chartCoins = yield fetchChosenCoins(coinsToFetch());
            pushToChosenArray(chartCoins);
            timeLabels.push(getTimeForChart());
            updateChartDate();
        }), 3000);
    });
}
let intervalId;
function exitLiveReports() {
    clearInterval(intervalId);
}
function pushToChosenArray(chartCoins) {
    chosenCoinsArray = [];
    for (const key in chartCoins) {
        console.log(chartCoins[key].USD);
        chosenCoinsArray.push(new CoinCurrencyObject("line", key, [10]));
        console.log(chosenCoinsArray);
    }
}
let chosenCoinsArray = [];
const canvasContainer = document.querySelector('#canvasContainer');
let timeLabels = [];
function updateChartDate() {
    let chartData = {
        data: {
            datasets: chosenCoinsArray,
            labels: timeLabels
        },
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'value'
                    }
                }
            },
        },
    };
    redrawChart(chartData);
}
function redrawChart(chartData) {
    canvasContainer.innerHTML = `<canvas id="myChart"></canvas>`;
    const canvas = document.getElementById('myChart');
    const ctx = canvas;
    const myChart = new Chart(ctx, chartData);
}
function getTimeForChart() {
    return (moment().format("h:mm:ss"));
}
