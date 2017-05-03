module.exports = {
  STATIC_LABLES:{
    TITLE: {
      CELL: 'A1',
      VALUE: 'Sisense - Travel Expense Report',
      STYLE:{
        MERGE: 'A1:I1',
        BACKGROUND:'AFAFAF',
        ALIGN: { vertical: 'middle', horizontal: 'center' },
        FONT: {bold:true},
      },
    },
    DETAILS: {
      TITLE: {
        CELL: 'A3',
        VALUE: 'Travel\'s details',
        STYLE:{
          FONT: {bold:true, underline:true},
        },
      },
      NAME:{
        CELL: 'A4',
        VALUE: 'Passenger Name',
      },
      DEPARTMENT:{
        CELL: 'A5',
        VALUE: 'Passenger Department',
      },
      DESTENATION_COUNTRY:{
        CELL: 'A6',
        VALUE: 'Destination Country',
      },
      NUMBER_OF_PASSENGERS:{
        CELL: 'A7',
        VALUE: 'No. of Passengers',
      },
      DEPARTURE_DATE:{
        CELL: 'A9',
        VALUE: 'Departure Date',
      },
      RETURN_DATE:{
        CELL: 'A10',
        VALUE: 'Return Date',
      },
      TOTAL_NUMBER_OF_DAYS:{
        CELL: 'A11',
        VALUE: 'Total No. of Days',
      },
      PURPOSE:{
        CELL: 'A13',
        VALUE: 'Travel\'s Purpose',
        STYLE:{
          FONT: {bold:true, underline:true},
        },
      },

      TRAVEL_NUMBER:{
        CELL: 'G2',
        VALUE: 'Travel #',
      },
      BOOKKEEPING_ACCOUNT:{
        CELL: 'G3',
        VALUE: 'Bookkeeping account',
      },
      CURRENCY:{
        TITLE:{
          CELL: 'G4',
          VALUE: 'Currency',
        },
        TITLE_VALUE:{
          CELL: 'I4',
          VALUE: 'US$',
        },
        CURRENCY_USD:{
          CELL: 'G5',
          VALUE: 'Currency rate USD',
        },
        CURRENCY_EURO:{
          CELL: 'G6',
          VALUE: 'Currency rate EURO',
        },
        CURRENCY_GBP:{
          CELL: 'G7',
          VALUE: 'Currency rate GBP',
        },
        CURRENCY_UAH:{
          CELL: 'G8',
          VALUE: 'Currency rate UAH',
        },
        CURRENCY_OTHER:{
          CELL: 'G9',
          VALUE: 'Currency rate OTHER',
        },
      },
    },

    EXPENSES:{
      TITLE: {
        CELL: 'A17',
        VALUE: 'Expenses',
        STYLE:{
          MERGE: 'A17:I17',
          BACKGROUND:'AFAFAF',
          ALIGN: { vertical: 'middle', horizontal: 'center' },
          FONT: {bold:true},
        },
      },
      HEADERS:{
        AMOUNT_USD:{
          CELL: 'C20',
          VALUE: 'Amount in USD ONLY',
          STYLE:{
            ALIGN: { vertical: 'middle', horizontal: 'center' },
            FONT: {bold:true},
          },
        },
        ABOUNT_NIS:{
          CELL: 'D20',
          VALUE: 'Amount in NIS ONLY',
          STYLE:{
            ALIGN: { vertical: 'middle', horizontal: 'center' },
            FONT: {bold:true},
          },
        },
        EMPLOYEE:{
          CELL: 'E20',
          VALUE: 'Paid by Employee (NIS)',
          STYLE:{
            ALIGN: { vertical: 'middle', horizontal: 'center' },
            FONT: {bold:true},
          },
        },
        COMPANY:{
          CELL: 'F20',
          VALUE: 'Paid by company (NIS)',
          STYLE:{
            ALIGN: { vertical: 'middle', horizontal: 'center' },
            FONT: {bold:true},
          },
        },
        DETAILS:{
          CELL: 'G20',
          VALUE: 'Details (non USD currency, if relevant)',
          STYLE:{
            MERGE: 'G20:I20',
            ALIGN: { vertical: 'middle', horizontal: 'center' },
            FONT: {bold:true},
          },
        },
        // PAYMENT_METHOD:{
        //   CELL: 'J20',
        //   VALUE: 'Payment Method',
        //   STYLE:{
        //     ALIGN: { vertical: 'middle', horizontal: 'center' },
        //     FONT: {bold:true},
        //   },
        // },
        // COMMENTS:{
        //   CELL: 'K20',
        //   VALUE: 'Comments',
        //   STYLE:{
        //     ALIGN: { vertical: 'middle', horizontal: 'center' },
        //     FONT: {bold:true},
        //   },
        // },
      },
    },
  },

  FOOTER_LABLES:{
    ADVANCE:{
      COLUMN: 1,
      VALUE: 'Advance paid to employee',
    },
    ADVANCE_VALUE_COLUMN:'E',
    REFUND:{
      COLUMN: 1,
      VALUE: 'Employee Refund',
    },
    REFUND_VALUE_COLUMN:'E',

    DATE:{
      COLUMN: 2,
      VALUE: 'Date',
    },
    SIGNATURE:{
      COLUMN: 5,
      VALUE: 'Employee Signature',
    },
    VP_SIGNATURE:{
      COLUMN: 9,
      VALUE: 'Department VP\'s Signature',
    },
    FINANCE:{
      COLUMN: 2,
      VALUE: 'Finance',
    },
    SALARY:{
      COLUMN: 5,
      VALUE: 'Salary',
    },
    ODFOT:{
      COLUMN: 9,
      VALUE: 'Odfot',
    },
  },

  NAME: 'C4',
  DEPARTMENT: 'C5',
  DESTINATION: 'C6',
  NUMBER_OF_PASSENGERS: 'C7',
  DEPARTURE_DATE: 'C9',
  RETURN_DATE: 'C10',
  TOTAL_NUMBER_OF_DAYS: 'C11',
  PURPOSE: 'C13',
  CONFRENCES:{
    TITLE:'A14',
    VALUE:'C14',
  },
  CUSTOMERS:{
    TITLE:'A15',
    VALUE:'C15',
  },

  CURRENCY_USD: 'I5',
  CURRENCY_EURO: 'I6',
  CURRENCY_GBP: 'I7',
  CURRENCY_UAH: 'I8',
  CURRENCY_OTHER_NAME: ['H9','H10','H11','H12'],
  CURRENCY_OTHER_VALUE: ['I9','I10','I11','I12'],

  EXPENSES_COLUMNS:{
    TITLE: 1,
    NAME: 2,
    COST: {
      USD: 3,
      NIS: 4,
    },
    COMMENTS: 7,
  },
  EXPENSES_ROWS:{
    EXPENSES_START:21,
    FLIGHTS: 22,
    HOTEL:24,
    RENTAL_CAR:26,
    PUBLIC_TRANSPORTATION:28,
    COMUNICATION:30,
    CONFERENCE:31,
    OTHER:32,
  },

  TOTAL_COLUMNS:{
    USD: 'C',
    NIS: 'D',
    EMPLOYEE_NIS:'E',
    COMPANY_NIS:'F',
  },
  TOTAL_ROWS:{
    LIVING: 27,
    TRANSPORTATION: 29,
    // GENERAL: 34,
    TOTAL: 35,
  },
};
