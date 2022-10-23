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

app.get('/hook/healthcheck', (req, res) => {
  res.status(200).json({ msg: 'Webhook online' });
});

app.post('/hook', async (req, res) => {
  if (!TARGET)
    return res.status(501).send({ msg: 'There is not target url setted' });

  const payload = { ...req.body };

  const response = await fetch(TARGET, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return res.status(200).send(response);
});

app.listen(PORT, () => {
  console.log(`Webhook online. Listening on port ${PORT}`);
});
