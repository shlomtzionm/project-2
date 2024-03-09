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
  img: string;
  market_data: {};
  constructor(img: string, market_data: {}) {
    this.img = img;
    this.market_data = market_data;
  }
}

(async function () {
  let cardContainer = document.querySelector("#cardContainer") as HTMLElement;

  let data = (await saveLocalStorage("list")) as Coin[];

  for (let i = 0; i < 20; i++) {
    let card = createElement("div", ["card"], cardContainer) as HTMLElement;
    let cardBody = createElement("div", ["card-body"], card) as HTMLElement;
    let cardTitle = createElement( "h5",["card-title"], cardBody) as HTMLElement;
    let cardText = createElement("p", ["card-text"], cardBody) as HTMLElement;
    let button = createElement( "button", ["btn", "btn-primary"],cardBody) as HTMLButtonElement;

    
    
    cardTitle.innerText = data[i].id;
    cardText.innerText = data[i].name;
    button.innerText = "more info";

    button.addEventListener("click", function(){
      button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", "#collapseExample");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "collapseExample");

      let info = createElement("div",["collapse"],button )
      info.id = "collapseExample"
      info.innerText = "111"
      cardText.appendChild(info)
      
      
      
      
saveLocalStorage(data[i].id)

    })
  }

})();



async function saveLocalStorage(key: string): Promise<(Coin | CoinID)[]> {
  let data: (Coin | CoinID)[];
  if (!localStorage[key]) {
    data = await fetchData(key);
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    data = JSON.parse(localStorage[key]);
  }
  console.log(data)
  return data;
}

async function fetchData(parameter: string): Promise<(Coin | CoinID)[]> {
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





