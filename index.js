const express = require("express");
const app = express();
var cors = require("cors");
const Products = require("./SearchObject");
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const fetchShelves = require("./Scrapper");

mongoose.connect(
  (error) => {
    if (!error) {
      console.log("Connected to the database");
    } else console.log(error);
  }
);

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  let document = await Products.find();
  res.send(document);
});

app.post("/", async (req, res) => {
  let inputSearch = req.body.query.toLowerCase();
  let document = await Products.find().exec();
  const presence = document.filter((res) => res.title.includes(inputSearch));
  if (presence.length >= 1) res.send({ response: "present" });
  else {
    let product = new Products(await fetchShelves(inputSearch));
    product.save();
    res.send({ response: "Added" });
  }
});
app.listen(port, () => {
  console.log("Server is started!!");
});

function callEveryTwelveHour() {
  setInterval(yourFunction, 1000 * 60 * 60);
}
