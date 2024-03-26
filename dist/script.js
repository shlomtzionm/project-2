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
    function init() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataFromLS = getDataFromLS();
            if (isDataEmpty(dataFromLS) || isDataOld()) {
                const newData = yield fetchData();
                saveDataLocalStorage(newData);
                return newData;
            }
            else {
                debugger;
                return dataFromLS;
            }
        });
    }
    ;
    function handleCards() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield init();
            cardContainer.innerHTML = "";
            let cardsElements = buildCardsElements(numberOfCardsOnPage(data)); // Assuming buildCardsElements takes data directly
            for (let i = 0; i < cardsElements.length; i++) {
                handelCardInfo(cardsElements[i], data, i);
            }
        });
    }
    function handelCardInfo(cardElements, data, i) {
        cardElements.cardTitle.innerText = data[i].symbol;
        cardElements.cardText.innerText = data[i].name;
        cardElements.button.innerText = "more info";
        cardElements.toggle.checked = data[i].isChecked;
    }
    handleCards();
    function numberOfCardsOnPage(data) {
        return data.length > 100 ? data.slice(0, 10) : data;
    }
    let cardContainer = document.querySelector("#cardContainer");
    function isDataOld() {
        const storedTTL = localStorage["TTL list"];
        if (!storedTTL) {
            return false;
        }
        const storedTTLDate = JSON.parse(storedTTL);
        return new Date().getTime() - new Date(storedTTLDate).getTime() > 2 * 60 * 1000;
    }
    function fetchData() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield fetch(`https://api.coingecko.com/api/v3/coins/list`);
            let data = yield res.json();
            return data;
        });
    }
    function saveDataLocalStorage(data) {
        localStorage.setItem("list", JSON.stringify(data));
        localStorage.setItem("TTL_LIST", JSON.stringify(new Date()));
    }
    function getDataFromLS() {
        if (localStorage["list"]) {
            return JSON.parse(localStorage["list"]);
        }
        else {
            return [];
        }
    }
    function isDataEmpty(data) {
        return data.length === 0;
    }
    function createElement(div, className, appendTo) {
        let element = document.createElement(div);
        element.classList.add(className);
        appendTo.appendChild(element);
        return element;
    }
    function buildCardsElements(numberOfCardsOnPage) {
        const cardElements = [];
        for (let i = 0; i < numberOfCardsOnPage.length; i++) {
            let card = createElement("div", "myCard", cardContainer);
            let cardTitle = createElement("h5", "MY-card-title", card);
            let cardText = createElement("p", "MY-card-text", card);
            let button = createElement("button", "btn", card);
            button.setAttribute("isFalse", "false");
            let toggle = createToggle(card);
            cardElements.push({ card, cardTitle, cardText, toggle, button });
        }
        return cardElements;
    }
    //   let homePage = document.querySelector("#home") as HTMLElement;
    //   let aboutPage = document.querySelector("#about") as HTMLElement;
    //   let liveReportsPage = document.querySelector("#liveReports") as HTMLElement;
    //   let input = document.querySelector(".input") as HTMLInputElement;
    //   let btnArray = document.querySelectorAll(".navButton");
    // let spinnerElement: HTMLElement = spinner(homePage);
    // spinnerElement.style.display = "none";
    // let searchButton = document.querySelector(
    //   ".search-button"
    // ) as HTMLButtonElement;
    //   searchButton.addEventListener("click", handleSearch);
    //   async function handleSearch() {
    //     let inputValue = (
    //       document.querySelector(".input") as HTMLInputElement
    //     ).value
    //       .trim()
    //       .toLocaleLowerCase();
    //     let dataFromLS = JSON.parse(localStorage["list"]) as Coin[];
    //     if (inputValue === "all") {
    //       cardDetails(dataFromLS);
    //     } else {
    //       let filteredData = dataFromLS.filter(
    //         (coin) => coin.symbol.toLowerCase() === inputValue
    //       );
    //       if (filteredData.length === 0) {
    //         alert("we didnt fined that, try again!");
    //       } else {
    //         cardDetails(filteredData);
    //       }
    //     }
    //   }
    // createToggle(card);
    //     handelCardInfo(cardTitle, cardText, button, numberOfCardsOnPage, i);
    //       button.addEventListener("click", (event) => {
    //         handelInfoButton(button, cardText, numberOfCardsOnPage, i, cardTitle);
    //       });
    //   // const toggles = document.querySelectorAll('input[type="checkbox"]');
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
    //   let checkedToggles = 0;
    //   function toggleChangeHandler(event: Event, toggles: NodeListOf<Element>) {
    //     const target = event.target as HTMLInputElement;
    //     if (target.checked) {
    //       checkedToggles++;
    //     } else {
    //       checkedToggles--;
    //     }
    //     if (checkedToggles >= 5) {
    //       toggles.forEach((toggle) => {
    //         if (!(toggle as HTMLInputElement).checked) {
    //           (toggle as HTMLInputElement).setAttribute("disabled", "true");
    //         }
    //       });
    //     } else {
    //       toggles.forEach((toggle) => {
    //         (toggle as HTMLInputElement).removeAttribute("disabled");
    //       });
    //     }
    //   }
    function createToggle(card) {
        let toggle = createElement("label", "switch", card);
        let input = createElement("input", "toggle", toggle);
        input.type = "checkbox";
        let span = createElement("span", "slider", toggle);
        span.classList.add("round");
        return toggle;
    }
    // function handelInfoButton(
    //   button: HTMLButtonElement,
    //   cardText: HTMLElement,
    //   data: Coin[],
    //   i: number,
    //   cardTitle: HTMLElement
    // ) {
    //   spinner(cardText);
    //   debugger;
    //   if (button.getAttribute("isFalse") === "false") {
    //     cardText.innerHTML = "";
    //     moreInfo(data, i, cardText);
    //     button.setAttribute("isFalse", "true");
    //   } else {
    //     handelCardInfo(cardTitle, cardText, button, data, i);
    //     cardText.innerHTML = data[i].id;
    //     button.setAttribute("isFalse", "false");
    //   }
    // }
    //   async function moreInfo(data: Coin[], i: number, cardText: HTMLElement) {
    //     let coinData = (await saveLocalStorage(data[i].id)) as CoinID;
    //     let img = createElement("img", "img", cardText) as HTMLImageElement;
    //     img.src = coinData.image.small;
    //     let ils = currentPrice(coinData, cardText, "ils");
    //     ils.innerText += " ₪";
    //     let eur = currentPrice(coinData, cardText, "eur");
    //     eur.innerText += "  €";
    //     let usd = currentPrice(coinData, cardText, "usd");
    //     usd.innerText += " $";
    //   }
    //   function currentPrice(
    //     coinData: CoinID,
    //     cardText: HTMLElement,
    //     country: string
    //   ): HTMLElement {
    //     let div = createElement("div", country, cardText);
    //     let currency = coinData.market_data.current_price;
    //     let price = currency[country as keyof typeof currency];
    //     div.innerText = price ? price.toString() : "Price not available";
    //     return div;
    //   }
    //   function changePageContent() {
    //     btnArray.forEach((btn) => {
    //       btn.addEventListener("click", function () {
    //         switch (btn.innerHTML) {
    //           case "Home":
    //             input.disabled = false;
    //             homePage.style.display = "block";
    //             aboutPage.style.display = "none";
    //             liveReportsPage.style.display = "none";
    //             break;
    //           case "About":
    //             input.disabled = true;
    //             homePage.style.display = "none";
    //             aboutPage.style.display = "block";
    //             liveReportsPage.style.display = "none";
    //             break;
    //           case "Live Reports":
    //             input.disabled = true;
    //             homePage.style.display = "none";
    //             aboutPage.style.display = "none";
    //             liveReportsPage.style.display = "block";
    //             break;
    //         }
    //       });
    //     });
    //   }
    //   changePageContent();
    //   function spinner(appendTo: HTMLElement): HTMLElement {
    //     let border = createElement("div", "spinner-border", appendTo);
    //     border.setAttribute("role", "status");
    //     createElement("span", "sr-only", border);
    //     return border;
    //   }
});
// function alertToggles() {
//   alert("you must choose up to five coins!");
// }
