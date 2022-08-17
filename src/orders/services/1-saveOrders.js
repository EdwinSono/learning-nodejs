/**
 * Pago a proveedores weekly
 * node src/orders/services/1-saveOrders.js
 */
const OrdersModel = require('../models/orders.model');
const Order = require('../entities/order')
const { config } = require('../../common/config/env.config')
const { readExcelFile } = require('../../common/middlewares/functions')
const mongoose = require('mongoose');
mongoose.connect(config.db_url, { useNewUrlParser: true });

// main routine
const prePayments = async (pathName, fileName, clientName, countryCode) => {
  console.log('Start', pathName, fileName, clientName, countryCode)
  let contentFile = await readExcelFile(pathName, fileName, clientName, countryCode)
  const orders = []
  const promises = contentFile.map( async document => {
    const order = new Order(document, fileName, clientName, countryCode)
    if (order.orderId) orders.push(order)
  })
  const ordersSaved = await OrdersModel.saveMultiple(orders)
  return {
    ordersSaved: ordersSaved.length
  }
}

// run 
async function run () {
  const pathName = './src/orders/resources/julio-2q-1.xlsx'
  const fileName = 'julio-2q-1'
  const clientName = 'CENCOSUD' 
  const countryCode = 'CHL'
  const responde = await prePayments(pathName, fileName, clientName, countryCode)
  console.log(responde)
}

run ()
