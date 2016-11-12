const fs = require('fs');
const path = require('path');
const Excel = require('exceljs');

const CELLS = require('./cells');

let workbook = new Excel.Workbook();

function copyTemplateExcel(outputFileName) {
  return new Promise((resolve, reject)=>{
    const outputFile = fs.createWriteStream(outputFileName);

    outputFile.on('error',err=>{
      reject(err);
    });
    outputFile.on('finish',()=>{
      workbook.xlsx.readFile(outputFileName).then(()=>{
        resolve(workbook);
      });
    });

    fs.createReadStream(path.join(__dirname,'Travel Report Template.xlsx'))
    .pipe(outputFile);
  });
}

function addOtherExpenses(worksheet, expenses){
  if (expenses){
    const newRows = expenses.map((expense)=>{
      let rowValues = [];
      rowValues[1]='Other';
      rowValues[CELLS.EXPENSES_COLUMNS.NAME] = expense.name;
      rowValues[CELLS.EXPENSES_COLUMNS.COST[expense.currency.toUpperCase()]] = expense.cost;
      if (expense.comments){
        rowValues[CELLS.EXPENSES_COLUMNS.COMMENTS] = expense.comments;
      }
      return rowValues;
    });

    worksheet.spliceRows(CELLS.EXPENSES_ROWS.OTHER, 1, ...newRows);
    return newRows.length;
  }
  return 0;
}

function addConferenceExpenses(worksheet, expenses){
  if (expenses){
    const newRows = expenses.map((expense)=>{
      let rowValues = [];
      rowValues[1]='Conference/Exhibition';
      rowValues[CELLS.EXPENSES_COLUMNS.NAME] = expense.name;
      rowValues[CELLS.EXPENSES_COLUMNS.COST[expense.currency.toUpperCase()]] = expense.cost;
      if (expense.comments){
        rowValues[CELLS.EXPENSES_COLUMNS.COMMENTS] = expense.comments;
      }
      return rowValues;
    });

    worksheet.spliceRows(CELLS.EXPENSES_ROWS.CONFERENCE, 1, ...newRows);
    return newRows.length;
  }
  return 0;
}

function addComunicationExpenses(worksheet, expenses){
  if (expenses){
    const newRows = expenses.map((expense)=>{
      let rowValues = [];
      rowValues[1]='Communication';
      rowValues[CELLS.EXPENSES_COLUMNS.NAME] = expense.name;
      rowValues[CELLS.EXPENSES_COLUMNS.COST[expense.currency.toUpperCase()]] = expense.cost;
      if (expense.comments){
        rowValues[CELLS.EXPENSES_COLUMNS.COMMENTS] = expense.comments;
      }
      return rowValues;
    });

    worksheet.spliceRows(CELLS.EXPENSES_ROWS.COMUNICATION, 1, ...newRows);
    return newRows.length;
  }
  return 0;
}

function addTransportationExpenses(worksheet, expenses){
  if (expenses){
    const newRows = expenses.map((expense)=>{
      let rowValues = [];
      rowValues[1]='Public Transopation';
      rowValues[CELLS.EXPENSES_COLUMNS.NAME] = `${expense.name}, ${expense.description} - ${(new Date(expense.date)).toLocaleDateString()}`;
      rowValues[CELLS.EXPENSES_COLUMNS.COST[expense.currency.toUpperCase()]] = expense.cost;
      if (expense.comments){
        rowValues[CELLS.EXPENSES_COLUMNS.COMMENTS] = expense.comments;
      }
      return rowValues;
    });

    worksheet.spliceRows(CELLS.EXPENSES_ROWS.PUBLIC_TRANSPORTATION, 1, ...newRows);
    return newRows.length;
  }
  return 0;
}

function addRentalCarExpenses(worksheet, expenses){
  if (expenses){
    const newRows = expenses.map((expense)=>{
      let rowValues = [];
      rowValues[1]='Rental Car';
      rowValues[CELLS.EXPENSES_COLUMNS.NAME] = expense.name;
      rowValues[CELLS.EXPENSES_COLUMNS.COST[expense.currency.toUpperCase()]] = expense.cost;
      if (expense.comments){
        rowValues[CELLS.EXPENSES_COLUMNS.COMMENTS] = expense.comments;
      }
      return rowValues;
    });

    worksheet.spliceRows(CELLS.EXPENSES_ROWS.RENTAL_CAR, 1, ...newRows);
    return newRows.length;
  }
  return 0;
}

function addHotelExpenses(worksheet, expenses){
  if (expenses){
    const newRows = expenses.map((expense)=>{
      let rowValues = [];
      rowValues[1]='Hotel';
      rowValues[CELLS.EXPENSES_COLUMNS.NAME] = expense.name;
      rowValues[CELLS.EXPENSES_COLUMNS.COST[expense.currency.toUpperCase()]] = expense.cost;
      if (expense.comments){
        rowValues[CELLS.EXPENSES_COLUMNS.COMMENTS] = expense.comments;
      }
      return rowValues;
    });

    worksheet.spliceRows(CELLS.EXPENSES_ROWS.HOTEL, 1, ...newRows);
    return newRows.length;
  }
  return 0;
}

function addFlightExpenses(worksheet, expenses){
  if (expenses){
    const newRows = expenses.map((expense)=>{
      let rowValues = [];
      rowValues[1]='Flights';
      rowValues[CELLS.EXPENSES_COLUMNS.NAME] = expense.name;
      rowValues[CELLS.EXPENSES_COLUMNS.COST[expense.currency.toUpperCase()]] = expense.cost;
      if (expense.comments){
        rowValues[CELLS.EXPENSES_COLUMNS.COMMENTS] = expense.comments;
      }
      return rowValues;
    });

    worksheet.spliceRows(CELLS.EXPENSES_ROWS.FLIGHTS, 1, ...newRows);
    return newRows.length;
  }
  return 0;
}

