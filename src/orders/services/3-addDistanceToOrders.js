/**
 * Pago a proveedores weekly
 * node src/orders/services/3-addDistanceToOrders.js
 */
const CronJob = require('cron').CronJob
const axios = require('axios').default;
const Gmap = require('../libs/Gmap')
const OrdersModel = require('../models/orders.model');
const Order = require('../entities/order')
const { config } = require('../../common/config/env.config')
const { readExcelFile, StoreData } = require('../../common/middlewares/functions')
const mongoose = require('mongoose');
mongoose.connect(config.db_url, { useNewUrlParser: true });

// main routine
const prePayments = async (fileName, limit) => {
  console.log('Start 3', fileName)
  const pendingOrders = await OrdersModel.list({fileName: fileName, status: 'state', $and: [{orderId: { $exists: true}}, {orderId: { $ne: ''}}]}, limit)
  let stateOrders = []
  const gmap = new Gmap ();
  for await (const order of pendingOrders) {
    // console.log(order)
    const orderId = order.orderId
    const set = {}
    if (order.origenLatitud && order.origenLongitude && order.destinationLatitud && order.destinationLongitude) {
      const originAddress = [order.origenLatitud,order.origenLongitude].join(',');
      const destinationAddress = [order.destinationLatitud,order.destinationLongitude].join(',');
      const distanceCalculated = await gmap.calculateDistance(originAddress, destinationAddress);
      // console.log(orderId, originAddress, destinationAddress)
      // console.log("readLines", distanceCalculated);
      set.originAddress = distanceCalculated.origin_addresses.join('');
      set.destinationAddress = distanceCalculated.destination_addresses.join('');
      if (distanceCalculated.rows[0].elements[0].status !== "ZERO_RESULTS") {
        set.distanceText = distanceCalculated.rows[0].elements[0].distance.text;
        set.distanceValue = distanceCalculated.rows[0].elements[0].distance.value;
        set.durationText = distanceCalculated.rows[0].elements[0].duration.text;
        set.durationValue = distanceCalculated.rows[0].elements[0].duration.value;
      }
      set.status = 'distance'
    } else {
      set.status = 'not-distance'
    }
    const updateOne = { updateOne :
      {
          "filter": {orderId: orderId},
          "update": {$set: set}
      }
    }
    stateOrders.push(updateOne)
  }
  // console.log(JSON.stringify(stateOrders))
  const ordersSaved = await OrdersModel.bulkWrite(stateOrders);
  return {
    ordersModified: ordersSaved.nModified || 'not-data'
  }
}

// run 
async function run () {
  const limit = 50
  const fileName = 'julio-2q-1'
  const responde = await prePayments(fileName, limit)
  console.log(responde)
}

new CronJob('*/20 * * * * *', function() {
  run()
}, null, true, 'America/Lima');
