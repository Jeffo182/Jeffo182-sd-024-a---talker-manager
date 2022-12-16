const express = require('express');
const crypto = require('crypto');

const auth = require('./middlewares/auth');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateRage = require('./middlewares/validateRage');
const validateRate = require('./middlewares/validateRate');
const validateRate1 = require('./middlewares/validateRate1');

const { validate } = require('./middlewares/validateLogin');
const { readJson, writeJson, updateJson } = require('./utils/fsUtils');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;

const HTTP_FAIL_STATUS = 404;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_req, res) => {
  res.status(HTTP_OK_STATUS).send();
});

// req 1

app.get('/talker', async (_req, res) => {
  const db = await readJson();
  if (db.length === 0) {
    return res.status(HTTP_OK_STATUS).send([]);
  }
  return res.status(HTTP_OK_STATUS).send(db);
});

// req 2

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const db = await readJson();
    const filterById = db.find((element) => element.id === Number(id));
    if (!filterById) {
      return res.status(HTTP_FAIL_STATUS).send({
        message: 'Pessoa palestrante não encontrada',
      });
    }
    return res.status(HTTP_OK_STATUS).send(filterById);
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

// req 6

app.put(
  '/talker/:id',
  auth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  validateRate1,
  async (req, res) => {
    const { id } = req.params;
    const talkerEdit = req.body;
    const updatedTalker = await updateJson(id, talkerEdit);
    return res.status(HTTP_OK_STATUS).json(updatedTalker);
  },
);

app.listen(PORT, () => {
  console.log('Online');
});
