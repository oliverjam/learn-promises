# Learn Promises

Promises are a relatively new JS feature that help us manage async code. They let us go from callback-hell:

```js
function getStuff((err, stuff) => {
  if (err) handleError(err);
  getOtherStuff((err, otherStuff) => {
    if (err) handleError(err);
    getMoreStuff((err, moreStuff) => {
      if (err) handleError(err);
      console.log(stuff, otherStuff, moreStuff);
    })
  })
})
```

to the promise-land:

```js
getStuff()
  .then(getOtherStuff)
  .then(getMoreStuff)
  .catch(handleError);
```

Before we look at promises, lets make sure we understand _why_ this is a problem.

## Asynchronicity

JavaScript is a single-threaded language. This means things generally happen one at a time, in the order you wrote the code.

```javascript
console.log(1);
console.log(2);
console.log(3);
// logs 1, then 2, then 3
```

When something needs to happen out of this order, we call it _asynchronous_. JavaScript handles this using a "queue". Anything asynchronous gets pushed out of the main running order and into the queue. Once JS finishes what it was doing moves on to the first thing in the queue.

```javascript
console.log(1);
setTimeout(() => console.log(2), 1000);
console.log(3);
// logs 1, then 3, then (after 1 second) logs 2
```

It's intuitive that the above example logs `2` last, because JS has to wait a whole second before running the function passed to `setTimeout`.

What's less intuitive is that this is the same even with a timeout of 0ms.

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
console.log(3);
// logs 1, then 3, then (as soon as possible) logs 2
```

This is because `setTimeout` always gets pushed to the back of the queue—the specified wait time just tells JS the _minimum time_ that has to pass before that code is allowed to run.

## Promises

Promises allow us to represent the _eventual completion_ of async code. For example when we fetch some data from a server we will receive a _promise_ that will eventually represent the server's response (when the request completes).

### Terminology

Promises can be in 3 states:

1. _pending_ (async code has not finished yet)
1. _fulfilled_ (expected value is available)
1. _rejected_ (expected value is _not_ available).

There's a bit more complexity to this, so it's worth reading this [explanation of promise states](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md) later.

```javascript
const myPromise = getSomeAsyncData();
console.log(myPromise);
// Promise { <state>: "pending" }
// or (if the promise has fulfilled)
// Promise { <state>: "fulfilled", <value>: theResult }
// or (if the promise rejected)
// Promise { <state>: "rejected", <value>: Error }
// Note: different browsers may show promises differently in the console
```

### Accessing the value

Since the promise's fulfilled value isn't accessible syncronously, we can't use it immediately like a normal JS variable. We need a way to tell JS to run our code once the promise has fulfilled.

```javascript
const myPromise = getSomeAsyncData();
myPromise.then(someData => console.log(someData));
// { "blah": "some data" }
```

Promises are objects with a `.then()` method. This method takes a callback function as an argument. The promise will call this function with the fulfilled value when it's ready.

We can also handle errors by passing a callback to the promise's `.catch()` method.

```javascript
const myPromise = getSomeAsyncData();
myPromise
  .then(someData => console.log(someData))
  .catch(error => console.log(error));
// HttpError: 404 blah
```

It's worth noting that you don't need to keep the promise itself around as a variable.

```javascript
getSomeAsyncData()
  .then(someData => console.log(someData))
  .catch(error => console.log(error));
```

## The `fetch` API

[Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is a built in function for making HTTP requests from the browser. Since requests are inherently async `fetch` always returns a promise.

```javascript
fetch("https://pokeapi.co/api/v2/pokemon/pikachu/")
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

The promise fulfills with a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object. It contains information about the response from the server, and looks something like this:

```javascript
{
  body: ReadableStream,
  headers: Headers,
  ok: true,
  status: 200,
  statusText: "OK"
}
```

### Reading the body

The [response body](https://developer.mozilla.org/en-US/docs/Web/API/Body) is a "readable stream", which means you can't access it directly. You need to call a method on the response object to convert the stream into usable data:

```javascript
fetch("https://pokeapi.co/api/v2/pokemon/pikachu/")
  .then(response => {
    return response.json();
  })
  .then(data => console.log(data));
```

Since this API returns data as JSON we use the `response.json()` method. If the body was HTML we'd use `response.text()`.

Reading a stream is async, so these methods _also_ return promises. We return the promise from our `.then()`, which allows us to chain _another_ `.then()` to read the body data.

### Reading headers

The response headers are a special [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) object. To get the value of a header you have to use `.get()`:

```javascript
fetch("https://pokeapi.co/api/v2/pokemon/pikachu/").then(response => {
  const contentType = response.headers.get("content-type");
  console.log(contentType); // "application/json"
});
```

### Handling failed requests

The promise returned by `fetch` will only reject if there's an actual error thrown. An unsuccessful HTTP request is not necessarily an error—e.g. if a resource is not found `404` is the correct response. We should handle these scenarios manually by checking the `response.ok` property. This will be `false` if the response had an error status code.

```javascript
fetch("https://pokeapi.co/api/v2/pokemon/notarealpokemon/")
  .then(response => {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.log(error)); // 404
```

Now our promise will reject with the error we threw if the request is not successful.

### Non-`GET` requests

The second argument to `fetch` is an [options object](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters). You can use this to set the request method and headers, and send a body:

```javascript
fetch("https://api.com/user/", {
  method: "POST",
  body: JSON.stringify({ name: "Oli" }), // encode our data as JSON
  headers: {
    "content-type": "application/json", // tell the API we're sending JSON
  },
}).then(response => console.log(response));
```
