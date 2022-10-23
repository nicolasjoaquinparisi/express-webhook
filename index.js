require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET;
const METHOD = process.env.METHOD;
const ORIGIN = process.env.USE_REQUEST_ORIGIN;
const SEND_DATA = process.env.SEND_DATA;

app.get('/hook/healthcheck', (req, res) => {
  res.status(200).json({ msg: 'Webhook online' });
});

app.post('/hook', async (req, res) => {
  if (!TARGET)
    return res.status(501).send({ msg: 'There is no target url setted' });
  if (!METHOD)
    return res.status(501).send({ msg: 'There is no http method setted' });

  const requestObject = {
    method: METHOD,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (ORIGIN && req.headers.origin)
    requestObject.headers['Origin'] = req.headers.origin;

  if (SEND_DATA) requestObject.body = JSON.stringify({ ...req.body });

  const response = await fetch(TARGET, requestObject);

  return res.status(200).send(response.json());
});

app.listen(PORT, () => {
  console.log(`Webhook online. Listening on port ${PORT}`);
});
