const path = require('path');
const Excel = require('exceljs');

const CELLS = require('./cells');

const dummyExpense = [{
  currency:'USD',
}];

function copyTemplateExcel(outputFileName, {details}) {
  return new Promise((resolve, reject)=>{
    var workbook = new Excel.Workbook();
    workbook.creator = details.name;
    workbook.created = new Date();
    workbook.addWorksheet();
    resolve(workbook);
  });
}

function styleCell(worksheet, cell, style={}) {
  if(style.MERGE){
    worksheet.mergeCells(style.MERGE);
  }
  if(style.ALIGN){
    worksheet.getCell(cell).alignment = style.ALIGN;
  }
  if(style.FONT){
    worksheet.getCell(cell).font = style.FONT;
  }
  if (style.BACKGROUND){
    worksheet.getCell(cell).fill={
      type:'pattern',
      pattern:'solid',
      fgColor: {argb:`FF${style.BACKGROUND}`},
    };
  }
}

function fillStaticLables(worksheet, currentLables) {
  if (currentLables===undefined){
    currentLables = CELLS.STATIC_LABLES;
  }

  for (var prop in currentLables) {
    if (currentLables.hasOwnProperty(prop)) {
      if (currentLables[prop].hasOwnProperty('CELL') && currentLables[prop].hasOwnProperty('VALUE')){
        worksheet.getCell(currentLables[prop].CELL).value = currentLables[prop].VALUE;
        styleCell(worksheet, currentLables[prop].CELL, currentLables[prop].STYLE);
      }else if (typeof(currentLables[prop])==='object'){
        fillStaticLables(worksheet, currentLables[prop]);
      }
    }
  }
}

function fillPersonalDetails(worksheet, details, currencyRates) {
  worksheet.getCell(CELLS.NAME).value = details.name;
  worksheet.getCell(CELLS.DEPARTMENT).value = details.department;
  worksheet.getCell(CELLS.DESTINATION).value = `${details.destination.country} ${details.destination.city}`;
  worksheet.getCell(CELLS.NUMBER_OF_PASSENGERS).value = details.numberOfPassengers;

  worksheet.getCell(CELLS.DEPARTURE_DATE).value = new Date(details.departureDate).toLocaleDateString();
  worksheet.getCell(CELLS.RETURN_DATE).value = new Date(details.returnDate).toLocaleDateString();
  worksheet.getCell(CELLS.TOTAL_NUMBER_OF_DAYS).value = details.totalNumberOfDays;

  worksheet.getCell(CELLS.PURPOSE).value = details.purpose;

  worksheet.getCell(CELLS.CURRENCY_USD).value = currencyRates.usd;
  if (currencyRates.euro){
    worksheet.getCell(CELLS.CURRENCY_EURO).value = currencyRates.euro;
  }
  if (currencyRates.gbp){
    worksheet.getCell(CELLS.CURRENCY_GBP).value = currencyRates.gbp;
  }
  if (currencyRates.uah){
    worksheet.getCell(CELLS.CURRENCY_UAH).value = currencyRates.uah;
  }
  if (currencyRates.other){
    currencyRates.other.forEach((currency, index)=>{
      worksheet.getCell(CELLS.CURRENCY_OTHER_NAME[index]).value = currency.name;
      worksheet.getCell(CELLS.CURRENCY_OTHER_VALUE[index]).value = currency.rate;
    });
  }
}

function addCompanyExpenses(worksheet, expenses, title, rowNumber) {
  return addExpenses(worksheet, expenses, title, rowNumber, true);
}

