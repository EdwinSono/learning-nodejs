var axios = require('axios');
var data = JSON.stringify({
  "caseId": "617fdfac5223e238249c69ad"
});

var config = {
  method: 'post',
  url: 'https://distriluz.cerezacc.com:9443/api/email/emails/list',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
