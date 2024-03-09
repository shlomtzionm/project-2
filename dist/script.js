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
    constructor(img, market_data) {
        this.img = img;
        this.market_data = market_data;
    }
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        let cardContainer = document.querySelector("#cardContainer");
        let data = (yield saveLocalStorage("list"));
        for (let i = 0; i < 20; i++) {
            let card = createElement("div", ["card"], cardContainer);
            let cardBody = createElement("div", ["card-body"], card);
            let cardTitle = createElement("h5", ["card-title"], cardBody);
            let cardText = createElement("p", ["card-text"], cardBody);
            let button = createElement("button", ["btn", "btn-primary"], cardBody);
            cardTitle.innerText = data[i].id;
            cardText.innerText = data[i].name;
            button.innerText = "more info";
            button.addEventListener("click", function () {
                button.setAttribute("data-toggle", "collapse");
                button.setAttribute("data-target", "#collapseExample");
                button.setAttribute("aria-expanded", "false");
                button.setAttribute("aria-controls", "collapseExample");
                let info = createElement("div", ["collapse"], button);
                info.id = "collapseExample";
                info.innerText = "111";
                cardText.appendChild(info);
                saveLocalStorage(data[i].id);
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