function addExpenses(worksheet, expenses, title, rowNumber, company) {
  if (expenses){
    const newRows = expenses.map((expense)=>{
      let rowValues = [];
      rowValues[CELLS.EXPENSES_COLUMNS.TITLE]=title;
      rowValues[CELLS.EXPENSES_COLUMNS.NAME] = expense.description ? `${expense.name}, ${expense.description} - ${(new Date(expense.date)).toLocaleDateString()}`: expense.name;
      if (!company){
        rowValues[CELLS.EXPENSES_COLUMNS.COST[(expense.currency||'usd').toUpperCase()]] = expense.cost;
      }
      if (expense.comments){
        rowValues[CELLS.EXPENSES_COLUMNS.COMMENTS] = expense.comments;
      }
      return rowValues;
    });

    worksheet.spliceRows(rowNumber, 1, ...newRows);

    expenses.forEach((expense, index)=>{
      const currentRowNumber = rowNumber+index;
      if ((expense.currency||'usd').toUpperCase()==='USD'){
        worksheet.getCell(CELLS.TOTAL_COLUMNS.NIS+currentRowNumber).value={
          formula: `$${CELLS.CURRENCY_USD.split('').join('$')}*$${CELLS.TOTAL_COLUMNS.USD}${currentRowNumber}`,
        };
        worksheet.getCell(CELLS.TOTAL_COLUMNS.NIS+currentRowNumber).numFmt = '0.00';
      } else if ((expense.currency||'usd').toUpperCase()==='NIS'){
        worksheet.getCell(CELLS.TOTAL_COLUMNS.USD+currentRowNumber).value={
          formula: `$${CELLS.TOTAL_COLUMNS.NIS}${currentRowNumber}/$${CELLS.CURRENCY_USD.split('').join('$')}`,
        };
        worksheet.getCell(CELLS.TOTAL_COLUMNS.USD+currentRowNumber).numFmt = '0.00';
      }
      if (expense.cost){
        if (company){
          worksheet.getCell(CELLS.TOTAL_COLUMNS.USD +currentRowNumber).value={
            formula: `65*${CELLS.TOTAL_NUMBER_OF_DAYS}`,
          };
          worksheet.getCell(CELLS.TOTAL_COLUMNS.USD +currentRowNumber).numFmt = '0.00';

          worksheet.getCell(CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS+currentRowNumber).value=0;
          worksheet.getCell(CELLS.TOTAL_COLUMNS.COMPANY_NIS+currentRowNumber).value={
            formula: `${CELLS.TOTAL_COLUMNS.NIS}$${currentRowNumber}`,
          };
          worksheet.getCell(CELLS.TOTAL_COLUMNS.COMPANY_NIS+currentRowNumber).numFmt = '0.00';
        }else{
          worksheet.getCell(CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS+currentRowNumber).value={
            formula: `${CELLS.TOTAL_COLUMNS.NIS}$${currentRowNumber}`,
          };
          worksheet.getCell(CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS+currentRowNumber).numFmt = '0.00';
        }
      }

      styleCell(worksheet, `G${currentRowNumber}`, {MERGE: `G${currentRowNumber}:I${currentRowNumber}`});
    });

    return newRows.length;
  }
  return 0;
}

