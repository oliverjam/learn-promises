const https = require("http");

function request(url, cb) {
  https
    .get(
      url,
      { headers: { "User-Agent": "GitHub requires this" } },
      response => {
        let data = "";
        response.on("data", chunk => {
          data += chunk;
        });
        response.on("end", () => {
          const statusCode = response.statusCode;
          if (statusCode >= 400) {
            cb(new Error(statusCode));
            return; // stop executing after error
          }
          const body = JSON.parse(data);
          cb(null, body);
        });
      }
    )
    .on("error", err => cb(err));
}

module.exports = request;
