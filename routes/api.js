const express = require("express");
const cheerio = require("cheerio");

var axios = require("axios");
var FormData = require("form-data");

const { getCookie } = require("../helpers/Cookie");

const router = express.Router();

router.post("/add", async (req, res) => {
  if (
    req.body.login == undefined ||
    req.body.login == "" ||
    req.body.pass == undefined ||
    req.body.pass == ""
  ) {
    res.status(404).send({
      success: "incomplete information (Herder JSON Body",
    });
    return;
  }
  var Cookie = await getCookie();
  var data = new FormData();

  data.append("email", req.body.login);
  data.append("pass", req.body.pass);

  var getDomainconfig = {
    method: "post",
    url: "https://dns.he.net/",
    headers: {
      Cookie: Cookie,
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(getDomainconfig).then(function (response) {
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

    if (
      req.body.type == undefined ||
      req.body.type == "" ||
      req.body.name == undefined ||
      req.body.name == "" ||
      req.body.data == undefined ||
      req.body.data == "" ||
      req.body.ttl == undefined ||
      req.body.ttl == ""
    ) {
      res.status(404).send({
        success: "incomplete information (Herder JSON Body",
      });
      return;
    }

    if (
      req.body.ttl == "300" ||
      req.body.ttl == "900" ||
      req.body.ttl == "1800" ||
      req.body.ttl == "3600" ||
      req.body.ttl == "7200" ||
      req.body.ttl == "14400" ||
      req.body.ttl == "28800" ||
      req.body.ttl == "43200" ||
      req.body.ttl == "86400" ||
      req.body.ttl == "172800"
    ) {
    } else {
      res.status(404).send({
        success: "Invalid value (TTL)",
      });
      return;
    }

    var data = new FormData();

    data.append("email", req.body.login);
    data.append("pass", req.body.pass);
    data.append("account", "");
    data.append("menu", "edit_zone");
    data.append("Type", req.body.type);
    data.append("hosted_dns_zoneid", result.id);
    data.append("hosted_dns_recordid", "");
    data.append("hosted_dns_editzone", "1");
    data.append("Priority", "");
    data.append("Name", req.body.name);
    data.append("Content", req.body.data);
    data.append("TTL", req.body.ttl);
    data.append("hosted_dns_editrecord", "Submit");

    const config = {
      method: "POST",
      url: "https://dns.he.net/",
      params: {
        hosted_dns_zoneid: result.id,
        menu: "edit_zone",
        hosted_dns_editzone: "",
      },
      headers: {
        cookie: Cookie,
        ...data.getHeaders(),
      },
      data: data,
    };

    axios(config).then(function (response) {
      const $ = cheerio.load(response.data);

      loginVerify = $('div[id="dns_status"]').text();

      if (loginVerify) {
        res.status(200).send({
          success: loginVerify,
        });
        return;
      }

      statusError = $('div[id="dns_err"]').text();
      if (statusError) {
        res.status(404).send({
          error: statusError,
        });
        return;
      }
    });
  });
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
