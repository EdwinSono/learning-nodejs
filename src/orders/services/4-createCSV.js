/**
 * Pago a proveedores weekly
 * node src/orders/services/4-createCSV.js
 */
 const fs = require('fs')
const CronJob = require('cron').CronJob
const OrdersModel = require('../models/orders.model');
const Order = require('../entities/order')
const { config } = require('../../common/config/env.config')
const { readExcelFile, StoreData } = require('../../common/middlewares/functions')
const mongoose = require('mongoose');
mongoose.connect(config.db_url, { useNewUrlParser: true });

// main routine
const prePayments = async (fileName, limit) => {
  console.log('Start 4', fileName)
  const pendingOrders = await OrdersModel.list({fileName: fileName}, limit)
  let stateOrders = [[
    'Tienda',
    'Cod. Tienda',
    'Fecha',
    'Nro de pedido',
    'Km Adicional - Op',
    'Observaciones',
    'state',
    'totalItemsJannis',
    'totalItemsPickeados',
    'origenLatitud',
    'origenLongitude',
    'destinationLatitud',
    'destinationLongitude',
    'shippingWindowStart',
    'shippingWindowEnd',
    'destinationAddress',
    'distanceText',
    'distanceValue',
    'durationText',
    'durationValue',
    'originAddress',
  ].join(',')]
  for await (const order of pendingOrders) {
    const one = [[
      order.store,
      order.codeStore,
      order.startDate,
      order.orderId,
      order.kmExtra,
      order.observations,
      order.state,
      order.totalItemsJannis,
      order.totalItemsPickeados,
      order.origenLatitud,
      order.origenLongitude,
      order.destinationLatitud,
      order.destinationLongitude,
      order.shippingWindowStart,
      order.shippingWindowEnd,
      ['"',order.destinationAddress,'"'].join(''),
      order.distanceText,
      order.distanceValue,
      order.durationText,
      order.durationValue,
      ['"',order.originAddress,'"'].join(''),
    ].join(',')]
    stateOrders.push(one)
  }
  const content = stateOrders.join('\r\n');
  fs.writeFileSync("src/orders/resources/fileData.csv", content);
  return {
    count: pendingOrders.length
  }
}

// run 
async function run () {
  const limit = 100000
  const fileName = 'julio-2q'
  const responde = await prePayments(fileName, limit)
  console.log(responde)
}

run()
