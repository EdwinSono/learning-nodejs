const { getDateTime, isHourBlocked } = require('./checkHourDay')

const result = getDateTime()
const result2 = isHourBlocked('Wednesday', 18, 'Thursday', 18)

console.log(result, 'isHourBlocked', result2)
