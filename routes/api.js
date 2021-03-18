const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/add", (req, res) => {
  res.json({ info: "teste" });
});

router.get("/update", (req, res) => {
  res.json({ info: "teste" });
});

router.get("/list", (req, res) => {
  const options = {
    method: "POST",
    url: "https://dns.he.net/",
    headers: {
      cookie:
        "291541a0a47538f8ae75fdef92aca43c56e2b307832d37725210bb8ed950c8e4=ccec6c6db79ee23780956deb499672f6",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: { email: "ttayson", pass: "Ffarias" },
  };

  axios
    .request(options)
    .then(function (response) {
      // console.log(response.data);
      const $ = cheerio.load(response.data);
      const image = $("img");
      // value = $("img.Tips").attr("alt");

      value = $(".Tips").attr("alt", "delete");
      console.log(value);
      // $("img.Tips").each((i, elem) => {
      //   {
      //     console.log(elem);
      //   }
      // });
    })
    .catch(function (error) {
      console.error(error);
    });
});

router.get("/del", (req, res) => {
  res.json({ info: "teste" });
});

module.exports = router;
