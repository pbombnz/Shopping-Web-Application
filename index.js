const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://slktkjqdlguipy:4ded203b27e39f6f28b2f74b28aed511072850bd2b9e79d4f62e97002914b49e@ec2-54-221-225-11.compute-1.amazonaws.com:5432/d2fbk5kajtmgo9',
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
    var result = await client.query('SELECT * FROM category');

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

// ~~~~~~~~~~GET API~~~~~~~~~~~~~//

//============ ITEMS ============//
app.get('/api/items', async (req, res) => {
  try {
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM items');

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

app.get('/api/items/fruits', async (req, res) => {
  try {
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM items WHERE type=2 ');

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

app.get('/api/items/meats', async (req, res) => {
  try {
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM items WHERE type=1 ');

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

app.get('/api/items/meats', async (req, res) => {
  try {
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM items WHERE type=3 ');

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

app.get('/api/items/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM items WHERE item_id='+id);

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
//===============================//


//============ USERS ============//

// Stub Endpoint
app.get('/api/users/validate', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect()
    // var result = await client.query('SELECT * FROM users WHERE user_id='+id);
    let result = false;

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

app.get('/api/users/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM users WHERE user_id='+id);

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

app.get('/api/users/:id/orders', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM orders WHERE user_id='+id);

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

app.get('/api/users/:id/orders/:orderid', async (req, res) => {
  try {
    let id = req.params.id;
    let orderId = req.params.orderid
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM orders WHERE user_id='+id+' AND order_id='+orderId);

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

app.get('/api/users/:id/orders/delivered', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM orders WHERE user_id='+id+'AND order_status=2');

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

app.get('/api/users/:id/orders/dispatched', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM orders WHERE user_id='+id+'AND order_status=1');

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

app.get('/api/users/:id/cart', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM orders WHERE user_id='+id+'AND order_status=0');

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
//===============================//

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//



// ~~~~~~~~~POST API~~~~~~~~~~~~~//
app.post('/api/users/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect()
    // var result = await client.query('SELECT * FROM users WHERE user_id='+id);
    let result = false;

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

app.post('/api/addToCart', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect()
    // var result = await client.query('SELECT * FROM users WHERE user_id='+id);
    let result = false;

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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//



// ~~~~~~~~~~PUT API~~~~~~~~~~~~~//
app.put('/api/users/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect()
    // var result = await client.query('SELECT * FROM users WHERE user_id='+id);
    let result = false;

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

app.put('/api/makeOrder', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect()
    // var result = await client.query('SELECT * FROM users WHERE user_id='+id);
    let result = false;

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

app.put('api/users/:id/cart/:itemid/appendQuantity/:qty', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect()
    // var result = await client.query('SELECT * FROM users WHERE user_id='+id);
    let result = false;

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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//