function addTotalRow(worksheet, title, startRow, rowsToTotal) {
  let rowValues = [];
  rowValues[CELLS.EXPENSES_COLUMNS.TITLE]=title;
  worksheet.spliceRows(startRow, 1, rowValues);
  const sums = rowsToTotal.reduce((res, rows)=>{
    if (!res[CELLS.TOTAL_COLUMNS.USD]){
      res[CELLS.TOTAL_COLUMNS.USD] = `${CELLS.TOTAL_COLUMNS.USD}${rows.start}:${CELLS.TOTAL_COLUMNS.USD}${rows.end-1}`;
      res[CELLS.TOTAL_COLUMNS.NIS] = `${CELLS.TOTAL_COLUMNS.NIS}${rows.start}:${CELLS.TOTAL_COLUMNS.NIS}${rows.end-1}`;
      res[CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS] = `${CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS}${rows.start}:${CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS}${rows.end-1}`;
      res[CELLS.TOTAL_COLUMNS.COMPANY_NIS] = `${CELLS.TOTAL_COLUMNS.COMPANY_NIS}${rows.start}:${CELLS.TOTAL_COLUMNS.COMPANY_NIS}${rows.end-1}`;

    }else{
      res[CELLS.TOTAL_COLUMNS.USD]+=`,${CELLS.TOTAL_COLUMNS.USD}${rows.start}:${CELLS.TOTAL_COLUMNS.USD}${rows.end-1}`;
      res[CELLS.TOTAL_COLUMNS.NIS]+=`,${CELLS.TOTAL_COLUMNS.NIS}${rows.start}:${CELLS.TOTAL_COLUMNS.NIS}${rows.end-1}`;
      res[CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS]+=`,${CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS}${rows.start}:${CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS}${rows.end-1}`;
      res[CELLS.TOTAL_COLUMNS.COMPANY_NIS]+=`,${CELLS.TOTAL_COLUMNS.COMPANY_NIS}${rows.start}:${CELLS.TOTAL_COLUMNS.COMPANY_NIS}${rows.end-1}`;
    }
    return res;
  },{});

  worksheet.getCell(CELLS.TOTAL_COLUMNS.USD + startRow).value = {
    formula: `SUM(${sums[CELLS.TOTAL_COLUMNS.USD]})`,
  };
  worksheet.getCell(CELLS.TOTAL_COLUMNS.USD + startRow).numFmt = '0.00';

  worksheet.getCell(CELLS.TOTAL_COLUMNS.NIS + startRow).value = {
    formula: `SUM(${sums[CELLS.TOTAL_COLUMNS.NIS]})`,
  };
  worksheet.getCell(CELLS.TOTAL_COLUMNS.NIS + startRow).numFmt = '0.00';

  worksheet.getCell(CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS + startRow).value = {
    formula: `SUM(${sums[CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS]})`,
  };
  worksheet.getCell(CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS + startRow).numFmt = '0.00';

  worksheet.getCell(CELLS.TOTAL_COLUMNS.COMPANY_NIS + startRow).value = {
    formula: `SUM(${sums[CELLS.TOTAL_COLUMNS.COMPANY_NIS]})`,
  };
  worksheet.getCell(CELLS.TOTAL_COLUMNS.COMPANY_NIS + startRow).numFmt = '0.00';

  const style = {
    BACKGROUND:'AFAFAF',
    FONT: {bold:true},
  };
  styleCell(worksheet, `A${startRow}`, style);
  styleCell(worksheet, `B${startRow}`, style);
  styleCell(worksheet, `C${startRow}`, style);
  styleCell(worksheet, `D${startRow}`, style);
  styleCell(worksheet, `E${startRow}`, style);
  styleCell(worksheet, `F${startRow}`, style);
  styleCell(worksheet, `G${startRow}`, Object.assign({},style, {MERGE: `G${startRow}:I${startRow}`}));
  styleCell(worksheet, `J${startRow}`, style);
  return 1;
}

function addTempTotalRow(worksheet, title, startRow, endRow){
  let rowValues = [];
  rowValues[CELLS.EXPENSES_COLUMNS.TITLE]=title;
  rowValues[CELLS.EXPENSES_COLUMNS.NAME]='Total';
  worksheet.spliceRows(endRow+1, 1, rowValues);

  worksheet.getCell(CELLS.TOTAL_COLUMNS.USD+ (endRow+1)).value = {
    formula: `SUM(${CELLS.TOTAL_COLUMNS.USD}${startRow}:${CELLS.TOTAL_COLUMNS.USD}${endRow})`,
  };
  worksheet.getCell(CELLS.TOTAL_COLUMNS.USD+ (endRow+1)).numFmt = '0.00';

  worksheet.getCell(CELLS.TOTAL_COLUMNS.NIS+ (endRow+1)).value = {
    formula: `SUM(${CELLS.TOTAL_COLUMNS.NIS}${startRow}:${CELLS.TOTAL_COLUMNS.NIS}${endRow})`,
  };
  worksheet.getCell(CELLS.TOTAL_COLUMNS.NIS+ (endRow+1)).numFmt = '0.00';

  worksheet.getCell(CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS+ (endRow+1)).value = {
    formula: `SUM(${CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS}${startRow}:${CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS}${endRow})`,
  };
  worksheet.getCell(CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS+ (endRow+1)).numFmt = '0.00';

  worksheet.getCell(CELLS.TOTAL_COLUMNS.COMPANY_NIS+ (endRow+1)).value = {
    formula: `SUM(${CELLS.TOTAL_COLUMNS.COMPANY_NIS}${startRow}:${CELLS.TOTAL_COLUMNS.COMPANY_NIS}${endRow})`,
  };
  worksheet.getCell(CELLS.TOTAL_COLUMNS.COMPANY_NIS+ (endRow+1)).numFmt = '0.00';

  const style = {
    BACKGROUND:'F0F0F0',
    FONT: {bold:true},
  };
  styleCell(worksheet, `B${endRow+1}`, style);
  styleCell(worksheet, `C${endRow+1}`, style);
  styleCell(worksheet, `D${endRow+1}`, style);
  styleCell(worksheet, `E${endRow+1}`, style);
  styleCell(worksheet, `F${endRow+1}`, style);
  styleCell(worksheet, `G${endRow+1}`, Object.assign({},style, {MERGE: `G${endRow+1}:I${endRow+1}`}));
  styleCell(worksheet, `J${endRow+1}`, style);

  return 1;
}

