const express = require("express");
const cheerio = require("cheerio");

var axios = require("axios");
var FormData = require("form-data");

const { getCookie } = require("../helpers/Cookie");

const router = express.Router();

router.post("/add", async (req, res) => {
  var Cookie = await getCookie();
  var data = new FormData();

  data.append("email", req.body.login);
  data.append("pass", req.body.pass);

  var config = {
    method: "post",
    url: "https://dns.he.net/",
    headers: {
      Cookie: Cookie,
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(config).then(function (response) {
    const $ = cheerio.load(response.data);

    loginVerify = $('div[id="dns_err"]').text();
    if (loginVerify == "Incorrect") {
      res.status(401).send({ error: "Login error" });
      return;
    }

    value = $("img.Tips").attr({
      alt: "delete",
    });

    var dataDomain = [];

    value.each((i, elem) => {
      if (
        value[i].attribs.name != undefined &&
        value[i].attribs.value != undefined
      ) {
        dataDomain.push({
          domain: value[i].attribs.name,
          id: value[i].attribs.value,
        });
      }
    });

    const result = dataDomain.find(
      (domain) => domain.domain == req.body.domain
    );
    if (!result) {
      res.status(404).send({ error: "Domain not found" });
      return;
    }
    res.json(dataDomain);
  });

  // data.append("account", "");
  // data.append("menu", "edit_zone");
  // data.append("Type", "A");
  // data.append("hosted_dns_zoneid", "934688");
  // data.append("hosted_dns_recordid", "");
  // data.append("hosted_dns_editzone", "1");
  // data.append("Priority", "");
  // data.append("Name", "olaaaaa.ttayson.cf");
  // data.append("Content", "20.50.50.50");
  // data.append("TTL", "300");
  // data.append("hosted_dns_editrecord", "Submit");

  // const config = {
  //   method: "POST",
  //   url: "https://dns.he.net/",
  //   params: {
  //     hosted_dns_zoneid: "934688",
  //     menu: "edit_zone",
  //     hosted_dns_editzone: "",
  //   },
  //   headers: {
  //     cookie: Cookie,
  //     ...data.getHeaders(),
  //   },
  //   data: data,
  // };
  // axios(config).then(function (response) {
  //   const $ = cheerio.load(response.data);

  //   loginVerify = $('div[id="dns_status"]').text();
  //   console.log(loginVerify);
  //   if (loginVerify == "Successfully added new record to ttayson.cf") {
  //     res.status(401).send({ error: "Login error" });
  //     return;
  //   }
});

router.get("/update", (req, res) => {
  res.json({ info: "teste" });
});

router.post("/list", async (req, res) => {
  var Cookie = await getCookie();
  var data = new FormData();
  data.append("email", req.body.login);
  data.append("pass", req.body.pass);

  var config = {
    method: "post",
    url: "https://dns.he.net/",
    headers: {
      Cookie: Cookie,
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      const $ = cheerio.load(response.data);

      loginVerify = $('div[id="dns_err"]').text();
      if (loginVerify == "Incorrect") {
        res.status(401).send({ error: "Login error" });
        return;
      }

      value = $("img.Tips").attr({
        alt: "delete",
      });

      var dataDomain = [];

      value.each((i, elem) => {
        if (
          value[i].attribs.name != undefined &&
          value[i].attribs.value != undefined
        ) {
          dataDomain.push({
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
        res.json(dataDomain);
      } else if (req.body.domain && req.body.domain != null) {
        const result = dataDomain.find(
          (domain) => domain.domain == req.body.domain
        );
        if (!result) {
          res.status(404).send({ error: "Domain not found" });
          return;
        }

        var data = new FormData();
        data.append("email", req.body.login);
        data.append("pass", req.body.pass);

        var config = {
          method: "get",
          url:
            "https://dns.he.net/index.cgi?hosted_dns_zoneid=" +
            result.id +
            "&menu=edit_zone&hosted_dns_editzone",
          headers: {
            Cookie: Cookie,
            ...data.getHeaders(),
          },
          data: data,
        };

        axios(config).then(function (response) {
          const $ = cheerio.load(response.data);

          var data = [];
          value = $("td").attr({
            align: "left",
          });

          value.each((i, elem) => {
            try {
              if (value[i].children[0].data != undefined) {
                data.push(value[i].children[0].data);
              } else {
                data.push(value[i].children[0].children[0].data);
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
