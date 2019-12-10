const https = require("https");

// Github's API doesn't work without a user-agent header :(
const options = { headers: { "User-Agent": "GitHub requires this" } };

function request(url, cb) {
  https
    .get(url, options, response => {
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
    })
    .on("error", err => cb(err));
}

module.exports = request;
