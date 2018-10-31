// tslint:disable:prefer-const
// tslint:disable:no-var-keyword

// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';

import * as express from 'express';
import * as nodemailer from 'nodemailer';
import * as moment from 'moment';
const crypto = require('crypto');
const queryString = require('query-string');
const cors = require('cors');
const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
import { join } from 'path';
import { readFileSync } from 'fs';
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var transporter = nodemailer.createTransport({
  service: 'yahoo', // no need to set host or port etc.
  auth: {
    user: 'nwen.supermarket@yahoo.com',
    pass: 'w5mL0!JtmGsc'
  },
  debug: false,
  logger: true
});

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.js');
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');



const PORT = process.env.PORT || 5000;
const DIST_FOLDER = join(process.cwd(), 'dist');


const pool = new Pool({
  // tslint:disable-next-line:max-line-length
  connectionString: process.env.DATABASE_URL || 'postgres://slktkjqdlguipy:4ded203b27e39f6f28b2f74b28aed511072850bd2b9e79d4f62e97002914b49e@ec2-54-221-225-11.compute-1.amazonaws.com:5432/d2fbk5kajtmgo9',
  ssl: true
});

passport.serializeUser((user, done) => {
  console.log('Passport:: Serializing user....');
  console.log('user:', user);
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  console.log('Passport:: Deserializing user....');
  try {
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM users WHERE user_id=$1 LIMIT 1', [parseInt(id, 10)]);

    if (!result) {
      // not found
      done(null, false);
    } else {
      done(null, result.rows[0]);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    done(err, null);
  }
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: true
}, async (email, password, cb) => {
  console.log('Passport:: LocalStrategy: Callback executed.');
  try {
    const client = await pool.connect();
    let user = await client.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [email]);

    if (!user) {
      client.release();
      return cb(null, false);
    }
    let userData = user.rows[0];

    if (!bcrypt.compareSync(password, userData.password)) {
      client.release();
      return cb(null, false);
    }
    client.release();
    return cb(null, userData);

  } catch (err) {
    // bad request
    console.error(err);
    return cb(err);
  }
}));

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
const GOOGLE_CLIENT_ID = '597159162011-j3an5tojb0ljjp1ncc1k6gmdsm285idu.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '1TMFesVBVViIvtN2lIvnMfPk';
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    console.log('Passport:: GoogleStrategy: Callback executed.');
    console.log('profile: ', profile);

    // Check if user account has been already created.
    try {
      const client = await pool.connect();
      let query = await client.query('SELECT * FROM users WHERE google_id=$1', [profile.id]);

      if (!query) {
        // Failed SQL Call
        client.release();
        done('Database Error');
      } else {
        // Successful SQL Call
        if (query.rows.length > 0) {
          // Account Found. User has used Google ID login before.
        } else {
          // Account not found. Create an account for user.
          query = await client.query('INSERT INTO users(first_name, last_name, email, google_id, ' +
          'address_line1, address_line2, address_suburb, address_city, address_postcode, phone) ' +
          'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
          [profile.name.givenName, profile.name.familyName, profile.emails[0].value, profile.id, '', '', '', '', -1, '']);
        }
        const user = query.rows[0];
        client.release();
        done(null, user);
      }
    } catch (err) {
      // bad request
      console.error(err);
      done(err);
    }
  }
));



// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// tslint:disable-next-line:no-var-keyword
var app = express();

