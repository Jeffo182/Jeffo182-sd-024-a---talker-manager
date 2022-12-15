const express = require('express');
const crypto = require('crypto');

const auth = require('./middlewares/auth');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateRage = require('./middlewares/validateRage');
const { validate } = require('./middlewares/validateLogin');
const { readJson, writeJson } = require('./utils/fsUtils');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;

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

const generateToken = () => crypto.randomBytes(8).toString('hex');

// req 3 e 4

app.post('/login', validate, async (req, res) => 
   res.status(HTTP_OK_STATUS).json({ token: generateToken() }));

 // req 5

 app.post(
  '/talker',
  auth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRage,
  async (req, res) => {
    const newTalker = req.body;
    await writeJson(newTalker);
    const db = await readJson();
    return res.status(HTTP_CREATED_STATUS).json(db[db.length - 1]);
  },
);

app.listen(PORT, () => {
  console.log('Online');
});