function fillFooter(worksheet, startRow, eshelRowIndex){
  let advanceRow = [];
  advanceRow[CELLS.FOOTER_LABLES.ADVANCE.COLUMN]=CELLS.FOOTER_LABLES.ADVANCE.VALUE;
  let refundRow = [];
  refundRow[CELLS.FOOTER_LABLES.REFUND.COLUMN]=CELLS.FOOTER_LABLES.REFUND.VALUE;
  let signatureRow = [];
  signatureRow[CELLS.FOOTER_LABLES.DATE.COLUMN]=CELLS.FOOTER_LABLES.DATE.VALUE;
  signatureRow[CELLS.FOOTER_LABLES.SIGNATURE.COLUMN]=CELLS.FOOTER_LABLES.SIGNATURE.VALUE;
  signatureRow[CELLS.FOOTER_LABLES.VP_SIGNATURE.COLUMN]=CELLS.FOOTER_LABLES.VP_SIGNATURE.VALUE;
  let fillRow = [];
  fillRow[CELLS.FOOTER_LABLES.DATE.COLUMN]='________________________';
  fillRow[CELLS.FOOTER_LABLES.SIGNATURE.COLUMN]='________________________';
  fillRow[CELLS.FOOTER_LABLES.VP_SIGNATURE.COLUMN]='________________________';
  let financeRow = [];
  financeRow[CELLS.FOOTER_LABLES.FINANCE.COLUMN]=CELLS.FOOTER_LABLES.FINANCE.VALUE;
  financeRow[CELLS.FOOTER_LABLES.SALARY.COLUMN]=CELLS.FOOTER_LABLES.SALARY.VALUE;
  financeRow[CELLS.FOOTER_LABLES.ODFOT.COLUMN]=CELLS.FOOTER_LABLES.ODFOT.VALUE;

  const newRows = [[],[], advanceRow, refundRow, [],[], signatureRow, [], fillRow, [],[], financeRow, fillRow];
  worksheet.spliceRows(startRow, 1, ...newRows);
  worksheet.getCell(`${CELLS.FOOTER_LABLES.REFUND_VALUE_COLUMN}${(startRow + newRows.indexOf(refundRow))}`).value = {
    formula: `${CELLS.TOTAL_COLUMNS.EMPLOYEE_NIS}${startRow-1}+${CELLS.TOTAL_COLUMNS.COMPANY_NIS}${eshelRowIndex}-${CELLS.FOOTER_LABLES.ADVANCE_VALUE_COLUMN}${(startRow + newRows.indexOf(advanceRow))}`,
  };
  worksheet.getCell(`${CELLS.FOOTER_LABLES.REFUND_VALUE_COLUMN}${(startRow + newRows.indexOf(refundRow))}`).numFmt = '0.00';
}

