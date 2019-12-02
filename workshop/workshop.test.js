const test = require("tape");
const nock = require("nock");
const request = require("./workshop");

test("request fetches data correctly", t => {
  nock("http://jsonplaceholder.typicode.com")
    .get("/users/1")
    .reply(200, {
      name: "Leanne Graham",
    });
  request("http://jsonplaceholder.typicode.com/users/1").then(response => {
    t.equal(
      response.statusCode,
      200,
      "the API should respond with a status code of 200"
    );
    t.deepEqual(
      response.body.name,
      "Leanne Graham",
      "the response body should contain the correct json"
    );
    t.end();
  });
});
