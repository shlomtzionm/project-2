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

  (async function () {
    let data = (await saveLocalStorage("list")) as Coin[];
    buildCard(data);
  })();

  let cardContainer = document.querySelector("#cardContainer") as HTMLElement;
  let searchButton = document.querySelector(
    ".search-button"
  ) as HTMLButtonElement;

  searchButton.addEventListener("click", handleSearch);

  async function handleSearch() {
    let inputValue = (
      document.querySelector(".input") as HTMLInputElement
    ).value.toLocaleLowerCase();
    let dataFromLS = JSON.parse(localStorage["list"]) as Coin[];
    if (inputValue === "all") {
      buildCard(dataFromLS);
    } else {
      let filteredData = dataFromLS.filter(
        (coin) => coin.symbol.toLowerCase() === inputValue
      );
      
      buildCard(filteredData);
    }
  }

  function buildCard(data: Coin[]) {
    cardContainer.innerHTML = "";

    
    let cardsToShow = data.length > 100 ? data.slice(0, 10) : data;
    for (let i = 0; i < cardsToShow.length; i++) {
      let card = createElement("div", "card", cardContainer) as HTMLElement;
      createToggle(card);

      let cardTitle = createElement("h5", "card-title", card) as HTMLElement;
      let cardText = createElement("p", "card-text", card) as HTMLElement;
      let button = createElement("button", "btn", card) as HTMLButtonElement;
      button.setAttribute("isFalse", "false");

      handelCardInfo(cardTitle, cardText, button, cardsToShow, i);
      button.addEventListener("click", (event) =>
        handelInfoButton(button, cardText, cardsToShow, i, cardTitle)
      );
    }
    // let toggles = document.querySelectorAll(".toggle");
    // handleToggles(toggles);
  }
  // function handleToggles(toggles: NodeListOf<Element>) {
  //   let checkedToggles = 0 ;

  //   toggles.forEach((toggle) => {
  //     toggle.addEventListener("click", function () {
  //       if (checkedToggles < 4) {
  //         checkedToggles++;
  //         console.log(checkedToggles)
  //       } else {
  //         toggles.forEach((toggle) => {
  //           toggle.setAttribute("disabled", "true");
  //         });
  //       }
  //     });
  //   });
  // }

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
    if (!localStorage[key]) {
      data = await fetchData(key);
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      data = JSON.parse(localStorage[key]);
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

  let homePage = document.querySelector("#home") as HTMLElement;
  let aboutPage = document.querySelector("#about") as HTMLElement;
  let liveReportsPage = document.querySelector("#liveReports") as HTMLElement;
  let btnArray = document.querySelectorAll(".navButton");

  function changePageContent() {
    btnArray.forEach((btn) => {
      btn.addEventListener("click", function () {
        switch (btn.innerHTML) {
          case "Home":
            homePage.style.display = "block";
            aboutPage.style.display = "none";
            liveReportsPage.style.display = "none";
            break;
          case "About":
            homePage.style.display = "none";
            aboutPage.style.display = "block";
            liveReportsPage.style.display = "none";
            break;
          case "Live Reports":
            homePage.style.display = "none";
            aboutPage.style.display = "none";
            liveReportsPage.style.display = "block";
            break;
        }
      });
    });
  }
  changePageContent();
});