// View Engine Setup - Only load the template index.html file if the front-end build exists.
try {
  // Retrieving our index.html from the Angular build.
  let template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();
  app.engine('html', (_, options, callback) => {
    renderModuleFactory(AppServerModuleNgFactory, {
      // Our index.html
      document: template,
      url: options.req.url,
      // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
      extraProviders: [
        provideModuleMap(LAZY_MODULE_MAP)
      ]
    }).then(html => {
      callback(null, html);
    });
  });

  app.set('view engine', 'html');
  app.set('views', join(DIST_FOLDER, 'browser'));
} catch (e) {}

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(session({
  secret: 'thesecret',
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// =====================================
// Authentication Routes and Functions
// =====================================

/**
 * Only authenticated user is allowed on these routes that uses this middleware function.
 */
function authRequired(req, res, next) {
  if (req.isAuthenticated()/* && req.user*/) {
      next();
  } else {
      res.status(403).end(); // Forbidden Request
      // res.redirect('/login');
  }
}

/**
 * No authenticated user is allowed on these routes that uses this middleware function.
 * Ususally used on /api/login route when they are already logged in.
 */
function authNotAllowed(req, res, next) {
  if (!req.isAuthenticated()) {
      next();
  } else {
    res.status(403).end(); // Forbidden Request
    // res.redirect('/');
  }
}

/**
 * Any user is allowed on these routes that uses this middleware function.
 */
function authIgnore(req, res, next) {
  next();
}

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', authNotAllowed, passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  console.log(req.user);

  if (req.user.address_line1 === '' || req.user.address_line2 === '' || req.user.address_suburb === ''
  || req.user.address_city === '' || req.user.address_postcode === -1 || req.user.phone === '') {
    const query = queryString.stringify({
      'googleAuth': true,
    });
    res.redirect('/register?' + query);
  } else {
    res.redirect('/');
  }
});

// PUT /auth/google/register
//   Used when the user has logged in with Google, but has yet to complete the entire
//   registration process like filling in the address and phone number details. Below
//   is a route that allows them to fill in these details.
app.put('/auth/google/register', authRequired, async (req, res) => {
  try {
    const client = await pool.connect();

    let result = await client.query('UPDATE users SET address_line1=$1, address_line2=$2, address_suburb=$3, ' +
    'address_city=$4, address_postcode=$5, phone=$6 WHERE user_id=$7',
      [ req.body.address_line1, req.body.address_line2, req.body.address_suburb, req.body.address_city, req.body.address_postcode,
        req.body.phone, req.user.user_id]);

    if (!result) {
      // cannot update user information, contraint issue failed? user does not exists? other?
      res.status(400).json({ message: 'Could not create user because the some fields are invalid.' });
    } else {
      // The user information has been updated on the SQL server successfully. Need to update
      // session of user on Passport by relogging in.
      let user = Object.assign({}, req.user);
      user = Object.assign(user, {
      address_line1: req.body.address_line2,
      address_line2: req.body.address_line2,
      address_suburb: req.body.address_suburb,
      address_city: req.body.address_city,
      address_postcode: req.body.address_postcode,
      phone: req.body.phone
      });
      req.login(user, function(err) {
        if (err) {
          res.status(400).json({ message: err });
        }
        // Return a success message
        res.status(204).end();
      });
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);

    let errorMessage: string;
    const regex_alreadyExists = /^Key\s\((.+)\)=\(.+\) already exists\.$/;
    const found = err.detail.match(regex_alreadyExists);
    const capitalize = string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
    if (found) {
      errorMessage = `${capitalize(found[1])} is already used by another account. Please choose a different ${found[1]}.`;
    } else {
      errorMessage = err.detail;
    }
    res.status(400).json({ message: errorMessage });
  }
});

// GET /auth/loggedin
//   Called when the Angular Application is loaded. Allows us to check if the client session id
//   is still valid to use based on the response the server gives back. This also is helpful for
//   to retreive back their valid sessionId if the user closes the browser.
app.get('/auth/loggedin', authIgnore, (req, res) => {
  if (req.isAuthenticated()) {
    let userData = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      googleAuth: req.user.google_id != null,
    };
    res.json({ authenticated: true, user: userData });
  } else {
    res.json({ authenticated: false });
  }
});

// POST /auth/logout
//   Logs the user out. This route is suitable to use for logging a user out regardless of
//   the Strategy used for authentication.
app.get('/auth/logout', authRequired, (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Logout successful.'});
});

