const moment = require('moment')

exports.getDateTime = () => {
  var date = new Date();
  
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  
  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  
  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  
  var year = date.getFullYear();
  
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  
  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  
  return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

exports.isHourBlocked = (dayStart, hourStart, dayEnd, hourEnd) => {
  const today = moment().format('dddd')
  const hour = moment().hour()
  const hourBlock = []
  console.log(dayStart, hourStart, dayEnd, hourEnd)
  for (let index = hourStart; index <= 24; index++) {
    hourBlock.push(dayStart + '-' + index)
  }
  for (let index = 1; index <= hourEnd; index++) {
    hourBlock.push(dayEnd + '-' + index)
  }
  console.log(hourBlock)
  console.log(today + '-' + hour)
  if (hourBlock.indexOf(today + '-' + hour) >= 0) {
    return true
  }
  return false
}