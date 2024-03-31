
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


class CardElements {
  card: HTMLElement;
   cardTitle: HTMLElement; 
   cardText: HTMLElement;
   toggle: HTMLInputElement;
   button:HTMLElement;
   spinner:HTMLElement

  constructor(spinner:HTMLElement,card: HTMLElement, cardTitle: HTMLElement, cardText: HTMLElement,toggle: HTMLInputElement,button:HTMLElement) {
     this.button = button;
     this.spinner = spinner
     this.card = card;
     this.cardText = cardText;
     this.cardTitle = cardTitle;
     this.toggle = toggle
  }
}

async function init() {
  let data = await getInformation("list");
handleCards(data)
}
init()


async function getInformation(key:string) :Promise<CoinID>
async function getInformation(key:"list"): Promise<Coin[]> 
async function getInformation(key:string): Promise<Coin[]| CoinID>  {
  const dataFromLS = getDataFromLS(key);
  if (isDataEmpty(dataFromLS) || isDataOld(`TTL ${key}`)) {
      const newData = await fetchData(key);
      saveLocalStorage(newData,key);
      return newData;
  } else {
      return dataFromLS;
  }
}

function saveLocalStorage(data: CoinID | Coin[], key:string) {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(`TTL ${key}`, JSON.stringify(new Date().getTime()));
}


function isDataOld(item:string): boolean {
  const storedTTL = localStorage.getItem(`TTL ${item}`); 
  if (!storedTTL) {
    return false; 
  }
  return new Date().getTime() - parseInt(storedTTL) > 2 * 60 * 1000; 
}

let toggles: { [key: string]: boolean } = {};

function handleCards(data: Coin[]) {
  cardContainer.innerHTML = "";
  let cardElements = buildCardsElements(numberOfCardsOnPage(data)); 
  let togglesA = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>

  for (let i = 0; i < cardElements.length; i++) {
    getCardInfo(cardElements[i], data, i);
    handleButtons(cardElements, data, i);
checking(togglesA,i,data[i].id)
handleToggles(data[i],togglesA,i)  
}
}



function handleToggles( data:Coin,togglesA:NodeListOf<HTMLInputElement>,i:number){
  togglesA[i].addEventListener("click", function () {
  addToToggleObject(data.id)
    if(checkedTogglesMoreThenFive()){
      togglesState( togglesA,i,data.id)
     showModal(modal,"block")
    span.addEventListener("click",function(){showModal(modal,"none")})
    }
    })
    }

    
    function checking(togglesA:NodeListOf<HTMLInputElement>,i:number, key: string) {
      if (toggles[key] === true) {
       (togglesA[i].checked = true)
      }
    }

function checkedTogglesMoreThenFive():boolean{
  let checkedToggles = 0
  for (const key in toggles){
    if(toggles[key]===true){
      checkedToggles++
    }
  }
  console.log(checkedToggles)
  return checkedToggles === 6
}



function addToToggleObject(key: string) {
  toggles[key] = !toggles[key];
}

function togglesState( togglesA: NodeListOf<HTMLInputElement>,i:number,key:string) {
    togglesA[i].checked = false
    toggles[key] = false
}

function handleButtons(cardElements:CardElements[]
  ,data:Coin[],i:number){
  cardElements[i].button.addEventListener("click",() => {
    showSpinner(cardElements[i].spinner)
      buttonMoreInfo(cardElements[i], data, i)
       disableSpinner(cardElements[i].spinner)
     })  
}

function disableSpinner(spinner:HTMLElement){
spinner.style.display = "none"
}
function showSpinner(spinner:HTMLElement){
  spinner.style.display = "block"
}

function getCardInfo(cardElements:CardElements , 
  data:Coin[], i:number) {
  cardElements.cardTitle.innerText = data[i].symbol;
  cardElements.cardText.innerText = data[i].name;
  cardElements.button.innerText = "more info";
  cardElements.toggle.checked = data[i].isChecked;
}

async function buttonMoreInfo(cardElements: CardElements, data: Coin[], i: number) {
  if (isButtonFalse(cardElements)) {
      await showCoinInfo(cardElements, data[i]);
  } else {
      resetCardInfo(cardElements, data,i);
  }
}

function isButtonFalse(cardElements: CardElements): boolean {
  return cardElements.button.getAttribute("isFalse") === "false";
}

async function showCoinInfo(cardElements: CardElements, coin: Coin) {
  clearCardText(cardElements);
  const coinData = await getInformation(coin.id);
  displayCoinInfo(cardElements.cardText, coinData);
  setButtonState(cardElements.button, true);
}

function resetCardInfo(cardElements: CardElements, coin: Coin[],i:number) {
  getCardInfo(cardElements, coin,i);
  setButtonState(cardElements.button, false);
}

function clearCardText(cardElements: CardElements) {
  cardElements.cardText.innerHTML = "";
}

