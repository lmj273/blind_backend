const sha512 = require("crypto-js/sha512");

function encrypt(msg) {
  return sha512(msg).toString();
}

module.exports = { encrypt };
