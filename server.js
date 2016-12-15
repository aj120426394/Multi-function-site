const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const $ = require('cheerio');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Add headers


router.get('/weather-images', function(req, res) {
  http.get('http://www.bom.gov.au/products/IDR664.loop.shtml', (response) => {
    let body ='';
    response.on('data', d => {
      body += d;
    });
    response.on('end', () => {
      let localImages = body.match(/^theImageNames\[[0-9]\][^"]+\"([^"]+)\"/gm);
      console.log(localImages);
      const parsed = JSON.stringify(localImages);
      res.send(localImages);
    });

  });
});
app.use('/api', router);



const test = express();
test.use(express.static(path.join(__dirname, 'dist')));
test.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});
app.use('/test', test);



// app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'dist/index.html'))
  res.send("hello");
});



app.listen(8080, () => {
  // console.log($);
  console.log('Example app listening on port 8080 ');
});
