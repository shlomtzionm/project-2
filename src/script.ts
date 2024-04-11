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
    market_data: { current_price: { usd: number; eur: number; ils: number } }
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
  button: HTMLElement;
  spinner: HTMLElement;

  constructor(
    spinner: HTMLElement,
    card: HTMLElement,
    cardTitle: HTMLElement,
    cardText: HTMLElement,
    toggle: HTMLInputElement,
    button: HTMLElement
  ) {
    this.button = button;
    this.spinner = spinner;
    this.card = card;
    this.cardText = cardText;
    this.cardTitle = cardTitle;
    this.toggle = toggle;
  }
}

class CoinData {
  [data: string]: { [key: string]: { USD: number } };
  constructor(data: { [key: string]: { USD: number } }) {
    this.data = data;
  }
}

class DatasetCoinForChart {
  type: "line";
  label: string;
  data: number[];
  borderColor: "black";
  Response?:"Error"

  constructor(label: string, data: number[],Response?:"Error" ) {
    this.type = "line";
    this.label = label;
    this.data = data;
    this.borderColor = "black",
    this.Response ="Error"
  }
}

let data: Coin[];

async function init() {
  data = await getInformation("list");
  handleCards(data,cardsCount);
}
init();

async function getInformation(key: string): Promise<CoinID>;
async function getInformation(key: "list"): Promise<Coin[]>;
async function getInformation(key: string): Promise<Coin[] | CoinID> {

  const dataFromLocalStorage = getDataFromLocalStorage(key);
  if (isDataEmpty(dataFromLocalStorage) || isDataOld(key)) {
    const newData = await fetchData(key);
    saveLocalStorage(newData, key);
    return newData;
  } else {
    return dataFromLocalStorage;
  }
}


function getDataFromLocalStorage(key: "list"): Coin[];
function getDataFromLocalStorage(key: string): CoinID;
function getDataFromLocalStorage(key: string): Coin[] | CoinID {
  if (localStorage[`${key}`]) {
    return JSON.parse(localStorage[`${key}`]);
  } else {
    return [];
  }
}


function isDataEmpty(data: Coin[] | CoinID): boolean {
  if (Array.isArray(data)) {  
    return data.length === 0;
  } else { 
    return Object.keys(data).length === 0;
  }
}

function isDataOld(key: string): boolean {
  const storedTTL = localStorage.getItem(`TTL ${key}`);
  if (!storedTTL) {
    return false;
  }
  return calcTime(storedTTL)
}

function calcTime(storedTTL:string):boolean{
  return new Date().getTime() - parseInt(storedTTL) > 2 * 60 * 1000;
}


async function fetchData(key: "list"): Promise<Coin[]>;
async function fetchData(key: string): Promise<CoinID>;
async function fetchData(key: string): Promise<CoinID | Coin[] | CoinData> {
  let res = await fetch(`https://api.coingecko.com/api/v3/coins/${key}`);
  let data = await res.json();
  return data;
}


function saveLocalStorage(data: CoinID | Coin[], key: string) {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(`TTL ${key}`, JSON.stringify(new Date().getTime()));
}


let toggles: { [key: string]: boolean } = {};

function handleCards(data: Coin[],amount:number) {
  cardContainer.innerHTML = "";
  let allCardsElements:CardElements[] = buildCardsElements(numberOfCardsOnPage(data,amount));
handleCardFeatures(allCardsElements,data)  
}

function handleCardFeatures(allCardsElements:CardElements[],data:Coin[]){
  for (let i = 0; i < allCardsElements.length; i++) {
    getCardInfo(allCardsElements[i], data[i]);
    handleButtons(allCardsElements[i], data[i]);
    handleToggles(data[i], allCardsElements[i].toggle);
    wasChecked(allCardsElements[i].toggle, data[i].symbol);
  }
}


function numberOfCardsOnPage(data: Coin[],amount:number): Coin[] {
  let slicedData = data.slice(0, amount) 
  console.log(cardsCount)
  return slicedData
}

