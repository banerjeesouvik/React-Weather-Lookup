const express = require('express');
const request = require('request');
var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = 8080;

app.get('/weather', function (req, res) {
  var loc = req.query.loc || '';
  request(`https://autocomplete.wunderground.com/aq?query=${loc}`, function (err, response, body) {
    if (err) {
      return res.send(err);
    }
    if (response) {
      res.send(response.body);
    }
  })
});

app.listen(port, () => {
  console.log(`Express listening on Port ${port}`);
});
