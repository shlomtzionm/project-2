class Coin {
  id: string;
  symbol: string;
  name: string;
  constructor(id: string, symbol: string, name: string) {
    this.id = id;
    this.name = name;
    this.symbol = symbol;
  }
}

class CoinID{
    img: string;
    market_data: {};
    constructor(img: string,
        market_data: {}){
            this.img = img;
            this.market_data = market_data
        }

}

(async function () {
let listData = await saveLocalStorage("list")
  await eachCoinData(listData);
})();

async function eachCoinData(data: Coin[]) {
  for (let i = 0; i < 5; i++) {
   saveLocalStorage((data[i].id))
  }
}

 async function saveLocalStorage(key: string):Promise<Coin[]>{
    let data : Coin[]
if(!localStorage[key]){
    data = await fetchData(key)
    localStorage.setItem(key, JSON.stringify(data))
} else{
    data = JSON.parse(localStorage[key])
}
console.log(data)
return data
}

async function fetchData(parameter: string): Promise<(Coin | CoinID)[]>{
    let res = await fetch(`https://api.coingecko.com/api/v3/coins/${parameter}`);
    let data = await res.json();
    return data;
  }