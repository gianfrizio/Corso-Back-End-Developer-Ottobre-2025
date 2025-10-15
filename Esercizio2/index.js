const readline = require("readline");
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
rl.question("Come ti chiami? ", (nome) => {
rl.question("Quanti anni hai? ", (eta) => {
console.log(`Ciao ${nome}, hai ${eta} anni!`);
rl.close();
});
});