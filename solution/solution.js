const http = require("http");

function request(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, response => {
        let data = "";
        response.on("data", chunk => {
          data += chunk;
        });
        response.on("end", () => {
          const statusCode = response.statusCode;
          if (statusCode >= 400) {
            reject(new Error(statusCode));
            return; // stop executing after error
          }
          const body = JSON.parse(data);
          resolve({ statusCode, body });
        });
      })
      .on("error", err => reject(err));
  });
}

module.exports = request;
