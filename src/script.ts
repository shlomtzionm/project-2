// document.addEventListener("DOMContentLoaded", function () {
class Coin {
  id: string;
  symbol: string;
  name: string;
  isChecked: boolean
  constructor(id: string, symbol: string, name: string,  isChecked: boolean) {
    this.isChecked = isChecked;
    this.id = id;
    this.name = name;
    this.symbol = symbol;
  }
}



class CoinID {
  image: { small: string };
  market_data: { current_price: { usd: number; eur: number; ils: number } };
  constructor(
    image: { small: string },
    market_data: { current_price: { usd: number; eur: number; ils: number } },
  ) {
    this.image = image;
    this.market_data = market_data;
  }
}


async function init() :Promise<Coin[]>{
  const dataFromLS = getDataFromLS();
  if (isDataEmpty(dataFromLS) || isDataOld("TTL_LIST")) {
    const newData = await fetchData();
    saveAllDataLocalStorage(newData);
    return newData
  }else{
     return dataFromLS}
};

async function handleCards() {
  let data = await init();
  cardContainer.innerHTML = "";
  let cardsElements = buildCardsElements(numberOfCardsOnPage(data)); 

  for (let i = 0; i < cardsElements.length; i++) {
    getCardInfo(cardsElements[i], data, i)

    cardsElements[i].button.addEventListener("click",() => {
   showSpinner(cardsElements[i].spinner)
     getMoreInfoButton(cardsElements[i], data, i)
      disableSpinner(cardsElements[i].spinner)
    
    })  
}
}
handleCards()



function disableSpinner(spinner:HTMLElement){
spinner.style.display = "none"
}
function showSpinner(spinner:HTMLElement){
  spinner.style.display = "block"
}

function getCardInfo(cardElements:{ card: HTMLElement, cardTitle: HTMLElement, cardText: HTMLElement,toggle: HTMLInputElement,button:HTMLElement }, 
  data:Coin[], i:number) {
  cardElements.cardTitle.innerText = data[i].symbol;
  cardElements.cardText.innerText = data[i].name;
  cardElements.button.innerText = "more info";
  cardElements.toggle.checked = data[i].isChecked;

}

async function getMoreInfoButton( cardElements:{ card: HTMLElement, cardTitle: HTMLElement, cardText: HTMLElement,toggle: HTMLInputElement,button:HTMLElement },  data:Coin[], i:number) {
  if (cardElements.button.getAttribute("isFalse") === "false") {
    cardElements.cardText.innerHTML = "";
  let coinData = await getMoreInfo(data[i],  cardElements.cardText);
    moreInfoDate(cardElements.cardText, coinData);
cardElements.button.setAttribute("isFalse", "true");
  } else {
    getCardInfo(cardElements, data, i);
    cardElements.cardText.innerHTML = data[i].id;
    cardElements.button.setAttribute("isFalse", "false");
  }
}


function numberOfCardsOnPage(data:Coin[]):Coin[]{
return  data.length > 100 ? data.slice(0, 10) : data;
}

let cardContainer = document.querySelector("#cardContainer") as HTMLElement;




function isDataOld(item:string): boolean {
  const storedTTL = localStorage.getItem(`${item}`); 
  if (!storedTTL) {
    return false; 
  }
  return new Date().getTime() - parseInt(storedTTL) > 2 * 60 * 1000; 
}


async function fetchData(): Promise<Coin[]> {
  let res = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
  let data = await res.json();
  return data;
}

function saveAllDataLocalStorage(data: Coin[]) {
  localStorage.setItem("list", JSON.stringify(data));
  localStorage.setItem("TTL_LIST", JSON.stringify(new Date().getTime()));
}

function getDataFromLS(): Coin[] {
  if (localStorage["list"]) {
    return JSON.parse(localStorage["list"]);
  } else {
    return [];
  }
}

function isDataEmpty(data: []): boolean {
  return data.length === 0;
}

function createElement(
  div: string,
  className: string,
  appendTo: HTMLElement
) {
  let element = document.createElement(div);
  element.classList.add(className);
  appendTo.appendChild(element);
  return element;
}

function createSpinner(appendTo: HTMLElement): HTMLElement {
  let border = createElement("div", "spinner-border", appendTo);
  border.setAttribute("role", "status");
  createElement("span", "sr-only", border);
  return border;
}

