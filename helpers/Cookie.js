var axios = require("axios");

module.exports = {
  getCookie: function (req, res, next) {
    var Cookie = axios({ url: "https://dns.he.net/", method: "get" }).then(
      (response) => {
        var Cookie = response.headers["set-cookie"];
        Cookie = Cookie[0].split(";");
        Cookie = Cookie[0];
        // console.log(Cookie);
        return Cookie;
      }
    );
    return Cookie;
  },
};
