const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  // Website you wish to allow to connect 
  res.setHeader('Access-Control-Allow-Origin', '*')
  // // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow ,
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow- Headers');
  // Pass to next layer of middleware
  next();
});

app
  .use(express.static(path.join(__dirname, 'src')))
  .set('views', path.join(__dirname, 'app'))
  .set('view engine', 'ejs')

app.get('/', (req, res) => res.render('app.component.html'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

  app.get('/users', async (req, res) => {
    try {
      const client = await pool.connect()
      var result = await client.query('SELECT * FROM ' + 'category');
  
      if (!result) {
        //not found
        return res.json(404, 'No data found');
      } else {
        result.rows.forEach(row => {
          console.log(row);
        });
        res.send(result.rows);
      }
      client.release();
  
    } catch (err) {
      //bad request
      console.error(err);
      res.json(400);
    }
  
    //ok
    res.json(200);
  });