class Order {
  constructor (objectJSON, fileName, clientName, countryCode) {
  this.orderId = objectJSON.nroDePedido
  this.store = objectJSON.tienda
  this.codeStore = objectJSON.codTienda
  this.startDate = objectJSON.fecha
  this.kmExtra = objectJSON['kmAdicional-Op']
  this.observations = objectJSON.observaciones
  this.fileName = fileName
  this.clientName = clientName
  this.countryCode = countryCode
  this.status = 'pending'
  }
}

module.exports = Order