function buildCardsElements(numberOfCardsOnPage: Coin[]): { card: HTMLElement, cardTitle: HTMLElement, cardText: HTMLElement,toggle: HTMLInputElement,button:HTMLElement,spinner:HTMLElement }[] {
  const cardElements: { button:HTMLElement,card: HTMLElement, cardTitle: HTMLElement, cardText: HTMLElement,toggle: HTMLInputElement,spinner:HTMLElement }[] = [];

  for (let i = 0; i < numberOfCardsOnPage.length; i++) {
    let card = createElement("div", "myCard", cardContainer) as HTMLElement;
    let toggle = createToggle(card)
    let cardTitle = createElement("h5", "MY-card-title", card) as HTMLElement;
    let cardText = createElement("p", "MY-card-text", card) as HTMLElement;
    let button = createElement("button", "btn", card) as HTMLButtonElement;
    button.setAttribute("isFalse", "false");
   
    let spinner = createSpinner(card)
    cardElements.push({ card, cardTitle, cardText,toggle,button,spinner});
 
 }
  return cardElements;
}


  let homePage = document.querySelector("#home") as HTMLElement;
  let aboutPage = document.querySelector("#about") as HTMLElement;
  let liveReportsPage = document.querySelector("#liveReports") as HTMLElement;
  let input = document.querySelector(".input") as HTMLInputElement;
  let btnArray = document.querySelectorAll(".navButton");





 
  // let searchButton = document.querySelector(
  //   ".search-button"
  // ) as HTMLButtonElement;

  // searchButton.addEventListener("click", handleSearch);

  // async function handleSearch() {
  //   let inputValue = (
  //     document.querySelector(".input") as HTMLInputElement
  //   ).value
  //     .trim()
  //     .toLocaleLowerCase();
  //   let dataFromLS = JSON.parse(localStorage["list"]) as Coin[];
  //   if (inputValue === "all") {
  //    handleCards()
  //   } else {
  //     let filteredData = dataFromLS.filter(
  //       (coin) => coin.symbol.toLowerCase() === inputValue
  //     );
  //     if (filteredData.length === 0) {
  //       alert("we didnt fined that, try again!");
  //     } else {
  //       // cardDetails(filteredData);
  //     }
  //   }
  // }






  
  
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

  function createToggle(card: HTMLElement):HTMLInputElement {
    let toggle = createElement("label", "switch", card) as HTMLInputElement;
    let input = createElement("input", "toggle", toggle) as HTMLInputElement;
    input.type = "checkbox";
    let span = createElement("span", "slider", toggle);
    span.classList.add("round");
    return toggle
  }



  async function fetchDataCoinId(coinID:string): Promise<CoinID> {
    let res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinID}`);
    let data = await res.json();
    return data;
  }

  

async function getMoreInfo(data:Coin,cardText: HTMLElement) :Promise<CoinID>{
  const coinData = getCoinFromLS(data.id);
  if (isDataEmpty(coinData) || isDataOld(`TTL ${data.id}`)) {
    const newData = await fetchDataCoinId(data.id);
    saveCardDataLocalStorage(coinData, data.id);
    return newData
  }else{
     return coinData}
     
};


function getCoinFromLS(key:string):CoinID[]{
  if (localStorage[`${key}`]) {
    return JSON.parse(localStorage[`${key}`]);
  } else {
    return []
  }
}


function moreInfoDate(cardText:HTMLElement,coinData:CoinID){
  let img = createElement("img", "img", cardText) as HTMLImageElement;
  img.src = coinData.image.small;
      let ils = createElement("div","ils",cardText )
      ils.innerText = `${coinData.market_data.current_price.ils} ₪`
let usd =createElement("div","usd",cardText )
usd.innerText = `${coinData.market_data.current_price.usd} $`
  let eur =createElement("div","eur",cardText )
 eur.innerText= `${coinData.market_data.current_price.eur} €`
}

function saveCardDataLocalStorage(data: CoinID, key:string) {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(`TTL ${key}`, JSON.stringify(new Date().getTime()));
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


// });

// function alertToggles() {
//   alert("you must choose up to five coins!");
// }
