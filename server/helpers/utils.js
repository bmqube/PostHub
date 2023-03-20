const moment = require("moment");

// Token generator
const makeToken = (v) => {
  let token =
    stringRand(4) + numRand(2) + v + unixMS() + stringRand(2) + numRand(2);
  return token;
};

// random number generator
const numRand = (length) => {
  let result = [];
  let characters = "0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
};

// random string generator
const stringRand = (length) => {
  let result = [];
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
};

// @return UNIX milliseconds requires moment js
const unixMS = () => {
  return moment().format("x");
};

// @return dateTime for DB format (YYYY-MM-DD T HH:mm:ss) in UTC - requires moment js
const utcNow = () => {
  let today = moment(new Date()).utc().format();
  return today;
};

// @return dateTime for DB format (YYYY-MM-DD T HH:mm:ss) in UTC - requires moment js
const localNow = () => {
  let today = moment(new Date()).format();
  return today;
};

exports.makeToken = makeToken;
exports.numRand = numRand;
exports.stringRand = stringRand;
exports.unixMS = unixMS;
exports.utcNow = utcNow;
exports.localNow = localNow;
