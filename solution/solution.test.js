const tape = require("tape");
const nock = require("nock");
var _test = require("tape-promise").default;
var test = _test(tape); // add promise support to tape

const request = require("./solution");

test("request fetches data correctly", t => {
  nock("http://jsonplaceholder.typicode.com")
    .get("/users/1")
    .reply(200, {
      name: "Leanne Graham",
    });

  return request("http://jsonplaceholder.typicode.com/users/1").then(
    response => {
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
    }
  );
});

test("request rejects with http error correctly", t => {
  nock("http://jsonplaceholder.typicode.com")
    .get("/users/1")
    .reply(500, { error: "Oops" });

  return t.rejects(
    request("http://jsonplaceholder.typicode.com/users/1"),
    new Error(500),
    "Should reject with 500 error"
  );
});
