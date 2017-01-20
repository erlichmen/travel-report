const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const request = require('request');
const xml2js = require('xml2js');

const utils = require('./common/utils');
const mail = require('./common/mail');

const app = express();
const PORT = process.env.port||8889;
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true,
}));

//Information
app.post('/api/export', (req, res)=>{
  utils.objectToExcelFile(req.body)
  .then(({filePath})=>{
    console.log('done1');
    res.sendFile(filePath);
  })
  .catch(err=>{
    console.error(err);
    res.json({err});
  });
});

app.post('/api/post', (req, res)=>{
  utils.objectToExcelFile(req.body)
  .then(mail.sendMail)
  .then(details=>{
    console.log('done2');
    res.json(details);
  })
  .catch(err=>{
    console.error(err);
    res.json({err});
  });
});

app.get('/api/rate/:curr/:year/:month/:day', (req, res)=>{
  const url = `http://www.boi.org.il/currency.xml?rdate=${req.params.year}${req.params.month}${req.params.day}&curr=${req.params.curr}`;
  var requestPromise = new Promise(function (resolve, reject) {
    request.get(url,(err, response, body)=>{
      if(err || !body){
        reject (err||'rate body is empty');
      }else{
        resolve(body);
      }
    });
  });
  requestPromise.then(function (body) {
    return new Promise(function (resolve, reject) {
      xml2js.parseString(body, (err, result)=>{
        if (result.CURRENCIES.CURRENCY[0].RATE[0]){
          const rate = parseFloat(result.CURRENCIES.CURRENCY[0].RATE[0]);
          resolve(rate);
        }else{
          reject(err||'no rate found');
        }
      });
    });
  }).then(function (rate) {
    res.json({rate});
  }).catch(function (err) {
    console.error(err);
    res.json({err});
  });
});

app.use('/', express.static(path.join(__dirname,'static')));

app.listen(PORT);
console.log(`listening on:  http://localhost:${PORT}/`);