function setButtonState(button: HTMLElement, state: boolean) {
  button.setAttribute("isFalse", state ? "true" : "false");
}



function displayCoinInfo(cardText:HTMLElement,coinData:CoinID){
  let img = createElement("img", "img", cardText) as HTMLImageElement;
  img.src = coinData.image.small;
  curacyInfo("₪","ils",cardText,coinData)
  curacyInfo("$","usd",cardText,coinData)
  curacyInfo("€","eur",cardText,coinData)
}

function curacyInfo(symbol: string, country: string, cardText: HTMLElement, coinData: CoinID) {
  let div = createElement("div", country, cardText);
  div.innerHTML = `${coinData.market_data.current_price[country as 'usd' | 'eur' | 'ils']} ${symbol}`;
}


function numberOfCardsOnPage(data:Coin[]):Coin[]{
return  data.length > 100 ? data.slice(0, 10) : data;
}

let cardContainer = document.querySelector("#cardContainer") as HTMLElement;


async function fetchData(key:"list"): Promise<Coin[]>
async function fetchData(key:string): Promise<CoinID>
async function fetchData(key:string): Promise<CoinID|Coin[]> {
  let res = await fetch(`https://api.coingecko.com/api/v3/coins/${key}`);
  let data = await res.json();
  return data;
}



function isDataEmpty(data: Coin[] | CoinID): boolean {
   if (Array.isArray(data)){
    return data.length === 0
   } else{
    return Object.keys(data).length === 0;
   }
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

function buildCardsElements(numberOfCardsOnPage: Coin[]): CardElements[] {
  const cardElements: { button:HTMLElement,card: HTMLElement, cardTitle: HTMLElement, cardText: HTMLElement,toggle: HTMLInputElement,spinner:HTMLElement }[] = [];

  for (let i = 0; i < numberOfCardsOnPage.length; i++) {
    let card = createElement("div", "myCard", cardContainer) as HTMLElement;
    let toggle = createToggle(card)
    let cardTitle = createElement("h5", "MY-card-title", card) as HTMLElement;
    let cardText = createElement("p", "MY-card-text", card) as HTMLElement;
    let button = createElement("button", "btn", card) as HTMLButtonElement;
    button.setAttribute("isFalse", "false");
   toggle.id ="myBtn"
  
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





 
  let searchButton = document.querySelector(
    ".search-button"
  ) as HTMLButtonElement;

  searchButton.addEventListener("click", handleSearch);

  async function handleSearch() {
    const inputValue = getInputValue().trim().toLocaleLowerCase();
    let dataFromLS = getDataFromLS("list");
  
    if (inputValue === "all") {
      handleCards(dataFromLS);
    } else {
     dataFromLS = handleFilteredData(dataFromLS,inputValue)
      handleCards(dataFromLS);
    }
  }
  
  function getInputValue(): string {
    const inputElement = document.querySelector(".input") as HTMLInputElement;
    return inputElement.value;
  }
  
 
  

  function handleFilteredData(data: Coin[], inputValue: string): Coin[] {
    const filteredData = data.filter((coin) => coin.symbol.toLowerCase() === inputValue);
    if (filteredData.length === 0) {
      alert("We didn't find that, try again!");
      return data
    } else {
     return filteredData;
    }
  }
  


  function createToggle(card: HTMLElement):HTMLInputElement {
    let toggle = createElement("label", "switch", card) as HTMLInputElement;
    let input = createElement("input", "toggle", toggle) as HTMLInputElement;
    input.type = "checkbox";
    let span = createElement("span", "slider", toggle);
    span.classList.add("round");

    
    return toggle
  }



  

  

function getDataFromLS(key:"list") : Coin[]
function getDataFromLS(key:string): CoinID
function getDataFromLS(key:string): Coin[] | CoinID {
  if (localStorage[`${key}`]) {
    return JSON.parse(localStorage[`${key}`]);
  } else {
    return [];
  }
}


  function changePageContent() {
    btnArray.forEach((btn) => {
      btn.addEventListener("click", function () {
        switch (btn.innerHTML) {
          case "Home":
            input.disabled = false;
            changes(aboutPage,liveReportsPage,homePage)
            break;
          case "About":
            input.disabled = true;
            changes(homePage,liveReportsPage,aboutPage)
            break;
          case "Live Reports":
            input.disabled = true;
            changes(homePage,aboutPage,liveReportsPage)
            break;
        }
      });
    });
  }
  changePageContent();

  function changes(none1: HTMLElement, none2: HTMLElement, block:HTMLElement){
none1.style.display = "none"
none2.style.display = "none"
block.style.display = "block"
}

const modal = document.getElementById("myModal") as HTMLElement;
let span = document.querySelector(".close") as HTMLButtonElement




  // window.onclick = function(event) {
  //   if (event.target !== modal) {
  //     modal.style.display = "none";
  //   }
  // }
  // }   

function showModal(modal:HTMLElement,display:string){
  modal.style.display = display;
}


