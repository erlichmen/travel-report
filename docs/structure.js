module.exports = {
  details:{
    name: 'Dean Shub',
    department: 'R&D',
    destination: {
      country: 'US New york',
      city: 'manhattan',
    },
    numberOfPassengers: 1, // default 1
    departureDate: new Date(),
    returnDate: new Date(),
    totalNumberOfDays: 4, // autofill with editable
    purpose: 'sisense connect event', // dont allow 'buisness'
  },
  currencyRates:{
    usd: 4.23,
    euro: 3.25, // optional
    gbp: 3.25, // optional
    uah: 3.25, // optional
    other: [//optional
      {
        name: 'franks',
        rate: 5235,
      },
    ],
  },
  expenses:{
    flights: [ //optional
      {
        name: 'baggage',
        cost: 524.54,
        currency: 'usd',
      },
      {
        name: 'baggage',
        cost: 52.44,
        currency: 'franks',
        comments: 'had to add another bag and air france only recives franks', // optional within optional
      },
    ],
    hotel:[ //optional
      {
        name: 'salt lake city hotel',
        cost: 152,
        currency: 'usd',
        comments: 'was not paid by sisense', // optional within optional
      },
    ],
    rentalCar:[ //optional
      {
        name: 'Rent',
        cost: 152,
        currency: 'usd',
        comments: 'was not paid by sisense', // optional within optional
      },
      {
        name: 'Fuel',
        cost: 15,
        currency: 'usd',
        comments: 'was not paid by sisense', // optional within optional
      },
    ],
    publicTransportation:[ // optional
      {
        name: 'taxi', // default taxi
        date: new Date(),
        description: 'from airport to hotel', // will not exist if chosen something other then taxi\bus\subway\train
        cost: 152,
        currency: 'usd',
        comments: 'was not paid by sisense', // optional within optional
      },
    ],
    comunication:[ // optional
      {
        name: 'sim card',
        cost: 152,
        currency: 'usd',
        comments: 'was not paid by sisense', // optional within optional
      },
    ],
    conference:[ // optional
      {
        name: 'geektime devfest',
        cost: 152,
        currency: 'usd',
        comments: 'was not paid by sisense', // optional within optional
      },
    ],
    other: [ // optional
      {
        name: 'Resturant',
        cost: 112,
        currency: 'usd',
        comments: 'steaks with customers', // optional within optional
      },
      {
        name: 'Resturant',
        cost: 1102,
        currency: 'nis',
        comments: 'steaks with other customers', // optional within optional
      },
    ],
  },
};
