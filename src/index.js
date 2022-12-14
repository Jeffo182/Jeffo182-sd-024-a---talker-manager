const express = require('express');
const { readJson } = require('./utils/fsUtils');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_FAIL_STATUS = 404;
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

// req 2

app.get('/talker/:id', async (request, response) => {
  const { id } = request.params;
  const db = await readJson();
    const filterById = db.find((element) => element.id === Number(id));
    if (!filterById) {
      return response.status(HTTP_FAIL_STATUS).send({
        message: 'Pessoa palestrante não encontrada',
      });
    }
    return response.status(HTTP_OK_STATUS).send(filterById);
});

app.listen(PORT, () => {
  console.log('Online');
});
