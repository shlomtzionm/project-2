document.addEventListener("DOMContentLoaded", function () {
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
  if (isDataEmpty(dataFromLS) || isDataOld()) {
    const newData = await fetchData();
    saveDataLocalStorage(newData);
    return newData
  }else{
    debugger
     return dataFromLS}
};

async function handleCards() {
  let data = await init();
  cardContainer.innerHTML = "";
  let cardsElements = buildCardsElements(numberOfCardsOnPage(data)); // Assuming buildCardsElements takes data directly
  for (let i = 0; i < cardsElements.length; i++) {
    handelCardInfo(cardsElements[i], data, i);
  }
}

function handelCardInfo(cardElements:{ card: HTMLElement, cardTitle: HTMLElement, cardText: HTMLElement,toggle: HTMLInputElement,button:HTMLElement }, data:Coin[], i:number) {
  cardElements.cardTitle.innerText = data[i].symbol;
  cardElements.cardText.innerText = data[i].name;
  cardElements.button.innerText = "more info";
  cardElements.toggle.checked = data[i].isChecked;
}

handleCards()

function numberOfCardsOnPage(data:Coin[]):Coin[]{
return  data.length > 100 ? data.slice(0, 10) : data;
}

let cardContainer = document.querySelector("#cardContainer") as HTMLElement;




function isDataOld(): boolean {
  const storedTTL = localStorage["TTL list"];
  if (!storedTTL) {
    return false;
  }
  const storedTTLDate = JSON.parse(storedTTL);
  return new Date().getTime() - new Date(storedTTLDate).getTime() > 2 * 60 * 1000;
}


async function fetchData(): Promise<Coin[]> {
  let res = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
  let data = await res.json();
  return data;
}

function saveDataLocalStorage(data: Coin[]) {
  localStorage.setItem("list", JSON.stringify(data));
  localStorage.setItem("TTL_LIST", JSON.stringify(new Date()));
}

function getDataFromLS(): Coin[] {
  if (localStorage["list"]) {
    return JSON.parse(localStorage["list"]);
  } else {
    return [];
  }
}

function isDataEmpty(data: Coin[]): boolean {
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

function buildCardsElements(numberOfCardsOnPage: Coin[]): { card: HTMLElement, cardTitle: HTMLElement, cardText: HTMLElement,toggle: HTMLInputElement,button:HTMLElement }[] {
  const cardElements: { button:HTMLElement,card: HTMLElement, cardTitle: HTMLElement, cardText: HTMLElement,toggle: HTMLInputElement }[] = [];

  for (let i = 0; i < numberOfCardsOnPage.length; i++) {
    let card = createElement("div", "myCard", cardContainer) as HTMLElement;
    let cardTitle = createElement("h5", "MY-card-title", card) as HTMLElement;
    let cardText = createElement("p", "MY-card-text", card) as HTMLElement;
    let button = createElement("button", "btn", card) as HTMLButtonElement;
    button.setAttribute("isFalse", "false");
    let toggle = createToggle(card)
    cardElements.push({ card, cardTitle, cardText,toggle,button });
    
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

  function createToggle(card: HTMLElement):HTMLInputElement {
    let toggle = createElement("label", "switch", card) as HTMLInputElement;
    let input = createElement("input", "toggle", toggle) as HTMLInputElement;
    input.type = "checkbox";
    let span = createElement("span", "slider", toggle);
    span.classList.add("round");
    return toggle
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
