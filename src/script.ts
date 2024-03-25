document.addEventListener("DOMContentLoaded", function () {
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

  let homePage = document.querySelector("#home") as HTMLElement;
  let aboutPage = document.querySelector("#about") as HTMLElement;
  let liveReportsPage = document.querySelector("#liveReports") as HTMLElement;
  let input = document.querySelector(".input") as HTMLInputElement;
  let btnArray = document.querySelectorAll(".navButton");

  (async function () {
    let spinnerElement: HTMLElement = spinner(homePage);
    let data = (await saveLocalStorage("list")) as Coin[];
    spinnerElement.style.display = "none";
    cardDetails(data);
  })();

  let cardContainer = document.querySelector("#cardContainer") as HTMLElement;
  let searchButton = document.querySelector(
    ".search-button"
  ) as HTMLButtonElement;

  searchButton.addEventListener("click", handleSearch);

  async function handleSearch() {
    let inputValue = (
      document.querySelector(".input") as HTMLInputElement
    ).value
      .trim()
      .toLocaleLowerCase();
    let dataFromLS = JSON.parse(localStorage["list"]) as Coin[];
    if (inputValue === "all") {
      cardDetails(dataFromLS);
    } else {
      let filteredData = dataFromLS.filter(
        (coin) => coin.symbol.toLowerCase() === inputValue
      );
      if (filteredData.length === 0) {
        alert("we didnt fined that, try again!");
      } else {
        cardDetails(filteredData);
      }
    }
  }

  function buildCards(cardsToShow: Coin[]) {
    for (let i = 0; i < cardsToShow.length; i++) {
      let card = createElement("div", "myCard", cardContainer) as HTMLElement;
      createToggle(card);

      let cardTitle = createElement("h5", "MY-card-title", card) as HTMLElement;
      let cardText = createElement("p", "MY-card-text", card) as HTMLElement;
      let button = createElement("button", "btn", card) as HTMLButtonElement;
      button.setAttribute("isFalse", "false");

      handelCardInfo(cardTitle, cardText, button, cardsToShow, i);
      button.addEventListener("click", (event) => {
        handelInfoButton(button, cardText, cardsToShow, i, cardTitle);
      });
    }
  }

  function cardDetails(data: Coin[]) {
    cardContainer.innerHTML = "";
    let cardsToShow = data.length > 100 ? data.slice(0, 10) : data;
    buildCards(cardsToShow);
    const toggles = document.querySelectorAll('input[type="checkbox"]');
    handleToggles(toggles);
  }

  function handleToggles(toggles: NodeListOf<Element>) {
    toggles.forEach((toggle) => {
      toggle.addEventListener("click", (event) =>
        toggleChangeHandler(event, toggles)
      );
    });
  }

  let checkedToggles = 0;
  function toggleChangeHandler(event: Event, toggles: NodeListOf<Element>) {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      checkedToggles++;
    } else {
      checkedToggles--;
    }

    if (checkedToggles >= 5) {
      toggles.forEach((toggle) => {
        if (!(toggle as HTMLInputElement).checked) {
          (toggle as HTMLInputElement).setAttribute("disabled", "true"); } });
    } else {
      toggles.forEach((toggle) => {
        (toggle as HTMLInputElement).removeAttribute("disabled");
      });
    }
  }

  function createToggle(card: HTMLElement) {
    let toggle = createElement("label", "switch", card) as HTMLInputElement;
    let input = createElement("input", "toggle", toggle) as HTMLInputElement;
    input.type = "checkbox";
    let span = createElement("span", "slider", toggle);
    span.classList.add("round");
  }

  function handelInfoButton(
    button: HTMLButtonElement,
    cardText: HTMLElement,
    data: Coin[],
    i: number,
    cardTitle: HTMLElement
  ) {
    spinner(cardText);
    debugger;
    if (button.getAttribute("isFalse") === "false") {
      cardText.innerHTML = "";
      moreInfo(data, i, cardText);
      button.setAttribute("isFalse", "true");
    } else {
      handelCardInfo(cardTitle, cardText, button, data, i);
      cardText.innerHTML = data[i].id;
      button.setAttribute("isFalse", "false");
    }
  }

  async function saveLocalStorage(key: string): Promise<Coin[] | CoinID> {
    let data: Coin[] | CoinID;
    let storedTTL = new Date(localStorage.getItem(`TTL ${key}`) as string);
    let currentDate = new Date().getTime();
    if (currentDate - storedTTL.getTime() < 2 * 60 * 1000) {
      data = JSON.parse(localStorage.getItem(key) as string);
    } else {
      data = await fetchData(key);
      localStorage.setItem(`TTL ${key}`, JSON.stringify(new Date()));
      localStorage.setItem(key, JSON.stringify(data));
    }
    return data;
  }

  async function fetchData(parameter: string): Promise<Coin[] | CoinID> {
    let res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${parameter}`
    );
    let data = await res.json();
    return data;
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

  async function moreInfo(data: Coin[], i: number, cardText: HTMLElement) {
    let coinData = (await saveLocalStorage(data[i].id)) as CoinID;
    let img = createElement("img", "img", cardText) as HTMLImageElement;
    img.src = coinData.image.small;
    let ils = currentPrice(coinData, cardText, "ils");
    ils.innerText += " ₪";
    let eur = currentPrice(coinData, cardText, "eur");
    eur.innerText += "  €";
    let usd = currentPrice(coinData, cardText, "usd");
    usd.innerText += " $";
  }

  function handelCardInfo(
    cardTitle: HTMLElement,
    cardText: HTMLElement,
    button: HTMLButtonElement,
    data: Coin[],
    i: number
  ) {
    cardTitle.innerText = data[i].symbol;
    cardText.innerText = data[i].name;
    button.innerText = "more info";
  }

  function currentPrice(
    coinData: CoinID,
    cardText: HTMLElement,
    country: string
  ): HTMLElement {
    let div = createElement("div", country, cardText);
    let currency = coinData.market_data.current_price;
    let price = currency[country as keyof typeof currency];
    div.innerText = price ? price.toString() : "Price not available";
    return div;
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

  function spinner(appendTo: HTMLElement): HTMLElement {
    let border = createElement("div", "spinner-border", appendTo);
    border.setAttribute("role", "status");
    createElement("span", "sr-only", border);
    return border;
  }
});

function alretToggles(){
  alert("you must choose up to five coins!")
}
