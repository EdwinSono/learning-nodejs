/**
 * Pago a proveedores weekly
 * node src/orders/services/2-addStateToOrders.js
 */
const CronJob = require('cron').CronJob
const axios = require('axios').default;
const OrdersModel = require('../models/orders.model');
const Order = require('../entities/order')
const { config } = require('../../common/config/env.config')
const { readExcelFile, StoreData } = require('../../common/middlewares/functions')
const mongoose = require('mongoose');
mongoose.connect(config.db_url, { useNewUrlParser: true });

// main routine
const prePayments = async (fileName, limit) => {
  console.log('Start 2', fileName)
  const pendingOrders = await OrdersModel.list({fileName: fileName, status: 'pending', $and: [{orderId: { $exists: true}}, {orderId: { $ne: ''}}]}, limit)
  let stateOrders = []
  for await (const order of pendingOrders) {
    const orderId = order.orderId
    const set = {}
    const orderState = await getOrderState(orderId);
    const data = orderState.data.data
    console.log(order, data)
    if (orderState.status === 200) {
      if (data.code === 1) {
        let x2 = 0
        for (const tspx of data.data.items) {
          x2 += tspx.quantity.picked
        }
        totalItems = x2
        set.state = data.data.status.description
        set.state = data.data.status.description
        set.totalItemsJannis = totalItems
        set.totalItemsPickeados = data.data.items.length
        set.origenLatitud = StoreData(data.store).latitude
        set.origenLongitude = StoreData(data.store).longitude
        set.destinationLatitud = data.data.shipping[0]?.address.lat
        set.destinationLongitude = data.data.shipping[0]?.address.lng
        set.shippingWindowStart = data.data.shipping[0]?.logistic?.shippingWindowStart
        set.shippingWindowEnd = data.data.shipping[0]?.logistic?.shippingWindowEnd
        set.status = 'state'
      } else {
        // {
        //   message: { statusCode: 500, message: 'No se encontro orden: v6771307wofp-01' },
        //   status: 400,
        //   details: 'Bad Request'
        // }
        // { status: 412, details: 'Precondition Failed' }
        console.log(orderId, data)
        set.observations = `${data.message?.statusCode} - ${data.message?.message}`
        set.status = 'not-state'
      }
      const updateOne = { updateOne :
        {
           "filter": {orderId: orderId, fileName: fileName, status: 'pending'},
           "update": {$set: set}
        }
      }
      stateOrders.push(updateOne)
    }
  }
  // console.log(JSON.stringify(stateOrders))
  // return 1
  const ordersSaved = await OrdersModel.bulkWrite(stateOrders);
  return {
    ordersModified: ordersSaved.nModified
  }
}

// run 
async function run () {
  const limit = 100
  const fileName = 'julio-2q-1'
  const responde = await prePayments(fileName, limit)
  console.log(responde)
}

async function getOrderState(orderId) {
  return await axios.get(`https://integraciones.comunidadtask.cl/isntaleap/status-order/v${orderId}wofp-01`);
}

// new CronJob('0 */1 * * * *', function() {
  run()
// }, null, true, 'America/Lima');
