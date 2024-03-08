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
        let listData = yield saveLocalStorage("list");
        yield eachCoinData(listData);
    });
})();
function eachCoinData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 5; i++) {
            saveLocalStorage((data[i].id));
        }
    });
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