// POST /auth/local/register
//   Registers a new user through local authentication approach, that is with the use of email
//   and password. The body must contain all neccessary fields in order for this registration to
//   be succesful.
//
//   Fields in Body required:
//     first_name, last_name, email, encrpytedPassword, address_line1, address_line2,
//     address_suburb, address_city, address_postcode, phone.
app.post('/auth/local/register', authNotAllowed, async (req, res) => {
  try {
    const client = await pool.connect();

    const salt = bcrypt.genSaltSync(10);
    const encrpytedPassword = bcrypt.hashSync(req.body.password, salt);

    let result = await client.query('INSERT INTO users(first_name, last_name, email, password, ' +
      'address_line1, address_line2, address_suburb, address_city, address_postcode, phone) ' +
      'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING user_id',
      [req.body.first_name, req.body.last_name, req.body.email, encrpytedPassword, req.body.address_line1, req.body.address_line2,
       req.body.address_suburb, req.body.address_city, req.body.address_postcode, req.body.phone]);

    if (!result) {
      // cannot create user, contraint issue failed?
      res.status(400).json({ message: 'Could not create user because the some fields are invalid.' });
    } else {
      // Return a success message
      res.status(200).json({ message: 'Successful registration' });
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);

    let errorMessage: string;
    const regex_alreadyExists = /^Key\s\((.+)\)=\(.+\) already exists\.$/;
    const found = err.detail.match(regex_alreadyExists);
    const capitalize = string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
    if (found) {
      errorMessage = `${capitalize(found[1])} is already used by another account. Please choose a different ${found[1]}.`;
    } else {
      errorMessage = err.detail;
    }
    res.status(400).json({ message: errorMessage });
  }
});

// POST /auth/local
//   Logs the user in via Local Strategy (via email/password).
app.post('/auth/local', authNotAllowed, passport.authenticate('local'), (req, res) => {
  let userData = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email
  };
  res.json(userData);
});


app.get('/api/users', authRequired, async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM category');

    if (!result) {
      // not found
      return res.status(404).json({ 'message': 'No data found' });
    } else {
      // result.rows.forEach(row => {
      //   console.log(row);
      // });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.status(400);
  }
});

app.put('/auth/forgot-password', authNotAllowed, async (req, res) => {
  try {
    const client = await pool.connect();
    const userAccountResult = await client.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [req.body.email]);

    // Checks if any user is assoicated with specified email
    if (!userAccountResult) {
      // User not found
      client.release();
      return res.status(400).json({ message: 'User account does not exists with specified email. Please create an account instead.' });
    }

    const userAccount = userAccountResult.rows[0];

    // Checking if the user already has requested for a forgot password before, and whether it is still valid or not.
    // If either of those cases fail, create a new random token and an expiry date that expires in 24 hours.
    if (userAccount.password_reset_token) {
      const nowDate: moment.Moment = moment();
      const tokenExpiryDate: moment.Moment = moment(userAccount.password_reset_token_expiry);

      if (nowDate.isBefore(tokenExpiryDate)) {
        client.release();
        return res.status(400).json({
          message: 'You have already requested password reset. Look in your spam/junk mail folder to see if the email is there.'
        });
      }
    }

    // Getting here suggests that a new token and expiry need to be created.
    const token = await new Promise((resolve, reject) => {
      crypto.randomBytes(64, function(err, buffer) {
        if (err) {
          reject('Error generating token');
        }
        resolve(buffer.toString('hex'));
      });
    });
    // Create timestamp
    const expiryDateMoment: moment.Moment = moment().add(1, 'd');
    let expiryDate: string = expiryDateMoment.format();

    const result = await client.query('UPDATE users SET password_reset_token=$1, password_reset_token_expiry=$2 ' +
      'WHERE user_id=$3', [token, expiryDate, userAccount.user_id]);

    // If the SQL was successful, send an email to end-user with the reset password link, otherwise return an error.
    if (!result) {
      client.release();
      return res.status(500).json({
         message: 'Failed to create and save reset token and expiry date into database. Contact administrator for assistance.'
      });
    }
    // Setting up email parameters.
    var mailOptions = {
      from: 'NWEN304 Shopping Site <nwen.supermarket@yahoo.com>', // sender address
      to: `nwen.supermarket@yahoo.com, ${userAccount.email}`, // list of receivers
      subject: 'Shopping Site Password Reset', // Subject line
      text: `Click link to reset password:
      https://nwen304-project.herokuapp.com/password-reset?token=${token} \n\n
      You have 24 hours to reset your password using the link above`, // plaintext body
      html: `Click link to reset password:
      <b><a href="https://nwen304-project.herokuapp.com/password-reset?token=${token}">Link</a></b><br><br>
      You have 24 hours to reset your password using the link above.` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, response) {
      if (error) {
        console.error(error);
        res.status(400).json({ message: 'Email could not send. Make sure your email is correct.'});
      } else {
        res.status(204).end();
      }
    });
    client.release();
  } catch (err) {
    // bad request
    console.error(err);
    res.status(400).end();
  }
});

