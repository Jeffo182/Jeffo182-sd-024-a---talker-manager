const express = require('express');
const crypto = require('crypto');
const newFs = require('fs');
const path = require('path');

const auth = require('./middlewares/auth');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateRage = require('./middlewares/validateRage');
const validateRate = require('./middlewares/validateRate');
const validateRate1 = require('./middlewares/validateRate1');

const { validate } = require('./middlewares/validateLogin');
const { readJson, writeJson } = require('./utils/fsUtils');

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
  validateRate,
  async (req, res) => {
    const newTalker = req.body;
    await writeJson(newTalker);
    const db = await readJson();
    return res.status(HTTP_CREATED_STATUS).json(db[db.length - 1]);
  },
);

// req 6
const DATA_PATH = path.resolve(__dirname, './talker.json');

app.put(
  '/talker/:id',
  auth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate1,
  validateRate,

  (req, res) => {
    const { id } = req.params;
    const talkerEdit = req.body;
    const data = newFs.readFileSync(DATA_PATH, 'utf-8');
    const dataPasrse = JSON.parse(data);
    const result = dataPasrse.find((element) => element.id === Number(id));
    const otherTalkers = dataPasrse.filter((element) => element.id !== Number(id));
    const talkerUpdate = { ...result, ...talkerEdit };
    newFs.writeFileSync(DATA_PATH, JSON.stringify([...otherTalkers, talkerUpdate]));
    return res.status(200).json(talkerUpdate);
  },
);

// // REQ 7

app.delete('/talker/:id', auth, (request, response) => {
  const { id } = request.params;
  const data = newFs.readFileSync(DATA_PATH, 'utf-8');
  const dataPasrse = JSON.parse(data);
  const deleteTalkers = dataPasrse.filter((talker) => talker.id !== Number(id));
  newFs.writeFileSync(DATA_PATH, JSON.stringify([deleteTalkers]));
  response.status(204).json();
});

app.listen(PORT, () => {
  console.log('Online');
});