function buildCardsElements(numberOfCardsOnPage: Coin[]): CardElements[] {
  const cardElements: {button: HTMLElement;card: HTMLElement;
     cardTitle: HTMLElement; cardText: HTMLElement; 
      toggle: HTMLInputElement;spinner: HTMLElement;}[] = [];

  for (let i = 0; i < numberOfCardsOnPage.length; i++) {
    let card = createElement("div", "myCard", cardContainer) as HTMLElement;
    let toggle = createToggle(card);
    let cardTitle = createElement("h5", "MY-card-title", card) as HTMLElement;
    let cardText = createElement("p", "MY-card-text", card) as HTMLElement;
    let button = createElement("button", "btn", card) as HTMLButtonElement;
    button.setAttribute("isFalse", "false");
    toggle.id = "myBtn";

    let spinner = createSpinner(card);
    cardElements.push({ card, cardTitle, cardText, toggle, button, spinner });
  }
  return cardElements;
}

function createElement(div: string, className: string, appendTo: HTMLElement) {
  let element = document.createElement(div);
  element.classList.add(className);
  appendTo.appendChild(element);
  return element;
}

function createToggle(card: HTMLElement): HTMLInputElement {
  let toggle = createElement("label", "switch", card) as HTMLInputElement;
  let input = createElement("input", "toggle", toggle) as HTMLInputElement;
  input.type = "checkbox";
  let span = createElement("span", "slider", toggle);
  span.classList.add("round");
  return input;
}

function createSpinner(appendTo: HTMLElement): HTMLElement {
  let border = createElement("div", "spinner-border", appendTo);
  border.setAttribute("role", "status");
  createElement("span", "sr-only", border);
  return border;
}


function getCardInfo(cardElements: CardElements, data: Coin) {
  cardElements.cardTitle.innerText = data.symbol;
  cardElements.cardText.innerText = data.name;
  cardElements.button.innerText = "more info";
}


function handleButtons(cardElements: CardElements, data: Coin) {
  cardElements.button.addEventListener("click", () => {
    showSpinner(cardElements.spinner);
    buttonMoreInfo(cardElements, data);
    disableSpinner(cardElements.spinner);
  });
}

function disableSpinner(spinner: HTMLElement) {
  spinner.style.display = "none";
}
function showSpinner(spinner: HTMLElement) {
  spinner.style.display = "block";
}



async function buttonMoreInfo(cardElements: CardElements, data: Coin) {
  if (isButtonFalse(cardElements)) {
    await showMoreInfo(cardElements, data);
  } else {
    resetCardInfo(cardElements, data);
  }
}

function isButtonFalse(cardElements: CardElements): boolean {
  return cardElements.button.getAttribute("isFalse") === "false";
}

async function showMoreInfo(cardElements: CardElements, coin: Coin) {
  clearCardText(cardElements);
  const coinData = await getInformation(coin.id);
  displayCurrency(cardElements.cardText, coinData);
  setButtonState(cardElements.button, true);
}


function displayCurrency(cardText: HTMLElement, coinData: CoinID) {
  let img = createElement("img", "img", cardText) as HTMLImageElement;
  img.src = coinData.image.small;
  curacyInfo("₪", "ils", cardText, coinData);
  curacyInfo("$", "usd", cardText, coinData);
  curacyInfo("€", "eur", cardText, coinData);
}

function curacyInfo(
  symbol: string,
  country: string,
  cardText: HTMLElement,
  coinData: CoinID
) {
  let div = createElement("div", country, cardText);
  div.innerHTML = `${ coinData.market_data.current_price[country as "usd" | "eur" | "ils"]
  } ${symbol}`;
}



function resetCardInfo(cardElements: CardElements, coin: Coin) {
  getCardInfo(cardElements, coin);
  setButtonState(cardElements.button, false);
}

function clearCardText(cardElements: CardElements) {
  cardElements.cardText.innerHTML = "";
}

function setButtonState(button: HTMLElement, state: boolean) {
  button.setAttribute("isFalse", state ? "true" : "false");
}