// ~~~~~~~~~~GET API~~~~~~~~~~~~~//

// ============ ITEMS ============//
app.get('/api/items', async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM items');

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});

app.get('/api/items/fruits', async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM items WHERE item_category=2 ');

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});

app.get('/api/items/meats', async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM items WHERE item_category=1 ');

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});

app.get('/api/items/veges', async (req, res) => {
  try {
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM items WHERE item_category=3 ');

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});

app.get('/api/items/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM items WHERE item_id=' + id);

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});
// ===============================//


// ============ USERS ============//

// Stub Endpoint
app.get('/api/users/validate', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect();
    // var result = await client.query('SELECT * FROM users WHERE user_id='+id);
    let result = { rows : null};

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});

app.get('/api/users/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM users WHERE user_id=' + id);

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});

app.get('/api/users/:id/orders', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM orders WHERE user_id=' + id);

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});

app.get('/api/users/:id/orders/:orderid', async (req, res) => {
  try {
    let id = req.params.id;
    let orderId = req.params.orderid;
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM orders WHERE user_id=' + id + ' AND order_id=' + orderId);

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});

app.get('/api/users/:id/orders/delivered', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM orders WHERE user_id=' + id + 'AND order_status=2');

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});

app.get('/api/users/:id/orders/dispatched', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM orders WHERE user_id=' + id + 'AND order_status=1');

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});

app.get('/api/users/:id/cart', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect();
    var result = await client.query('SELECT * FROM orders WHERE user_id=' + id + 'AND order_status=0');

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});
// ===============================//

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//



// ~~~~~~~~~POST API~~~~~~~~~~~~~//


app.post('/api/addToCart', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect();
    // var result = await client.query('SELECT * FROM users WHERE user_id='+id);
    let result = { rows : null};

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//



// ~~~~~~~~~~PUT API~~~~~~~~~~~~~//
app.put('/api/users/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect();
    // var result = await client.query('SELECT * FROM users WHERE user_id='+id);
    let result = { rows : null};

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});

app.put('/api/makeOrder', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect();
    // var result = await client.query('SELECT * FROM users WHERE user_id='+id);
    let result = { rows : null};

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});

app.put('/api/users/:id/cart/:itemid/appendQuantity/:qty', async (req, res) => {
  try {
    let id = req.params.id;
    const client = await pool.connect();
    // var result = await client.query('SELECT * FROM users WHERE user_id='+id);
    let result = { rows : null};

    if (!result) {
      // not found
      return res.json(404, 'No data found');
    } else {
      result.rows.forEach(row => {
        console.log(row);
      });
      res.send(result.rows);
    }
    client.release();

  } catch (err) {
    // bad request
    console.error(err);
    res.json(400);
  }

  // ok
  res.json(200);
});


// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
