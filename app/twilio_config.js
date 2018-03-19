var accountSid = process.env.TW_ACCOUNT_SID;
var authToken = process.env.TW_AUTH_TOKEN;

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

module.exports = client;
