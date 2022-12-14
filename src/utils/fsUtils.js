const fs = require('fs').promises;
const path = require('path');

async function readJson() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, '../talker.json'));
    const dataPased = JSON.parse(data);
    return dataPased;
  } catch (error) {
    console.error(`Erro na leitura do arquivo ${error}`);
  }
}

module.exports = {
  readJson,
};