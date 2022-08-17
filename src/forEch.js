const ordersClient = [
	{ carrierId: 1, name: "Ariana"},
	{ carrierId: 2, name: "Beto"},
	{ carrierId: 3, name: "Cesar"},
	{ carrierId: 4, name: "Daniel"},
	{ carrierId: 5, name: "Edwin"},
]
const carrierSmuDb = [1,2,4,5]

async function process (element, carrierSmuDb) {
  console.log("Inicio", element, element.carrierId)
  const carrier = carrierSmuDb[element.carrierId]
  if (!carrier) {
    console.log('ERROR libSmu.StartOrdersCommand', 'not_carrier')
    return element
  }
  console.log("Fin", element, carrier)
}

async function run () {
  for await (const element of ordersClient) {
    await process(element, carrierSmuDb)
  }
  console.log("Fin all")
}

run ()