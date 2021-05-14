 const axios = require ("axios");
module.exports = axios.create({
    baseURL:"http://localhost:3000",
    headers:{},//contain headers
    timeout:3000//timeout for request
})
