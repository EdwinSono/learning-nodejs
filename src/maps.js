var axios = require('axios');

const YOUR_API_KEY = 'AIzaSyB8u6beo61RUNMMWEqj9ML9rr8XV6Uvbys';
const origen = "-36.9821187,-73.1657024";
const destination = "-36.991657,-73.15386";
const units = 'kilometres';
var config = {
  method: 'get',
  url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origen}&destinations=${destination}&units=${units}&key=${YOUR_API_KEY}`,
  headers: { }
};

async function run () {
  const response = await axios(config);
  if (response.status === 200) {
    return response.data;
  }
}

const data = run();
console.log(JSON.stringify(data));


// axios(config)
//   .then(function (response) {
//     console.log(JSON.stringify(response.data));
//   })
//   .catch(function (error) {
//     console.log(error);
//   });


// run src/maps.js

/*
{
	"destination_addresses": ["C. Laguna Carilauquen 2735, Concepcion, Coronel 4191859, Bío Bío, Chile"],
	"origin_addresses": ["Cerro El Plomo 717, Coronel, Bío Bío, Chile"],
	"rows": [{
		"elements": [{
			"distance": {
				"text": "2.0 km",
				"value": 2008
			},
			"duration": {
				"text": "7 mins",
				"value": 395
			},
			"status": "OK"
		}]
	}],
	"status": "OK"
}
*/



/*
 {
	"destination_addresses": ["Pje. El Alerce 01415, Punta Arenas, 6210322, Magallanes y la Antártica Chilena, Chile"],
	"origin_addresses": ["de Aconcagua - Abraham Ahumada 200, San Felipe, 2171847, Valparaíso, Chile"],
	"rows": [{
		"elements": [{
			"distance": {
				"text": "1,928 mi",
				"value": 3103045
			},
			"duration": {
				"text": "1 day 11 hours",
				"value": 126631
			},
			"status": "OK"
		}]
	}],
	"status": "OK"
}
 */