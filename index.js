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
  request.get(url,(err, response, body)=>{
    xml2js.parseString(body,(err, result)=>{
      console.log(result);
      res.json(result);
    });
  });
});

app.use('/', express.static(path.join(__dirname,'static')));

app.listen(PORT);
console.log(`listening on:  http://localhost:${PORT}/`);
