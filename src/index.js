const express = require('express');
const { readJson } = require('./utils/fsUtils');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// req 1

app.get('/talker', async (_request, response) => {
  const db = await readJson();
  if (db.length === 0) {
    return response.status(HTTP_OK_STATUS).send([]);
  }
  return response.status(HTTP_OK_STATUS).send(db);
});

app.listen(PORT, () => {
  console.log('Online');
});
