const fs = require('fs').promises;
const path = require('path');

const DATA_PATH = '../talker.json';

async function readJson() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, DATA_PATH));
    const dataPased = JSON.parse(data);
    return dataPased;
  } catch (error) {
    console.error(`Erro na leitura do arquivo ${error}`);
  }
}

async function writeJson(newElement) {
  try {
    const oldDB = await readJson();
    const newElementWhithId = { id: oldDB.length + 1, ...newElement };
    console.log(newElementWhithId);
    const allDB = JSON.stringify([...oldDB, newElementWhithId]);
    await fs.writeFile(path.resolve(__dirname, DATA_PATH), allDB);
    return 'Retornar o token';
  } catch (error) {
    console.error(`Erro na escrita do arquivo ${error}`);
  }
}

async function updateJson(id, updatedElement) {
    const oldDB = await readJson();
    const newElementWhithId = { id: oldDB.length + 1, ...updatedElement };
    const updatedTalkers = oldDB.reduce((talkersList, currentTalker) => {
      if (currentTalker.id === newElementWhithId.id) return [...talkersList, newElementWhithId];
      return [...talkersList, currentTalker];
    }, []);
    const updatedData = JSON.stringify(updatedTalkers);
    try {
      await fs.writeFile(path.resolve(__dirname, DATA_PATH), updatedData);
      return newElementWhithId;
    } catch (error) {
      console.error(`Erro na escrita do arquivo ${error}`);
    }
}

module.exports = {
  readJson,
  writeJson,
  updateJson,
};