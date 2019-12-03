const tape = require("tape");
const nock = require("nock");
var _test = require("tape-promise").default;
var test = _test(tape); // add promise support to tape

const request = require("./request");

test("request fetches data correctly", t => {
  nock("https://jsonplaceholder.typicode.com")
    .get("/users/1")
    .reply(200, {
      name: "Leanne Graham",
    });

  return request("https://jsonplaceholder.typicode.com/users/1").then(
    response => {
      t.deepEqual(
        response.name,
        "Leanne Graham",
        "the response should contain the correct json"
      );
      t.end();
    }
  );
});

test("request rejects with http error correctly", t => {
  nock("https://jsonplaceholder.typicode.com")
    .get("/users/1")
    .reply(500, { error: "Oops" });

  return t.rejects(
    request("https://jsonplaceholder.typicode.com/users/1"),
    new Error(500),
    "Should reject with 500 error"
  );
});
