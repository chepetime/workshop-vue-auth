'use strict';

const express    = require('express');
const DB         = require('./db');
const config     = require('./config');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app    = express();
const router = express.Router();
const db     = new DB('sqlitedb');

// Router config
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// CORS middleware
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
};

app.use(allowCrossDomain);
app.use(router);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log('Server running at http://localhost:' + server.address().port);
});

/**
 * Register User
 */

router.post('register', (req, res) => {
  const saltRounds = 8;
  const newUser = [
    req.body.name,
    req.body.email,
    bcrypt.hashSync(req.body.password, saltRounds)
  ];

  db.insert(newUser, err => {
    if (err) return res.status(500).send('There was a problem registering the user.');

    db.selectByEmail(req.body.email, (err, user) => {
      if (err) return res.status(500).send('There was a problem getting user.');

      const expiresIn = 86400;
      const token = jwt.sign({ id: user.id }, config.secret, { expiresIn });

      res.status(200).send({ auth: true, token: token, user: user });
    });
  });
});

/**
 * Register Admin
 */

router.post('/register-admin', (req, res) => {
  const saltRounds = 8;
  const newAdmin = [
    req.body.name,
    req.body.email,
    bcrypt.hashSync(req.body.password, saltRounds),
    1
  ];

  db.insertAdmin(newAdmin, err => {
    if (err) return res.status(500).send('There was a problem registering the user.');

    db.selectByEmail(req.body.email, (err,user) => {
      if (err) return res.status(500).send('There was a problem getting user.');

      const expiresIn = 86400;
      const token = jwt.sign({ id: user.id }, config.secret, { expiresIn });

      res.status(200).send({ auth: true, token: token, user: user });
    });
  });
});

/**
 * Login
 */

router.post('/login', (req, res) => {
  db.selectByEmail(req.body.email, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    const expiresIn = 86400;
    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn });

    res.status(200).send({ auth: true, token: token, user: user });
  });
});
