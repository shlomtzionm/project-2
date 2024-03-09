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

class CoinID {
  image: { small: string };
  market_data: { current_price: { usd: number, eur: number, ils: number } };
  constructor(image: { small: string }, market_data: { current_price: { usd: number, eur: number, ils: number } }) {
    this.image = image;
    this.market_data = market_data;
  }
}


(async function () {
  let cardContainer = document.querySelector("#cardContainer") as HTMLElement;

  let data = (await saveLocalStorage("list")) as Coin[];

  for (let i = 0; i < 9; i++) {
    let card = createElement("div", ["card"], cardContainer) as HTMLElement;
    let cardBody = createElement("div", ["card-body"], card) as HTMLElement;
    let cardTitle = createElement("h5", ["card-title"], cardBody) as HTMLElement;
    let cardText = createElement("p", ["card-text"], cardBody) as HTMLElement;
    let button = createElement("button", ["btn", "btn-primary"], card) as HTMLButtonElement;
    button.setAttribute("isTrue", "false");

    handelButtonInfo(cardTitle, cardText, button, data, i)

    button.addEventListener("click", async function () {
      
      if (button.getAttribute("isTrue") === "false") {
        cardText.innerHTML = "";
        moreInfo(data, i, cardText, card);
        button.setAttribute("isTrue", "true");
      } else{
        cardText.innerHTML =""
        handelButtonInfo(cardTitle, cardText, button, data, i)
        button.setAttribute("isTrue" , "false") 
      }
      cardText.innerHTML = "";
    });
  }
})();


async function saveLocalStorage(key: string):Promise<(Coin []| CoinID)> {
  let data:(Coin []| CoinID);
  if (!localStorage[key]) {
    data = await fetchData(key);
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    data = JSON.parse(localStorage[key]);
  }
  console.log(data);
  return data;
}

async function fetchData(parameter: string): Promise<(Coin []| CoinID)> {
  let res = await fetch(`https://api.coingecko.com/api/v3/coins/${parameter}`);
  let data = await res.json();
  return data;
}

function createElement(
  div: string,
  classNames: string[],
  appendTo: HTMLElement
) {
  let element = document.createElement(div);
  classNames.forEach((className) => {
    element.classList.add(className);
  });
  appendTo.appendChild(element);
  return element;
}


async function moreInfo(data: Coin[], i: number,cardBody:HTMLElement, card:HTMLElement) {
  
  let info = createElement("div",["info"],cardBody)
  let coinData =  await saveLocalStorage(data[i].id) as CoinID
  
  let img = createElement("img",["img"],info) as HTMLImageElement
  img.src = coinData.image.small
  
  let inf = createElement("p",["eur"], cardBody)
  inf.innerText = coinData.market_data.current_price.eur.toString()
  let ils = createElement("p",["eur"], cardBody)
  ils.innerText = coinData.market_data.current_price.eur.toString()
  let usd = createElement("p",["usd"], cardBody)
  usd.innerText = coinData.market_data.current_price.usd.toString()
}

function handelButtonInfo(cardTitle:HTMLElement, cardText:HTMLElement, button: HTMLButtonElement, data: Coin[], i:number){
  cardTitle.innerText = data[i].id;
  cardText.innerText = data[i].name;
  button.innerText = "more info";

}