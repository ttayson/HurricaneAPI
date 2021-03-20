const express = require("express");
const bodyParser = require("body-parser");
const api = require("./routes/api");

const app = express();

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", api);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running!!");
});
