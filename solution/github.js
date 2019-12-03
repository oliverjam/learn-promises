const request = require("./request");

/**
 * TASK 2
 */

const getUser = username => request(`https://api.github.com/users/${username}`);

getUser("oliverjam")
  .then(console.log)
  .catch(console.error);

/**
 * TASK 3
 */

const getRepos = user => request(user.repos_url);

getUser("oliverjam")
  .then(getRepos)
  .then(console.log)
  .catch(console.error);

/**
 * TASK 4
 */

const oliverPromise = getUser("oliverjam");
const starsuitPromise = getUser("starsuit");

Promise.all([oliverPromise, starsuitPromise])
  .then(console.log)
  .catch(console.error);
