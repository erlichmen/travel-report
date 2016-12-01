const emailjs = require('emailjs');

const server = emailjs.server.connect({
  host: 'il-mail1.corp.sisense.com',
  //  ssl:     true,
});

module.exports = {
  sendMail:({filePath, details})=>{
    return new Promise((resolve, reject)=>{
      const datesString = `${new Date(details.departureDate).toLocaleDateString().replace(/\//g,'_')}-${new Date(details.returnDate).toLocaleDateString().replace(/\//g,'_')}`;
      let message = {
        text: `Travel Report
        Name: ${details.name}
        Department: ${details.department}
        Dates: ${datesString}
        `,
        from:    'Travel Report <travel@sisense.com>',
        to:      'Soophie <sophie.shachar@sisense.com>',
        // cc:      'else <else@your-email.com>',
        subject: `Travel Report - ${details.name}`,
        attachment:
        [
          {path:filePath, type:'application/vnd.ms-excel', name:`${details.name} ${datesString}.xlsx`},
        ],
      };
      server.send(message, (err) => {
        if (err) return reject(err);
        return resolve(details);
      });
    });
  },
};