function fillWorkbook(workbook, {details, currencyRates, expenses}){
  return new Promise((resolve, reject)=>{
    const worksheet = workbook.getWorksheet(1);

    fillStaticLables(worksheet);
    fillPersonalDetails(worksheet, details, currencyRates);

    let rowsToTotal = [];
    let startRow = CELLS.EXPENSES_ROWS.EXPENSES_START;
    let rowsAddedCounter = 0;
    let eshelRowIndex;

    if (expenses){
      rowsAddedCounter = 0;
      rowsAddedCounter += addExpenses(worksheet, dummyExpense, 'Flights', startRow + rowsAddedCounter);
      rowsAddedCounter += addExpenses(worksheet, expenses.flights, 'Flights', startRow + rowsAddedCounter);
      if (rowsAddedCounter>0){
        rowsToTotal.push({start:startRow ,end:startRow + rowsAddedCounter});
      }
      if (rowsAddedCounter>1){
        rowsAddedCounter += addTempTotalRow(worksheet, 'Flights', startRow, startRow + (rowsAddedCounter-1));
      }
      if (rowsAddedCounter>0){
        const filghtsStyle = {
          MERGE: `A${startRow}:A${startRow+rowsAddedCounter-1}`,
          ALIGN: { vertical: 'middle', horizontal: 'center' },
          FONT: {bold:true},
        };
        styleCell(worksheet, `A${startRow}`, filghtsStyle);
      }

      startRow = startRow + rowsAddedCounter;
      rowsAddedCounter = 0;
      rowsAddedCounter += addExpenses(worksheet, dummyExpense, 'Hotel', startRow + rowsAddedCounter);
      rowsAddedCounter += addExpenses(worksheet, expenses.hotel, 'Hotel', startRow + rowsAddedCounter);
      if (rowsAddedCounter>0){
        rowsToTotal.push({start:startRow ,end:startRow + rowsAddedCounter});
      }
      if (rowsAddedCounter>1){
        rowsAddedCounter += addTempTotalRow(worksheet, 'Hotel', startRow, startRow + (rowsAddedCounter-1));
      }
      if (rowsAddedCounter>0){
        const hotelStyle = {
          MERGE: `A${startRow}:A${startRow+rowsAddedCounter-1}`,
          ALIGN: { vertical: 'middle', horizontal: 'center' },
          FONT: {bold:true},
        };
        styleCell(worksheet, `A${startRow}`, hotelStyle);
      }

      startRow = startRow + rowsAddedCounter;
      rowsAddedCounter = 0;
      const eshelExpense = Object.assign({}, dummyExpense[0], {comments:'65$ per day', cost:65});
      rowsAddedCounter += addCompanyExpenses(worksheet, [eshelExpense], '"Eshel"', startRow + rowsAddedCounter);
      eshelRowIndex = startRow;
      if (rowsAddedCounter>0){
        rowsToTotal.push({start:startRow ,end:startRow + rowsAddedCounter});
      }
      if (rowsAddedCounter>0){
        const eshelStyle = {
          ALIGN: { vertical: 'middle', horizontal: 'center' },
          FONT: {bold:true},
        };
        styleCell(worksheet, `A${startRow}`, eshelStyle);
      }

      startRow = startRow + rowsAddedCounter;
      rowsAddedCounter = 0;
      rowsAddedCounter += addExpenses(worksheet, expenses.rentalCar, 'Rental Car', startRow + rowsAddedCounter);
      if (rowsAddedCounter>0){
        rowsToTotal.push({start:startRow ,end:startRow + rowsAddedCounter});
      }
      if (rowsAddedCounter>1){
        rowsAddedCounter += addTempTotalRow(worksheet, 'Rental Car', startRow, startRow + (rowsAddedCounter-1));
      }
      if (rowsAddedCounter>0){
        const rentalStyle = {
          MERGE: `A${startRow}:A${startRow+rowsAddedCounter-1}`,
          ALIGN: { vertical: 'middle', horizontal: 'center' },
          FONT: {bold:true},
        };
        styleCell(worksheet, `A${startRow}`, rentalStyle);
      }

      startRow = startRow + rowsAddedCounter;
      rowsAddedCounter = 0;
      rowsAddedCounter += addExpenses(worksheet, expenses.publicTransportation, 'Public Transopation', startRow + rowsAddedCounter);
      if (rowsAddedCounter>0){
        rowsToTotal.push({start:startRow ,end:startRow + rowsAddedCounter});
      }
      if (rowsAddedCounter>1){
        rowsAddedCounter += addTempTotalRow(worksheet, 'Public Transopation', startRow, startRow + (rowsAddedCounter-1));
      }
      if (rowsAddedCounter>0){
        const transportaionStyle = {
          MERGE: `A${startRow}:A${startRow+rowsAddedCounter-1}`,
          ALIGN: { vertical: 'middle', horizontal: 'center' },
          FONT: {bold:true},
        };
        styleCell(worksheet, `A${startRow}`, transportaionStyle);
      }

      startRow = startRow + rowsAddedCounter;
      rowsAddedCounter = 0;
      rowsAddedCounter += addExpenses(worksheet, expenses.comunication, 'Communication', startRow + rowsAddedCounter);
      if (rowsAddedCounter>0){
        rowsToTotal.push({start:startRow ,end:startRow + rowsAddedCounter});
      }
      if (rowsAddedCounter>1){
        rowsAddedCounter += addTempTotalRow(worksheet, 'Communication', startRow, startRow + (rowsAddedCounter-1));
      }
      if (rowsAddedCounter>0){
        const comunicationStyle = {
          MERGE: `A${startRow}:A${startRow+rowsAddedCounter-1}`,
          ALIGN: { vertical: 'middle', horizontal: 'center' },
          FONT: {bold:true},
        };
        styleCell(worksheet, `A${startRow}`, comunicationStyle);
      }

      startRow = startRow + rowsAddedCounter;
      rowsAddedCounter = 0;
      rowsAddedCounter += addExpenses(worksheet, expenses.conference, 'Conference/Exhibition', startRow + rowsAddedCounter);
      if (rowsAddedCounter>0){
        rowsToTotal.push({start:startRow ,end:startRow + rowsAddedCounter});
      }
      if (rowsAddedCounter>1){
        rowsAddedCounter += addTempTotalRow(worksheet, 'Conference/Exhibition', startRow, startRow + (rowsAddedCounter-1));
      }
      if (rowsAddedCounter>0){
        const conferenceStyle = {
          MERGE: `A${startRow}:A${startRow+rowsAddedCounter-1}`,
          ALIGN: { vertical: 'middle', horizontal: 'center' },
          FONT: {bold:true},
        };
        styleCell(worksheet, `A${startRow}`, conferenceStyle);
      }

      startRow = startRow + rowsAddedCounter;
      rowsAddedCounter = 0;
      rowsAddedCounter += addExpenses(worksheet, expenses.other, 'Other', startRow + rowsAddedCounter);
      const insuranceExpense = Object.assign({}, dummyExpense[0], {comments:'Diesenhaus invoice', name:'Travel Insurance'});
      rowsAddedCounter += addExpenses(worksheet, [insuranceExpense], 'Other', startRow + rowsAddedCounter);
      if (rowsAddedCounter>0){
        rowsToTotal.push({start:startRow ,end:startRow + rowsAddedCounter});
      }
      if (rowsAddedCounter>1){
        rowsAddedCounter += addTempTotalRow(worksheet, 'Other', startRow, startRow + (rowsAddedCounter-1));
      }
      if (rowsAddedCounter>0){
        const otherStyle = {
          MERGE: `A${startRow}:A${startRow+rowsAddedCounter-1}`,
          ALIGN: { vertical: 'middle', horizontal: 'center' },
          FONT: {bold:true},
        };
        styleCell(worksheet, `A${startRow}`, otherStyle);
      }

      startRow = startRow + rowsAddedCounter;
      rowsAddedCounter = 0;
      rowsAddedCounter += addTotalRow(worksheet, 'Total', startRow, rowsToTotal);

      // // worksheet.commit();
    }

    startRow = startRow + rowsAddedCounter;
    fillFooter(worksheet, startRow, eshelRowIndex);

    resolve(workbook);
  });
}

module.exports={
  objectToExcelFile:(data)=>{
    return new Promise((resolve, reject)=>{
      if (!data){
        return reject(new Error('no data found'));
      }

      if(data && data.details && data.details.departureDate && data.details.returnDate && data.details.name){
        const datesString = `${new Date(data.details.departureDate).toLocaleDateString().replace(/\//g,'_')}-${new Date(data.details.returnDate).toLocaleDateString().replace(/\//g,'_')}`;
        const outputFileName = path.join(__dirname, '../output', `${data.details.name} ${datesString}.xlsx`);

        return copyTemplateExcel(outputFileName, data)
        .then(workbook=>{
          return fillWorkbook(workbook, data);
        }).then(workbook=>{
          return workbook.xlsx.writeFile(outputFileName);
        }).then(()=>{
          // return resolve(data.details);
          return resolve({filePath:outputFileName, details: data.details});
        });
      }else{
        reject('no details');
      }
    });
  },
};
