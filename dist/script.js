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
document.addEventListener("DOMContentLoaded", function () {
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
    let homePage = document.querySelector("#home");
    let aboutPage = document.querySelector("#about");
    let liveReportsPage = document.querySelector("#liveReports");
    let input = document.querySelector(".input");
    let btnArray = document.querySelectorAll(".navButton");
    (function () {
        return __awaiter(this, void 0, void 0, function* () {
            let spinnerElement = spinner(homePage);
            let data = (yield saveLocalStorage("list"));
            spinnerElement.style.display = "none";
            cardDetails(data);
        });
    })();
    let cardContainer = document.querySelector("#cardContainer");
    let searchButton = document.querySelector(".search-button");
    searchButton.addEventListener("click", handleSearch);
    function handleSearch() {
        return __awaiter(this, void 0, void 0, function* () {
            let inputValue = document.querySelector(".input").value.trim().toLocaleLowerCase();
            let dataFromLS = JSON.parse(localStorage["list"]);
            if (inputValue === "all") {
                cardDetails(dataFromLS);
            }
            else {
                let filteredData = dataFromLS.filter((coin) => coin.symbol.toLowerCase() === inputValue);
                if (filteredData.length === 0) {
                    alert("we didnt fined that, try again!");
                }
                else {
                    cardDetails(filteredData);
                }
            }
        });
    }
    function buildCards(cardsToShow) {
        for (let i = 0; i < cardsToShow.length; i++) {
            let card = createElement("div", "myCard", cardContainer);
            createToggle(card);
            let cardTitle = createElement("h5", "MY-card-title", card);
            let cardText = createElement("p", "MY-card-text", card);
            let button = createElement("button", "btn", card);
            button.setAttribute("isFalse", "false");
            handelCardInfo(cardTitle, cardText, button, cardsToShow, i);
            button.addEventListener("click", (event) => {
                handelInfoButton(button, cardText, cardsToShow, i, cardTitle);
            });
        }
    }
    function cardDetails(data) {
        cardContainer.innerHTML = "";
        let cardsToShow = data.length > 100 ? data.slice(0, 10) : data;
        buildCards(cardsToShow);
        const toggles = document.querySelectorAll('input[type="checkbox"]');
        handleToggles(toggles);
    }
    function handleToggles(toggles) {
        toggles.forEach((toggle) => {
            toggle.addEventListener("click", (event) => {
                toggleChangeHandler(event, toggles);
                if (toggle.disabled) {
                    debugger;
                    alertToggles();
                }
            });
        });
    }
    let checkedToggles = 0;
    function toggleChangeHandler(event, toggles) {
        const target = event.target;
        if (target.checked) {
            checkedToggles++;
        }
        else {
            checkedToggles--;
        }
        if (checkedToggles >= 5) {
            toggles.forEach((toggle) => {
                if (!toggle.checked) {
                    toggle.setAttribute("disabled", "true");
                }
            });
        }
        else {
            toggles.forEach((toggle) => {
                toggle.removeAttribute("disabled");
            });
        }
    }
    function createToggle(card) {
        let toggle = createElement("label", "switch", card);
        let input = createElement("input", "toggle", toggle);
        input.type = "checkbox";
        let span = createElement("span", "slider", toggle);
        span.classList.add("round");
    }
    function handelInfoButton(button, cardText, data, i, cardTitle) {
        spinner(cardText);
        debugger;
        if (button.getAttribute("isFalse") === "false") {
            cardText.innerHTML = "";
            moreInfo(data, i, cardText);
            button.setAttribute("isFalse", "true");
        }
        else {
            handelCardInfo(cardTitle, cardText, button, data, i);
            cardText.innerHTML = data[i].id;
            button.setAttribute("isFalse", "false");
        }
    }
    function saveLocalStorage(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            let storedTTL = new Date(localStorage.getItem(`TTL ${key}`));
            let currentDate = new Date().getTime();
            if (currentDate - storedTTL.getTime() < 2 * 60 * 1000) {
                data = JSON.parse(localStorage.getItem(key));
            }
            else {
                data = yield fetchData(key);
                localStorage.setItem(`TTL ${key}`, JSON.stringify(new Date()));
                localStorage.setItem(key, JSON.stringify(data));
            }
            return data;
        });
    }
    function fetchData(parameter) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield fetch(`https://api.coingecko.com/api/v3/coins/${parameter}`);
            let data = yield res.json();
            return data;
        });
    }
    function createElement(div, className, appendTo) {
        let element = document.createElement(div);
        element.classList.add(className);
        appendTo.appendChild(element);
        return element;
    }
    function moreInfo(data, i, cardText) {
        return __awaiter(this, void 0, void 0, function* () {
            let coinData = (yield saveLocalStorage(data[i].id));
            let img = createElement("img", "img", cardText);
            img.src = coinData.image.small;
            let ils = currentPrice(coinData, cardText, "ils");
            ils.innerText += " ₪";
            let eur = currentPrice(coinData, cardText, "eur");
            eur.innerText += "  €";
            let usd = currentPrice(coinData, cardText, "usd");
            usd.innerText += " $";
        });
    }
    function handelCardInfo(cardTitle, cardText, button, data, i) {
        cardTitle.innerText = data[i].symbol;
        cardText.innerText = data[i].name;
        button.innerText = "more info";
    }
    function currentPrice(coinData, cardText, country) {
        let div = createElement("div", country, cardText);
        let currency = coinData.market_data.current_price;
        let price = currency[country];
        div.innerText = price ? price.toString() : "Price not available";
        return div;
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
    function spinner(appendTo) {
        let border = createElement("div", "spinner-border", appendTo);
        border.setAttribute("role", "status");
        createElement("span", "sr-only", border);
        return border;
    }
});
function alertToggles() {
    alert("you must choose up to five coins!");
}
