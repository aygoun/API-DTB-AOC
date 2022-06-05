const express = require("express");
const app = express();

app.listen(8080, () => {
  console.log("LISTENING")
})

app.get('/win/:pseudo_time', (req, res) => {
    const pseudo = req.params.pseudo_time.split("_")[0];
    const time = req.params.pseudo_time.split("_")[1];
    console.log(pseudo + " has WON in: " + time)
    res.status(200).json("OK");
})

app.get("/lost/:pseudo", (req, res) => {
  console.log(req.params.pseudo + " has LOST!");
  res.status(200).json("OK");
});