const test = require("tape");
const nock = require("nock");
const request = require("./request");

test("request fetches data correctly", t => {
  nock("http://jsonplaceholder.typicode.com")
    .get("/users/1")
    .reply(200, {
      name: "Leanne Graham",
    });
  request("http://jsonplaceholder.typicode.com/users/1").then(response => {
    t.deepEqual(
      response.name,
      "Leanne Graham",
      "the response body should contain the correct json"
    );
    t.end();
  });
});