function handleToggles(data: Coin, toggle: HTMLInputElement) {
  toggle.addEventListener("click", function () {
    addToToggleObject(data.symbol);
    if (checkedTogglesMoreThenFive()) {
      changeDefaultState(toggle, data.symbol);
      showModal(modal, "block");
    }
  });
}

let checkedToggles:number
function checkedTogglesMoreThenFive(): boolean {
   checkedToggles = 0;
  for (const key in toggles) {
    if (toggles[key] === true) {
      checkedToggles++;
    }
  }
  return checkedToggles === 6;
}


function addToToggleObject(key: string) {
  toggles[key] = !toggles[key];
}

function changeDefaultState(toggle: HTMLInputElement, key: string) {
  toggle.checked = false;
  toggles[key] = false;
}

function showModal(modal: HTMLElement, display: string) {
  modal.style.display = display;
  handleModal();
}

function wasChecked(toggle: HTMLInputElement, key: string) {
  if (toggles[key] === true) {
    toggle.checked = true;
  } else {
    toggle.checked = false;
  }
}



function areTogglesChecked() :boolean{
  if (checkedToggles === 0 ||checkedToggles === undefined){
    return true
  } return false
}




let cardContainer = document.querySelector("#cardContainer") as HTMLElement;
let homePage = document.querySelector("#home") as HTMLElement;
let aboutPage = document.querySelector("#about") as HTMLElement;
let liveReportsPage = document.querySelector("#liveReports") as HTMLElement;
let input = document.querySelector(".input") as HTMLInputElement;
let btnArray = document.querySelectorAll(".navButton");
let searchButton = document.querySelector( ".search-button") as HTMLButtonElement;

searchButton.addEventListener("click", handleSearch);

let filteredData: Coin[];
async function handleSearch() {
  const inputValue = input.value.trim().toLocaleLowerCase();
  let dataFromLocalStorage = getDataFromLocalStorage("list");
  if (inputValue === "all") {
    handleCards(dataFromLocalStorage,20);
    loudMore.style.display = "block"
  } else {
    let filteredData = handleFilteredData(dataFromLocalStorage, inputValue)
    handleCards(filteredData, filteredData.length);
    loudMore.style.display = "none"
  }
}



function handleFilteredData(data: Coin[], inputValue: string): Coin[] {
  const filteredData = data.filter(
    (coin) => coin.symbol.toLowerCase() === inputValue); 
  if (filteredData.length === 0) {
    alert("We didn't find that, try again!");
    return data;
  } else {
    return filteredData;
  }
}




function changePageContent() {
  btnArray.forEach((btn) => {
    btn.addEventListener("click", function () {
      switch (btn.innerHTML) {
        case "Home":
          input.disabled = false;
          exitLiveReports();
          pageToDisplay(aboutPage, liveReportsPage, homePage);

          break;
        case "About":
          input.disabled = true;
          exitLiveReports();
          pageToDisplay(homePage, liveReportsPage, aboutPage);

          break;
        case "Live Reports":
          input.disabled = true;
          if (!areTogglesChecked()) {
            pageToDisplay(homePage, aboutPage, liveReportsPage);
            handleLive();
          } else {
            alert("please choose some coins");
          }

          break;
      }
    });
  });
}
changePageContent();

function pageToDisplay(none1: HTMLElement, none2: HTMLElement, block: HTMLElement) {
  none1.style.display = "none";
  none2.style.display = "none";
  block.style.display = "block";
}

const modal = document.getElementById("myModal") as HTMLElement;
let modalContent = document.querySelector(".modalContent") as HTMLElement;
let saveChanges = document.querySelector(".saveChanges") as HTMLButtonElement;
let UndoChangesButton = document.querySelector(".UndoChanges") as HTMLButtonElement;

UndoChangesButton.addEventListener("click", function () {
  showModal(modal, "none");
});


saveChanges.addEventListener("click", saveChangesToggleObject);



function handleModal() {
  modalContent.innerText = "";
  getModalContent()
}

