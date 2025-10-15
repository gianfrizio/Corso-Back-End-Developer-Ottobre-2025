// main.js - File principale per usare il diario (versione async)

const {
	aggiungiVoce,
	scriviDiario,
	leggiDiario,
	rinominaDiario,
	cancellaDiario,
	contaVoci
} = require('./diario');

async function main() {
	console.log('🌟 Benvenuto nel Diario di Node! 🌟\n');

	try {
		console.log('📝 Aggiungo alcune voci al diario...\n');
		await aggiungiVoce("Oggi ho iniziato a imparare Node.js! È molto interessante e mi piace come posso gestire i file.");
		await aggiungiVoce('Ho imparato a creare moduli personalizzati e ad esportare funzioni. Il sistema module.exports è molto potente!');
		await aggiungiVoce('Sto facendo progressi! Ora so come leggere e scrivere file con il modulo fs.');

		const numero = await contaVoci();
		console.log(`\n📊 Numero di voci nel diario: ${numero}\n`);

		await leggiDiario();

		console.log('📝 Aggiungo un\'altra voce...\n');
		await aggiungiVoce('Questo esercizio mostra come usare le API asincrone di fs e gestire gli errori.');

		const numeroAgg = await contaVoci();
		console.log(`\n📊 Numero totale di voci: ${numeroAgg}\n`);

		// Esempio di scrittura completa (sovrascrive)
		// await scriviDiario('Questa è una sovrascrittura di esempio.');

		// Esempio di rinomina
		// await rinominaDiario('diario_backup.txt');

		// Esempio di cancellazione
		// await cancellaDiario();

	} catch (err) {
		// Errore non previsto
		console.error('💥 Errore imprevisto in main:', err && err.message ? err.message : err);
	}
}

main();
