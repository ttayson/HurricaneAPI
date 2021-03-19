const express = require("express");
const cheerio = require("cheerio");

var axios = require("axios");
var FormData = require("form-data");

const router = express.Router();

router.get("/add", (req, res) => {
  res.json({ info: "teste" });
});

router.get("/update", (req, res) => {
  res.json({ info: "teste" });
});

router.post("/list", (req, res) => {
  var data = new FormData();
  data.append("email", req.body.login);
  data.append("pass", req.body.pass);

  var config = {
    method: "post",
    url: "https://dns.he.net/",
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      const $ = cheerio.load(response.data);
      value = $("img.Tips").attr({
        alt: "delete",
      });

      var date = [];
      value.each((i, elem) => {
        if (
          value[i].attribs.name != undefined &&
          value[i].attribs.value != undefined
        ) {
          date.push({
            domain: value[i].attribs.name,
            id: value[i].attribs.value,
          });
        }
      });
      if (
        !req.body.domain ||
        typeof req.body.domain == undefined ||
        req.body.domain == null
      ) {
        res.json(date);
      } else {
        var data = new FormData();
        data.append("email", req.body.login);
        data.append("pass", req.body.pass);

        var config = {
          method: "get",
          url:
            "https://dns.he.net/index.cgi?hosted_dns_zoneid=934688&menu=edit_zone&hosted_dns_editzone",
          headers: {
            Cookie:
              "291541a0a47538f8ae75fdef92aca43c56e2b307832d37725210bb8ed950c8e4=1aa2dd6b50e06730c6a9a737c3458aeb",
            ...data.getHeaders(),
          },
          data: data,
        };

        axios(config).then(function (response) {
          const $ = cheerio.load(response.data);

          var data = [];
          value3 = $("td").attr({
            align: "left",
          });

          value3.each((i, elem) => {
            try {
              if (value3[i].children[0].data != undefined) {
                data.push(value3[i].children[0].data);
              } else {
                data.push(value3[i].children[0].children[0].data);
              }
            } catch (error) {}
          });

          list = [];

          length = data.length;
          temp = length / 8;

          let i = 0;
          do {
            i++;
            list.push({
              name: data[2],
              type: data[3],
              ttl: data[4],
              priority: data[5],
              data: data[6],
              id: data[1],
            });
            console.log(i);

            data.splice(0, 8);
          } while (i < temp);

          res.json(list);
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.get("/del", (req, res) => {
  res.json({ info: "teste" });
});

module.exports = router;