function getModalContent(){
  for (const key in toggles) {
    if (toggles[key] === true) {
      let div = createElement("div", "modalToggle", modalContent);
      div.innerText = key;
      let toggle = createToggle(div);
      toggle.checked = true;

    }
  }
}

function saveChangesToggleObject() {
  let modalToggles = document.querySelectorAll(".modalToggle"
) as NodeListOf<HTMLInputElement>;
  modalToggles.forEach((element) => {
    let input = element.querySelector(".toggle") as HTMLInputElement;
    if (!input.checked) {
      addToToggleObject(element.innerText);
    }
  });
  showModal(modal, "none");
  if (filteredData && filteredData.length > 0) {
    handleCards(filteredData, filteredData.length);
  } else {
    handleCards(data, 20);
  }
}






async function handleLive() {
  resetChartData();
  handleInterval();
}

function exitLiveReports() {
  clearInterval(intervalId);
}

let intervalId: number;
let chartCoins: CoinData;
function handleInterval() {
  intervalId = setInterval(async () => {
    chartCoins = await fetchChosenCoins(whichCoinsToFetch());
    pushToCoinsDataset(chartCoins);
    timeLabels.push(getTimeForChart());
    updateChartOrCreate();
  }, 2000);
}

async function fetchChosenCoins(coins: string): Promise<CoinData> {
  let res = await fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coins}&tsyms=USD`
  );
  let data = await res.json();
  return data;
}

function whichCoinsToFetch(): string {
  const chosenCoins: string[] = [];
  for (const key in toggles) {
    if (toggles[key] === true) {
      chosenCoins.push(key);
    }
  }
  let chosenCoinString = chosenCoins.join(",");
  return chosenCoinString;
}


let usdValues: { [key: string]: number[] } = {};
let coinsDataset: DatasetCoinForChart[] = [];

function resetChartData() {
  usdValues={}
  coinsDataset = [];
  timeLabels = [];
  canvasContainer.innerHTML = "";
}

function pushToCoinsDataset(chartCoins: CoinData) {
  coinsDataset = [];

  for (const key in chartCoins) {
    if (chartCoins.Response){
     
      alert("we dont have information about this coin")
      pageToDisplay(liveReportsPage,aboutPage,homePage)
      clearInterval(intervalId)
      break
      
    }
    if (!usdValues[key]) {
      usdValues[key] = [];
    }
    getCoinValuePerSeconde(+chartCoins[key].USD, key);
    if(!chartCoins.Response){
      coinsDataset.push(new DatasetCoinForChart(key, usdValues[key]))
  } 
}}


const canvasContainer = document.querySelector(
  "#canvasContainer"
) as HTMLElement;

let timeLabels: string[] = [];

function updateChartOrCreate() {
  if (canvasContainer.innerHTML === "") {
    createChart();
  }
  myChart.update();
}

let myChart: Chart;

function createChart() {
  canvasContainer.innerHTML = `<canvas id="myChart" ></canvas>`;
  const canvas = document.getElementById("myChart") as HTMLCanvasElement;
  const ctx = canvas;
  myChart = new Chart(ctx, {
    data: {
      datasets: coinsDataset,
      labels: timeLabels,
    },
    options: {
      layout:{
        padding:{
          left:80,
          right:80,
          bottom:20,
          top:20,
        } 
      },  
    },
    type: "bar",
  });
  
}


function getTimeForChart(): string {
  return moment().format("h:mm:ss");
}

function getCoinValuePerSeconde(value: number, key: string) {
  usdValues[key].push(value);
}

let welcomeSection = document.querySelector(".welcome") as HTMLElement;

window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;
  welcomeSection.style.transform = "translateY(" + scrollPosition * 0.5 + "px)";
});

let cardsCount = 20
let loudMore = document.querySelector("#loudMore") as HTMLButtonElement
loudMore.addEventListener("click",showMoreCards)
function showMoreCards(){
cardsCount = cardsCount+20
handleCards(data,cardsCount)
}