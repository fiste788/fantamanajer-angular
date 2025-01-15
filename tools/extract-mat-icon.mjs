import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';

// Funzione per cercare ricorsivamente i file .html
function getHtmlFiles(folderPath) {
  let results = [];

  // Ottieni tutti i file e le cartelle all'interno della directory
  const files = readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = join(folderPath, file);
    const stat = statSync(filePath);

    // Se è una directory, esegui la ricerca ricorsiva
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      // Se è un file .html, aggiungilo ai risultati
      results.push(filePath);
    }
  });

  return results;
}

// Funzione per estrarre i contenuti dei tag <mat-icon>
function extractMatIconTexts(folderPath) {
  try {
    // Ottieni tutti i file .html ricorsivamente
    const files = getHtmlFiles(folderPath);

    let texts = [];

    // Leggi ogni file HTML
    files.forEach((filePath) => {
      const content = readFileSync(filePath, 'utf-8');

      // Regex per estrarre il testo dai tag <mat-icon>
      const regex = /<mat-icon[^>]*>(.*?)<\/mat-icon>/gi;
      let match;

      // Trova tutte le occorrenze dei tag <mat-icon>
      while ((match = regex.exec(content)) !== null) {
        texts.push(match[1].trim());
      }
    });

    // Rimuovi i duplicati usando un Set
    const uniqueTexts = [...new Set(texts)];

    // Restituisci i testi uniti da una virgola
    return uniqueTexts.sort().join(',');
  } catch (err) {
    console.error("Errore durante l'elaborazione dei file:", err);
  }
}

// Esegui la funzione con il percorso della cartella
const folderPath = process.argv[2] || './'; // Usa la cartella corrente se non viene specificata una cartella
const result = extractMatIconTexts(folderPath);

if (result) {
  console.log(result);
}
