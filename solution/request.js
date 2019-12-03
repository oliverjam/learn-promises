const https = require("https");

/**
 * TASK 1
 */
function request(url) {
  return new Promise((resolve, reject) => {
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
              reject(new Error(statusCode));
              return; // stop executing after error
            }
            const body = JSON.parse(data);
            resolve(body);
          });
        }
      )
      .on("error", err => reject(err));
  });
}

module.exports = request;
