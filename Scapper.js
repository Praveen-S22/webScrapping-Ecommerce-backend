const axios = require("axios");
const cheerio = require("cheerio");
const { first } = require("cheerio/lib/api/traversing");
const startBrowser = require("./browser");

const fetchShelves = async (userInput) => {
  try {
    let headers = {
      headers: {
        Accept: "application/json",
        "User-Agent": "axios 0.21.1",
      },
    };

    //For AMAZON
    const azpage = await axios.get(
      `https://www.amazon.in/s?k=${userInput}`,
      headers
    );
    var $ = cheerio.load(azpage.data);
    const amazonItem = $("div.s-result-item.s-widget-spacing-small");
    const amazonTitle = amazonItem.find(".a-size-medium").first().text();
    const amazonOfferPrice = amazonItem
      .find("span .a-price-whole")
      .first()
      .text();
    const amazonPrice = amazonItem
      .find('span.a-text-price [aria-hidden="true"]')
      .first()
      .text();
    const amazonImage = amazonItem.find("img").first().attr("src");
    let amazonStars = amazonItem.find("i.a-icon-star-small").first().text();
    amazonStars = amazonStars.split(" ");
    amazonStars = Math.floor(amazonStars[0]);

    const amazon = {
      site: "amazon",
      image: amazonImage,
      rating: amazonStars,
      price: amazonPrice,
      offerPrice: amazonOfferPrice,
    };
    //  console.log(amazon) ;

    //FOR FLIPKART
    const fkpage = await axios.get(
      `https://www.flipkart.com/search?q=${userInput}`,
      headers
    );
    var $ = cheerio.load(fkpage.data);
    const flipkartItem = $('[data-id*="MOB"]');
    const flipkartTitle = flipkartItem.find("a .row div div").first().text();
    const flipkartOfferPrice = flipkartItem
      .find(".col:nth-child(2) div div div")
      .first()
      .text();
    const flipkartPrice = flipkartItem
      .find(".col:nth-child(2) div div div:nth-child(2)")
      .first()
      .text();
    const flipkartImage = flipkartItem.find("img").first().attr("src");
    let flipkartStars = flipkartItem
      .find("[id*='productRating'] div")
      .first()
      .text();
    flipkartStars = Math.floor(flipkartStars);
    const flipkart = {
      site: "flipkart",
      image: flipkartImage,
      rating: flipkartStars,
      price: flipkartPrice,
      offerPrice: flipkartOfferPrice,
    };
    // console.log(flipkart) ;

    

    let dataObject = {
      title: flipkartTitle.toLowerCase(),
      amazon,
      flipkart
    };
    return dataObject;
  } catch (error) {
    console.log(error);
  }
};

module.exports = fetchShelves;
