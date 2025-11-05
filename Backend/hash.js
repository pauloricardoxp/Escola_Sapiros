// hash.js
const bcrypt = require('bcrypt');

async function run() {
  const senha = process.argv[2];

  if (!senha) {
    console.log("Uso: node hash.js <senha>");
    process.exit(1);
  }

  const saltRounds = 10;
  const hash = await bcrypt.hash(senha, saltRounds);

  console.log("Senha original: ", senha);
  console.log("Hash gerado: ", hash);
}

run();
