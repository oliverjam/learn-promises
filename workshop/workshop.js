const http = require("http");

function request(url, cb) {
  http
    .get(url, response => {
      let data = "";
      response.on("data", chunk => {
        data += chunk;
      });
      response.on("end", () => {
        const statusCode = response.statusCode;
        if (statusCode >= 400) {
          return cb(new Error(statusCode));
        }
        const body = JSON.parse(data);
        cb(null, { statusCode, body });
      });
    })
    .on("error", err => cb(err));
}

module.exports = request;
