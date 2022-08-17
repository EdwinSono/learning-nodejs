const { config } = require('../../common/config/env.config')
const axios = require('axios').default;

const GMAP_API_KEY = config.gMapAPiKey;

class Gmap {
  constructor () {
    this.api_key = GMAP_API_KEY;
    this.units = 'kilometres';
  }

  async calculateDistance (origen, destination) {
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origen}&destinations=${destination}&units=${this.units}&key=${this.api_key}`;
      // console.log(url)
      const response = await axios.get(url);
      if (response.status === 200) return response.data;
      else throw { message: response.data }
    } catch (error) {
      const errorMessage = { error: 'ERROR CALCULATE_DISTANCE', params: {origen, destination}, errorData: error.message }
      console.error(JSON.stringify(errorMessage))
      return errorMessage
    }
  }
}

module.exports = Gmap