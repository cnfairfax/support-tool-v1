'use strict';

let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

module.exports = function (uri, TOKEN) {
  const key = Buffer.from(TOKEN, 'ascii');
  var uriDec = decodeURI(uri);
  const message = Buffer.from(uriDec, 'ascii');
  const hmac = crypto.createHmac('md5', key);
  hmac.update(message);
  const auth = hmac.digest('base64');
  return auth;
};