
const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c2el4ciad3i9kmvsndg0" // Replace this
const finnhubClient = new finnhub.DefaultApi()
 

module.exports = finnhubClient;