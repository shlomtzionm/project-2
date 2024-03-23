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
    (function () {
        return __awaiter(this, void 0, void 0, function* () {
            let data = (yield saveLocalStorage("list"));
            buildCard(data);
        });
    })();
    let cardContainer = document.querySelector("#cardContainer");
    let searchButton = document.querySelector(".search-button");
    searchButton.addEventListener("click", handleSearch);
    function handleSearch() {
        return __awaiter(this, void 0, void 0, function* () {
            let inputValue = document.querySelector(".input").value.toLocaleLowerCase();
            let dataFromLS = JSON.parse(localStorage["list"]);
            if (inputValue === "all") {
                buildCard(dataFromLS);
            }
            else {
                let filteredData = dataFromLS.filter((coin) => coin.symbol.toLowerCase() === inputValue);
                cardContainer.innerHTML = "";
                buildCard(filteredData);
            }
        });
    }
    function buildCard(data) {
        let cardsToShow = data.length > 100 ? data.slice(0, 10) : data;
        for (let i = 0; i < cardsToShow.length; i++) {
            let card = createElement("div", "card", cardContainer);
            createToggle(card);
            let cardTitle = createElement("h5", "card-title", card);
            let cardText = createElement("p", "card-text", card);
            let button = createElement("button", "btn", card);
            button.setAttribute("isFalse", "false");
            handelCardInfo(cardTitle, cardText, button, cardsToShow, i);
            button.addEventListener("click", (event) => handelInfoButton(button, cardText, cardsToShow, i, cardTitle));
        }
        // let toggles = document.querySelectorAll(".toggle");
        // handleToggles(toggles);
    }
    // function handleToggles(toggles: NodeListOf<Element>) {
    //   let checkedToggles = 0 ;
    //   toggles.forEach((toggle) => {
    //     toggle.addEventListener("click", function () {
    //       if (checkedToggles < 4) {
    //         checkedToggles++;
    //         console.log(checkedToggles)
    //       } else {
    //         toggles.forEach((toggle) => {
    //           toggle.setAttribute("disabled", "true");
    //         });
    //       }
    //     });
    //   });
    // }
    function createToggle(card) {
        let toggle = createElement("label", "switch", card);
        let input = createElement("input", "toggle", toggle);
        input.type = "checkbox";
        let span = createElement("span", "slider", toggle);
        span.classList.add("round");
    }
    function handelInfoButton(button, cardText, data, i, cardTitle) {
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
            if (!localStorage[key]) {
                data = yield fetchData(key);
                localStorage.setItem(key, JSON.stringify(data));
            }
            else {
                data = JSON.parse(localStorage[key]);
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
    let homePage = document.querySelector("#home");
    let aboutPage = document.querySelector("#about");
    let liveReportsPage = document.querySelector("#liveReports");
    let btnArray = document.querySelectorAll(".navButton");
    function changePageContent() {
        btnArray.forEach((btn) => {
            btn.addEventListener("click", function () {
                switch (btn.innerHTML) {
                    case "Home":
                        homePage.style.display = "block";
                        aboutPage.style.display = "none";
                        liveReportsPage.style.display = "none";
                        break;
                    case "About":
                        homePage.style.display = "none";
                        aboutPage.style.display = "block";
                        liveReportsPage.style.display = "none";
                        break;
                    case "Live Reports":
                        homePage.style.display = "none";
                        aboutPage.style.display = "none";
                        liveReportsPage.style.display = "block";
                        break;
                }
            });
        });
    }
    changePageContent();
});
