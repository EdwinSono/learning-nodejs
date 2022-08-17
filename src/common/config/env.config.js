require("dotenv").config();

const config = {
  "port": process.env.PORT,
  "appEndpoint": process.env.APP_ENDPOINT,
  "apiEndpoint": process.env.API_ENDPOINT,
  "db_url": process.env.DB_URL,
  "environment": process.env.ENVIRONMENT,
  "gMapAPiKey": process.env.GMAP_API_KEY,
}

module.exports = { config: config };
