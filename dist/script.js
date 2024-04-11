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
class DatasetCoinForChart {
    constructor(label, data, Response) {
        this.type = "line";
        this.label = label;
        this.data = data;
        this.borderColor = "black",
            this.Response = "Error";
    }
}
let data;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        data = yield getInformation("list");
        handleCards(data, cardsCount);
    });
}
init();
function getInformation(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataFromLocalStorage = getDataFromLocalStorage(key);
        if (isDataEmpty(dataFromLocalStorage) || isDataOld(key)) {
            const newData = yield fetchData(key);
            saveLocalStorage(newData, key);
            return newData;
        }
        else {
            return dataFromLocalStorage;
        }
    });
}
function getDataFromLocalStorage(key) {
    if (localStorage[`${key}`]) {
        return JSON.parse(localStorage[`${key}`]);
    }
    else {
        return [];
    }
}
function isDataEmpty(data) {
    if (Array.isArray(data)) {
        return data.length === 0;
    }
    else {
        return Object.keys(data).length === 0;
    }
}
function isDataOld(key) {
    const storedTTL = localStorage.getItem(`TTL ${key}`);
    if (!storedTTL) {
        return false;
    }
    return calcTime(storedTTL);
}
function calcTime(storedTTL) {
    return new Date().getTime() - parseInt(storedTTL) > 2 * 60 * 1000;
}
function fetchData(key) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`https://api.coingecko.com/api/v3/coins/${key}`);
        let data = yield res.json();
        return data;
    });
}
function saveLocalStorage(data, key) {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`TTL ${key}`, JSON.stringify(new Date().getTime()));
}
let toggles = {};
function handleCards(data, amount) {
    cardContainer.innerHTML = "";
    let allCardsElements = buildCardsElements(numberOfCardsOnPage(data, amount));
    handleCardFeatures(allCardsElements, data);
}
function handleCardFeatures(allCardsElements, data) {
    for (let i = 0; i < allCardsElements.length; i++) {
        getCardInfo(allCardsElements[i], data[i]);
        handleButtons(allCardsElements[i], data[i]);
        handleToggles(data[i], allCardsElements[i].toggle);
        wasChecked(allCardsElements[i].toggle, data[i].symbol);
    }
}
function numberOfCardsOnPage(data, amount) {
    let slicedData = data.slice(0, amount);
    return slicedData;
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
function createElement(div, className, appendTo) {
    let element = document.createElement(div);
    element.classList.add(className);
    appendTo.appendChild(element);
    return element;
}
function createToggle(card) {
    let toggle = createElement("label", "switch", card);
    let input = createElement("input", "toggle", toggle);
    input.type = "checkbox";
    let span = createElement("span", "slider", toggle);
    span.classList.add("round");
    return input;
}
function createSpinner(appendTo) {
    let border = createElement("div", "spinner-border", appendTo);
    border.setAttribute("role", "status");
    createElement("span", "sr-only", border);
    return border;
}
function getCardInfo(cardElements, data) {
    cardElements.cardTitle.innerText = data.symbol;
    cardElements.cardText.innerText = data.name;
    cardElements.button.innerText = "more info";
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
function buttonMoreInfo(cardElements, data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isButtonFalse(cardElements)) {
            yield showMoreInfo(cardElements, data);
        }
        else {
            resetCardInfo(cardElements, data);
        }
    });
}
function isButtonFalse(cardElements) {
    return cardElements.button.getAttribute("isFalse") === "false";
}
function showMoreInfo(cardElements, coin) {
    return __awaiter(this, void 0, void 0, function* () {
        clearCardText(cardElements);
        const coinData = yield getInformation(coin.id);
        displayCurrency(cardElements.cardText, coinData);
        setButtonState(cardElements.button, true);
    });
}
function displayCurrency(cardText, coinData) {
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
function handleToggles(data, toggle) {
    toggle.addEventListener("click", function () {
        addToToggleObject(data.symbol);
        if (checkedTogglesMoreThenFive()) {
            changeDefaultState(toggle, data.symbol);
            showModal(modal, "block");
        }
    });
}
let checkedToggles;
function checkedTogglesMoreThenFive() {
    checkedToggles = 0;
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
function changeDefaultState(toggle, key) {
    toggle.checked = false;
    toggles[key] = false;
}
function showModal(modal, display) {
    modal.style.display = display;
    handleModal();
}
function wasChecked(toggle, key) {
    if (toggles[key] === true) {
        toggle.checked = true;
    }
    else {
        toggle.checked = false;
    }
}
function areTogglesChecked() {
    if (checkedToggles === 0 || checkedToggles === undefined) {
        return true;
    }
    return false;
}
let cardContainer = document.querySelector("#cardContainer");
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
        const inputValue = input.value.trim().toLocaleLowerCase();
        let dataFromLocalStorage = getDataFromLocalStorage("list");
        if (inputValue === "all") {
            handleCards(dataFromLocalStorage, 20);
            loudMore.style.display = "block";
        }
        else {
            let filteredData = handleFilteredData(dataFromLocalStorage, inputValue);
            handleCards(filteredData, filteredData.length);
            loudMore.style.display = "none";
        }
    });
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
function changePageContent() {
    btnArray.forEach((btn) => {
        btn.addEventListener("click", function () {
            switch (btn.innerHTML) {
                case "Home":
                    input.disabled = false;
                    exitLiveReports();
                    pageToDisplay(aboutPage, liveReportsPage, homePage);
                    break;
                case "About":
                    input.disabled = true;
                    exitLiveReports();
                    pageToDisplay(homePage, liveReportsPage, aboutPage);
                    break;
                case "Live Reports":
                    input.disabled = true;
                    if (!areTogglesChecked()) {
                        pageToDisplay(homePage, aboutPage, liveReportsPage);
                        handleLive();
                    }
                    else {
                        alert("please choose some coins");
                    }
                    break;
            }
        });
    });
}
changePageContent();
function pageToDisplay(none1, none2, block) {
    none1.style.display = "none";
    none2.style.display = "none";
    block.style.display = "block";
}
const modal = document.getElementById("myModal");
let modalContent = document.querySelector(".modalContent");
let saveChanges = document.querySelector(".saveChanges");
let UndoChangesButton = document.querySelector(".UndoChanges");
UndoChangesButton.addEventListener("click", function () {
    showModal(modal, "none");
});
saveChanges.addEventListener("click", saveChangesToggleObject);
function handleModal() {
    modalContent.innerText = "";
    getModalContent();
}
function getModalContent() {
    for (const key in toggles) {
        if (toggles[key] === true) {
            let div = createElement("div", "modalToggle", modalContent);
            div.innerText = key;
            let toggle = createToggle(div);
            toggle.checked = true;
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
        handleCards(filteredData, filteredData.length);
    }
    else {
        handleCards(data, 20);
    }
}
function handleLive() {
    return __awaiter(this, void 0, void 0, function* () {
        resetChartData();
        handleInterval();
    });
}
function exitLiveReports() {
    clearInterval(intervalId);
}
let intervalId;
let chartCoins;
function handleInterval() {
    intervalId = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        chartCoins = yield fetchChosenCoins(whichCoinsToFetch());
        pushToCoinsDataset(chartCoins);
        timeLabels.push(getTimeForChart());
        updateChartOrCreate();
    }), 2000);
}
function fetchChosenCoins(coins) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coins}&tsyms=USD`);
        let data = yield res.json();
        return data;
    });
}
function whichCoinsToFetch() {
    const chosenCoins = [];
    for (const key in toggles) {
        if (toggles[key] === true) {
            chosenCoins.push(key);
        }
    }
    let chosenCoinString = chosenCoins.join(",");
    return chosenCoinString;
}
let usdValues = {};
let coinsDataset = [];
function resetChartData() {
    usdValues = {};
    coinsDataset = [];
    timeLabels = [];
    canvasContainer.innerHTML = "";
}
function pushToCoinsDataset(chartCoins) {
    coinsDataset = [];
    for (const key in chartCoins) {
        if (chartCoins.Response) {
            alert("we dont have information about this coin");
            pageToDisplay(liveReportsPage, aboutPage, homePage);
            clearInterval(intervalId);
            break;
        }
        if (!usdValues[key]) {
            usdValues[key] = [];
        }
        getCoinValuePerSeconde(+chartCoins[key].USD, key);
        if (!chartCoins.Response) {
            coinsDataset.push(new DatasetCoinForChart(key, usdValues[key]));
        }
    }
}
const canvasContainer = document.querySelector("#canvasContainer");
let timeLabels = [];
function updateChartOrCreate() {
    if (canvasContainer.innerHTML === "") {
        createChart();
    }
    myChart.update();
}
let myChart;
function createChart() {
    canvasContainer.innerHTML = `<canvas id="myChart" ></canvas>`;
    const canvas = document.getElementById("myChart");
    const ctx = canvas;
    myChart = new Chart(ctx, {
        data: {
            datasets: coinsDataset,
            labels: timeLabels,
        },
        options: {
            layout: {
                padding: {
                    left: 80,
                    right: 80,
                    bottom: 20,
                    top: 20,
                }
            },
        },
        type: "bar",
    });
}
function getTimeForChart() {
    return moment().format("h:mm:ss");
}
function getCoinValuePerSeconde(value, key) {
    usdValues[key].push(value);
}
let welcomeSection = document.querySelector(".welcome");
window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    welcomeSection.style.transform = "translateY(" + scrollPosition * 0.5 + "px)";
});
let cardsCount = 20;
let loudMore = document.querySelector("#loudMore");
loudMore.addEventListener("click", showMoreCards);
function showMoreCards() {
    cardsCount = cardsCount + 20;
    handleCards(data, cardsCount);
}
