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

## Callbacks

We can use callbacks (functions passed as arguments to other functions) to access async values or run our code once some async task completes. In fact the first argument to `setTimeout` above is a callback. We pass a function which `setTimeout` runs once it the timeout has finished.

Callbacks can be fiddly to deal with, and you may end up with very nested function calls if you have to chain lots of async stuff. Promises can help us manage this.

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
// or
// Promise { <state>: "fulfilled", <value>: theResult }
// or
// Promise { <state>: "rejected", <value>: Error }
// Note: different browsers may show promises differently in the console
```

### Using promises

#### Accessing the value

Since the promise's fulfilled value isn't accessible syncronously, we can't use it immediately like a normal JS variable. We need a way to tell JS to run our code once the promise has fulfilled.

```javascript
const myPromise = getSomeAsyncData();
myPromise.then(someData => console.log(someData));
```

Promises are objects with a `.then()` method. This method takes a callback function as an argument. The promise will call this function with the fulfilled value when it's ready.

#### Handling errors

We can also handle errors by passing a callback to the promise's `.catch()` method.

```javascript
const myPromise = getSomeAsyncData();
myPromise
  .then(someData => console.log(someData))
  .catch(error => console.log(error));
```

It's worth noting that you don't need to keep the promise itself around as a variable.

```javascript
getSomeAsyncData()
  .then(someData => console.log(someData))
  .catch(error => console.log(error));
```

### Creating promises

You can create your own promises using `new Promise()`. You have to pass this a promise-creator function that tells it how to fulfill or reject.

This promise-creator function will be passed two functions, commonly named `resolve` and `reject`. Calling `resolve(value)` will cause the promise to fulfill with that value. Calling `reject(value)` will cause the promise to reject with that value.

Here's an example that creates a nicer promise-based version of `setTimeout`:

```js
function wait(ms) {
  return new Promise((resolve, reject) => {
    if (!ms) reject("Please enter a time to wait");
    setTimeout(() => resolve("Your wait is over"), ms);
  });
}

wait(1000).then(console.log);
// after one second: "Your wait is over"
```

## Workshop

We're going to refactor the callback-based HTTP request function from Node Week 2 to return a promise instead.

### Set-up

1. Clone this repo
1. Run `npm install`
1. Open `workshop/workshop.js` in your editor
