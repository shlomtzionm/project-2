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
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        let cardContainer = document.querySelector("#cardContainer");
        let data = (yield saveLocalStorage("list"));
        for (let i = 0; i < 9; i++) {
            let card = createElement("div", ["card"], cardContainer);
            let cardBody = createElement("div", ["card-body"], card);
            let cardTitle = createElement("h5", ["card-title"], cardBody);
            let cardText = createElement("p", ["card-text"], cardBody);
            let button = createElement("button", ["btn", "btn-primary"], card);
            button.setAttribute("isTrue", "false");
            handelButtonInfo(cardTitle, cardText, button, data, i);
            button.addEventListener("click", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (button.getAttribute("isTrue") === "false") {
                        cardText.innerHTML = "";
                        moreInfo(data, i, cardText, card);
                        button.setAttribute("isTrue", "true");
                    }
                    else {
                        cardText.innerHTML = "";
                        handelButtonInfo(cardTitle, cardText, button, data, i);
                        button.setAttribute("isTrue", "false");
                    }
                    cardText.innerHTML = "";
                });
            });
        }
    });
})();
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
        console.log(data);
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
function createElement(div, classNames, appendTo) {
    let element = document.createElement(div);
    classNames.forEach((className) => {
        element.classList.add(className);
    });
    appendTo.appendChild(element);
    return element;
}
function moreInfo(data, i, cardBody, card) {
    return __awaiter(this, void 0, void 0, function* () {
        let info = createElement("div", ["info"], cardBody);
        let coinData = yield saveLocalStorage(data[i].id);
        let img = createElement("img", ["img"], info);
        img.src = coinData.image.small;
        let inf = createElement("p", ["eur"], cardBody);
        inf.innerText = coinData.market_data.current_price.eur.toString();
        let ils = createElement("p", ["eur"], cardBody);
        ils.innerText = coinData.market_data.current_price.eur.toString();
        let usd = createElement("p", ["usd"], cardBody);
        usd.innerText = coinData.market_data.current_price.usd.toString();
    });
}
function handelButtonInfo(cardTitle, cardText, button, data, i) {
    cardTitle.innerText = data[i].id;
    cardText.innerText = data[i].name;
    button.innerText = "more info";
}