function fillWorkbook(workbook, {details, currencyRates, expenses}){
  return new Promise((resolve, reject)=>{
    const worksheet = workbook.getWorksheet(1);
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

    if (expenses){
      const newOtherRows = addOtherExpenses(worksheet, expenses.other) || 1;
      const travelInsurenceRow = 1;
      const newConferenceRows = addConferenceExpenses(worksheet, expenses.conference)||1;
      const newComunicationRows = addComunicationExpenses(worksheet, expenses.comunication)||1;


      const rowsToTotalCount = newOtherRows + newConferenceRows + newComunicationRows + travelInsurenceRow;
      worksheet.getCell(`${CELLS.TOTAL_COLUMNS.USD}${CELLS.EXPENSES_ROWS.COMUNICATION+rowsToTotalCount}`).value= {
        formula: `SUM(${CELLS.TOTAL_COLUMNS.USD}${CELLS.EXPENSES_ROWS.COMUNICATION}:${CELLS.TOTAL_COLUMNS.USD}${CELLS.EXPENSES_ROWS.COMUNICATION+rowsToTotalCount-1})`,
      };
      worksheet.getCell(`${CELLS.TOTAL_COLUMNS.NIS}${CELLS.EXPENSES_ROWS.COMUNICATION+rowsToTotalCount}`).value= {
        formula: `SUM(${CELLS.TOTAL_COLUMNS.NIS}${CELLS.EXPENSES_ROWS.COMUNICATION}:${CELLS.TOTAL_COLUMNS.NIS}${CELLS.EXPENSES_ROWS.COMUNICATION+rowsToTotalCount-1})`,
      };
      // console.log(`${CELLS.TOTAL_COLUMNS.NIS}${CELLS.EXPENSES_ROWS.COMUNICATION+rowsToTotalCount}`);
      // console.log(worksheet.getCell(`${CELLS.TOTAL_COLUMNS.NIS}${CELLS.EXPENSES_ROWS.COMUNICATION+rowsToTotalCount}`).value);

      const newTransportationRows = addTransportationExpenses(worksheet, expenses.publicTransportation)||1;
      worksheet.getCell(`${CELLS.TOTAL_COLUMNS.USD}${CELLS.EXPENSES_ROWS.PUBLIC_TRANSPORTATION+newTransportationRows}`).value= {
        formula: `SUM(${CELLS.TOTAL_COLUMNS.USD}${CELLS.EXPENSES_ROWS.PUBLIC_TRANSPORTATION}:${CELLS.TOTAL_COLUMNS.USD}${CELLS.EXPENSES_ROWS.PUBLIC_TRANSPORTATION+newTransportationRows-1})`,
      };
      worksheet.getCell(`${CELLS.TOTAL_COLUMNS.NIS}${CELLS.EXPENSES_ROWS.PUBLIC_TRANSPORTATION+newTransportationRows}`).value= {
        formula: `SUM(${CELLS.TOTAL_COLUMNS.NIS}${CELLS.EXPENSES_ROWS.PUBLIC_TRANSPORTATION}:${CELLS.TOTAL_COLUMNS.NIS}${CELLS.EXPENSES_ROWS.PUBLIC_TRANSPORTATION+newTransportationRows-1})`,
      };

      const newRentalCarRows = addRentalCarExpenses(worksheet, expenses.rentalCar)||1;
      const expenseEshelRow = 1;
      const expenseHotelRow = 1;
      const newHotelRows = addHotelExpenses(worksheet, expenses.hotel)||1;
      const expenseFlightRow = 1;
      const newFlightRows = addFlightExpenses(worksheet, expenses.flights)||1;

      const expensesRowsToTotalCount = newRentalCarRows + expenseEshelRow + expenseHotelRow + newHotelRows + expenseFlightRow + newFlightRows;
      worksheet.getCell(`${CELLS.TOTAL_COLUMNS.USD}${CELLS.EXPENSES_ROWS.EXPENSES_START+expensesRowsToTotalCount}`).value= {
        formula: `SUM(${CELLS.TOTAL_COLUMNS.USD}${CELLS.EXPENSES_ROWS.EXPENSES_START}:${CELLS.TOTAL_COLUMNS.USD}${CELLS.EXPENSES_ROWS.EXPENSES_START+expensesRowsToTotalCount-1})`,
      };
      worksheet.getCell(`${CELLS.TOTAL_COLUMNS.NIS}${CELLS.EXPENSES_ROWS.EXPENSES_START+expensesRowsToTotalCount}`).value= {
        formula: `SUM(${CELLS.TOTAL_COLUMNS.NIS}${CELLS.EXPENSES_ROWS.EXPENSES_START}:${CELLS.TOTAL_COLUMNS.NIS}${CELLS.EXPENSES_ROWS.EXPENSES_START+expensesRowsToTotalCount-1})`,
      };
      // worksheet.commit();
    }

    resolve(workbook);
  });
}

module.exports={
  objectToExcelFile:(data)=>{
    return new Promise((resolve, reject)=>{
      if (!data){
        return reject(new Error('no data found'));
      }

      const datesString = `${new Date(data.details.departureDate).toLocaleDateString().replace(/\//g,'_')}-${new Date(data.details.returnDate).toLocaleDateString().replace(/\//g,'_')}`;
      const outputFileName = path.join(__dirname, '../output', `${data.details.name} ${datesString}.xlsx`);

      return copyTemplateExcel(outputFileName)
      .then(workbook=>{
        return fillWorkbook(workbook, data);
      }).then(workbook=>{
        return workbook.xlsx.writeFile(outputFileName);
      }).then(()=>{
        return resolve(data.details);
      });
    });
  },
};
