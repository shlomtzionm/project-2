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


class CoinData {
  [data:string]: { [key:string]: {USD: number} };

  constructor(data: { [key: string]: {USD: number} }) {
    this.data = data;
  }
}

class CoinCurrencyObject {
  type: 'line';
  label: string;
  data: number[];
  
  constructor(label: string, data: number[]) {
    this.type = 'line';
    this.label = label;
    this.data = data;
  }
}



let data:Coin[]
async function init() {
   data = await getInformation("list");
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

  for (let i = 0; i < cardElements.length; i++) {
    getCardInfo(cardElements[i], data[i]);
    handleButtons(cardElements[i], data[i]);
handleToggles(data[i],cardElements[i].toggle)  
checking(cardElements[i].toggle,data[i].symbol)
}
}



function handleToggles( data:Coin,toggle:HTMLInputElement,){
  toggle.addEventListener("click", function () {
  addToToggleObject(data.symbol)
    if(checkedTogglesMoreThenFive()){
      togglesState(toggle,data.symbol)
     showModal(modal,"block")
     
    }
    })
    }

    

    
    function checking(toggle:HTMLInputElement, key: string) {
      if (toggles[key] === true) {
       (toggle.checked = true)
      } else {
        (toggle.checked = false)
      }
    }

function checkedTogglesMoreThenFive():boolean{
  let checkedToggles = 0
  for (const key in toggles){
    if(toggles[key]===true){
      checkedToggles++
    }
  }
  return checkedToggles === 6
}



function addToToggleObject(key: string) {
  toggles[key] = !toggles[key];
}

function togglesState( toggle:HTMLInputElement,key:string) {
    toggle.checked = false
    toggles[key] = false
}

function handleButtons(cardElements:CardElements
  ,data:Coin){
  cardElements.button.addEventListener("click",() => {
    showSpinner(cardElements.spinner)
      buttonMoreInfo(cardElements, data)
       disableSpinner(cardElements.spinner)
     })  
}

function disableSpinner(spinner:HTMLElement){
spinner.style.display = "none"
}
function showSpinner(spinner:HTMLElement){
  spinner.style.display = "block"
}

function getCardInfo(cardElements:CardElements , 
  data:Coin) {
  cardElements.cardTitle.innerText = data.symbol;
  cardElements.cardText.innerText = data.name;
  cardElements.button.innerText = "more info";
}

async function buttonMoreInfo(cardElements: CardElements, data: Coin) {
  if (isButtonFalse(cardElements)) {
      await showCoinInfo(cardElements, data);
  } else {
      resetCardInfo(cardElements, data);
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

function resetCardInfo(cardElements: CardElements, coin: Coin,) {
  getCardInfo(cardElements, coin);
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
async function fetchData(key:string): Promise<CoinID|Coin[]|CoinData> {
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

  let filteredData:Coin[]
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
    return input
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
            exitLiveReports()
            changes(aboutPage,liveReportsPage,homePage)

            break;
          case "About":
            input.disabled = true;
            exitLiveReports()
            changes(homePage,liveReportsPage,aboutPage)

            break;
          case "Live Reports": 
            input.disabled = true;
          
            handleLive()
        

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
let saveChanges = document.querySelector(".saveChanges") as HTMLButtonElement
let UndoChangesButton = document.querySelector(".UndoChanges") as HTMLButtonElement

UndoChangesButton.addEventListener("click",function()
{showModal(modal,"none")})
 

function showModal(modal:HTMLElement,display:string){
  modal.style.display = display;
  getModalContent()
}


let modalContent = document.querySelector(".modalContent") as HTMLElement;

function getModalContent() {
    let keys: string[] = []; 
modalContent.innerText = ""
    for (const key in toggles) {
        if (toggles[key] === true) {
            let div = createElement("div", "modalToggle", modalContent);
            div.innerText = key;
            let toggle = createToggle(div);
            toggle.checked = true;
            keys.push(key);
        }
    }
}


function saveChangesToggleObject() {
  let modalToggles = document.querySelectorAll(".modalToggle") as NodeListOf<HTMLInputElement>;
  modalToggles.forEach((element) => {
    let input = element.querySelector(".toggle") as HTMLInputElement
    if (!input.checked) {
      addToToggleObject(element.innerText);
    }
  });
  showModal(modal,"none")
  if (filteredData && filteredData.length>0) {
    handleCards(filteredData); 
  } else {
    handleCards(data); 
  }

}

saveChanges.addEventListener("click",saveChangesToggleObject)


async function fetchChosenCoins(coins:string):Promise<CoinData>{
let res = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coins}&tsyms=USD`)
let data = await res.json()
return data
}

function coinsToFetch(): string {
  const chosenCoins: string[] = [];
  for (const key in toggles) {
    if (toggles[key] === true) {
      chosenCoins.push(`${key},`);
    }
  } 
  let chosenCoinString = chosenCoins.join(',');
  return chosenCoinString;
}

let chartCoins:CoinData;
async function handleLive() {
  chosenCoinsArray = []
  timeLabels = []
canvasContainer.innerHTML =""
  intervalId = setInterval(async () => {
  chartCoins =  await fetchChosenCoins(coinsToFetch());

  pushToChosenArray(chartCoins)
  timeLabels.push( getTimeForChart())
  updateChartDate()
  },3000);
}
let intervalId: number 

function exitLiveReports() {
  clearInterval(intervalId); 

}

function pushToChosenArray(chartCoins: CoinData) {
  chosenCoinsArray = [];

  for (const key in chartCoins) {
    if (!usdValues[key]) {
      usdValues[key] = [];
    }
    getCoinValuePerSeconde(+chartCoins[key].USD, key);
    chosenCoinsArray.push(new CoinCurrencyObject( key, (usdValues[key])));
  }
}

let usdValues:{[key:string]:number[]}= {}
let chosenCoinsArray: CoinCurrencyObject[] = []
const canvasContainer = document.querySelector('#canvasContainer') as HTMLElement


 let timeLabels:string[] = []

 function updateChartDate(){
  let chartData :Chart.ChartConfiguration= {
    data: {
      datasets: chosenCoinsArray,
      labels: timeLabels
    },
    options: {
      scales: {
    
      },
    },
    type: 'bar'
  }
  updateChartOrCreate(chartData)
}

function updateChartOrCreate(chartData:any) {
  if (canvasContainer.innerHTML === "") {
    createChart(chartData);
  } 
  else {
    myChart.update();
  }
}

let myChart: Chart;

function createChart(chartData:any) {
  canvasContainer.innerHTML = `<canvas id="myChart"></canvas>`;
  const canvas = document.getElementById('myChart') as HTMLCanvasElement;
  const ctx = canvas;
 myChart = new Chart(ctx, chartData)
  
}

  function getTimeForChart():string{
return  ( moment().format("h:mm:ss"));
  }

  function getCoinValuePerSeconde(value: number,key:string){
  usdValues[key].push(value)
  console.log(usdValues)
  }

  let welcomeSection = document.querySelector('.welcome') as HTMLElement;

  window.addEventListener('scroll', () => {
      
      const navbarHeight = document.getElementById('navBar') as HTMLElement;
      const navPosition = navbarHeight.offsetTop + navbarHeight.offsetHeight;

      const scrollPosition = window.scrollY;
      welcomeSection.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
  });
  

