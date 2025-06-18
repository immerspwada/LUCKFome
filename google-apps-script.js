// Google Apps Script สำหรับเชื่อม Google Sheet (doPost/doGet)
// Sheet ID: 14-WYVD5-2XCzH_j_qpSSRij9X1nQ1vrGfPJPe-qZx04
// Sheet Name: Orders

function doPost(e) {
  var sheet = SpreadsheetApp.openById('14-WYVD5-2XCzH_j_qpSSRij9X1nQ1vrGfPJPe-qZx04').getSheetByName('Orders');
  var data = JSON.parse(e.parameter.data);
  sheet.appendRow([
    new Date(),
    data.userId || '',
    data.displayName || '',
    data.summary || '',
    data.slipBase64 || '',
    data.status || 'pending'
  ]);
  return ContentService.createTextOutput(JSON.stringify({result: 'success'})).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = SpreadsheetApp.openById('14-WYVD5-2XCzH_j_qpSSRij9X1nQ1vrGfPJPe-qZx04').getSheetByName('Orders');
  var values = sheet.getDataRange().getValues();
  // แปลงเป็น array of object (header: row[0])
  var headers = values[0];
  var data = values.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i]; });
    return obj;
  });
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
