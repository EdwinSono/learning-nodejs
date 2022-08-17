const { connection, Schema, Types } = require('mongoose')

const OrderSchema = new Schema({
  orderId: { type: String, index: true },
  codeStore: { type: String },
  store: { type: String },
  startDate: { type: String },
  kmExtra: { type: Number },
  observations: { type: String },
  state: { type: String },
  totalItemsJannis: { type: Number },
  totalItemsPickeados: { type: Number },
  origenLatitud: { type: Number },
  origenLongitude: { type: Number },
  destinationLatitud: { type: Number },
  destinationLongitude: { type: Number },
  originAddress: { type: String },
  destinationAddress: { type: String },
  distanceText: { type: String },
  distanceValue: { type: Number },
  durationText: { type: String },
  durationValue: { type: Number },
  shippingWindowStart: { type: String },
  shippingWindowEnd: { type: String },
  fileName: { type: String },
  clientName: { type: String },
  countryCode: { type: String},
  status: { type: String, default: 'active' },
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Ensure virtual fields are serialised.
OrderSchema.set('toJSON', {
  virtuals: true
});

OrderSchema.index({'orderId': 1, fileName: 1}, { unique: true })

const Order = connection.model('Orders', OrderSchema);

exports.list = (queryList, limit) => {
  return Order.find(queryList).limit(limit) //.sort({_id: -1})
}

exports.saveMultiple = (data) => {
  return Order.insertMany(data)
}

exports.bulkWrite = (data) => {
  return Order.bulkWrite(data)
}
