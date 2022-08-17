const fs = require('fs')
const XlsxStreamReader = require("xlsx-stream-reader")

function firtsMays(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatFields(headers) {
  headers.forEach(function(str, index){
    str = str.toLowerCase().replace(/#/g,'').replace(/\./g,'')
    let words = str.split(" ")
    let field
    words.forEach(function(word, i){
      (i !== 0)
        ? field += firtsMays(word)
        : field = word
    })
    headers[index] = field
  })
  return headers
}

exports.readExcelFile = (fileName, companyInvoiceDate = "") => {
  return new Promise( (resolve, reject) => {
    let workBookReader = new XlsxStreamReader()

    workBookReader.on('error', function (error) {
      reject(error);
    })
    
    workBookReader.on('sharedStrings', function () {
        // do not need to do anything with these, 
        // cached and used when processing worksheets
        //console.log(workBookReader.workBookSharedStrings);
    })
    
    workBookReader.on('styles', function () {
        // do not need to do anything with these
        // but not currently handled in any other way
        //console.log(workBookReader.workBookStyles);
    })
    
    workBookReader.on('worksheet', function (workSheetReader) {
        if (workSheetReader.id > 1){
            // we only want first sheet
            workSheetReader.skip();
            return; 
        }
        // print worksheet name
        //console.log(workSheetReader.name);
    
        // if we do not listen for rows we will only get end event
        // and have infor about the sheet like row count
        workSheetReader.on('row', function (row) {
          let obj = {}
          if (row.attributes.r == 1){
            // do something with row 1 like save as column names
            headers = formatFields(row.values)
            //console.log(row.values)
          }else{
            // second param to forEach colNum is very important as
            // null columns are not defined in the array, ie sparse array
            row.values.forEach(function(rowVal, colNum){
                // do something with row values
                // console.log(rowVal, "-----",colNum, "....1")
                obj[headers[colNum]] = row.values[colNum]
            });
            if(obj["companyInvoiceDate"] && companyInvoiceDate) { obj["companyInvoiceDate"] = companyInvoiceDate}
          }
          contentJSON.push(obj)
        })
    
        workSheetReader.on('end', function () {
            //console.log(workSheetReader.rowCount);
            //console.log(contentJSON);
            resolve(contentJSON)
        })
    
        // call process after registering handlers
        workSheetReader.process();
    })
    
    workBookReader.on('end', function () {
        // end of workbook reached
    });

    let contentJSON = [], headers = []
    fs.createReadStream(fileName).pipe(workBookReader);
  
  })
}

exports.StoreData = (storeId) => {
  switch (storeId) {
    case 'S002':
      return {
        name: 'Metro Garzón',
        address: 'Av. Gral. Eugenio Garzón 1337 - Jesús María 15072',
        description: storeId,
        zip_code: '15072',
        latitude: -12.0814241,
        longitude: -77.0572418
      }
    case 'H005':
      return {
        name: 'Metro La Marina',
        address: 'Av. la Marina 2500, San Miguel 15088, Perú',
        description: storeId,
        zip_code: '15088',
        latitude: -12.0766255,
        longitude: -77.0913241
      }
    case 'H014':
      return {
        name: 'Metro Plaza Norte',
        address: 'Esq. Av. Tomás Valle with Auxiliar, Au. Panamericana Nte., Independencia 15311, Perú',
        description: storeId,
        zip_code: '15311',
        latitude: -12.0060165,
        longitude: -77.0626668
      }
    case 'T121':
      return {
        name: 'Wong Marsano',
        address: 'Av Santiago de Surco, Santiago de Surco 15039, Perú',
        description: storeId,
        zip_code: '15072',
        latitude: -12.1427353,
        longitude: -77.0360863
      }
    default:
      return {
        name: 'Wong Aurora',
        address: 'Coronel Luis Arias Schereiber 270 - Miraflores 15048',
        description: storeId,
        zip_code: '15048',
        latitude: -12.1216967,
        longitude: -77.0112427
      }
  }
}